const Validator = require('mevn-validator')
const { DB } = require('mevn-orm')
const pluralize = require('pluralize')
const ical = require('ical-generator').default
const axios = require('axios').default
const Event = require('../models/event')
const User = require('../models/user')
const upload = require('../filesystem/s3')
const canEditEvent = require('../policies/canEditEvent')
const Mail = require('../mail/mail')
const Ticket = require('../models/ticket')
const formatToDateTime = require('../actions/formatToDateTime')
const Controller = require('./controller')

class EventsController extends Controller {
  /**
   * GET all the events. This route is very unnecessary for normal users
   * IT will be usefull for debugging though
   * @param {import('express').Request} request
   */
  async index (request) {
    // TODO add pagination
    try {
      let events = []
      if (request.query.paginate) {
        const eventsObject = await Event.landingPage(request.query.paginate, request.query.page)
        const currentPage = request.query.page || 1
        events = eventsObject.events
        let lastPageUrl
        let nextPageUrl
        if (eventsObject.lastPage === 0) {
          lastPageUrl = null
        } else {
          lastPageUrl = `/api/p/events/?paginate=${request.query.paginate}&page=${eventsObject.lastPage}`
        }

        if (eventsObject.remaining <= 0) {
          nextPageUrl = null
        } else {
          nextPageUrl = `/api/p/events/?paginate=${request.query.paginate}&page=${parseInt(currentPage) + 1}`
        }

        return this.response({
          currentPage,
          nextPageUrl,
          lastPageUrl,
          remaining: eventsObject.remaining, // TODO for debugging only
          events
        })
      } else {
        events = await Event.all() // TODO deprecate this
      }
      return this.response(events)
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
     * Store a new event in the database
     * @param {import('express').Request} request
     */
  async store (request) {
    const { body, file } = request
    const user = await request.user()
    try {
      await new Validator(body, {
        about: 'required',
        description: 'required',
        startDate: 'required',
        startTime: 'required'
      })
        .validate()

      let image
      if (file) {
        image = await upload(file, 'event-posters')
      } else {
        const { data } = await axios.get(`https://api.unsplash.com/search/photos?page=1&query=${body.about}&client_id=pOTyoPLsz5ef-yfgY549ovpcsN4Lv622n_MYA4H9Tj8&per_page=1&orientation=landscape`)
        image = data.results[0].urls.regular ? data.results[0].urls.regular : 'https://placeimg.com/640/500/null?30219'
      }

      // The data is valid
      // eslint-disable-next-line camelcase
      const { startDate, startTime, endDate, endTime, location, online_link, about, description } = body
      const startDateTime = formatToDateTime(startTime, startDate)
      const endDateTime = formatToDateTime(endTime, endDate) // TODO Add this field
      // eslint-disable-next-line camelcase
      const organisable_id = user.id // The authenticated user's ID
      // eslint-disable-next-line camelcase
      const organisable_type = 'User' // The organiser's Model can be group or user
      const e = await Event.create({
        image,
        location,
        online_link,
        about,
        description,
        startDate: startDateTime,
        endDate: endDateTime,
        organisable_id,
        organisable_type
      })
      // Add the organiser
      return this.response(e, 201)
    } catch (error) {
      return this.response(error, error.status || 422)
    }
  }

  /**
   * Show an event
   * @param {Array} request
   */
  async show (request) {
    try {
      const e = await Event.find(request.params.event)
      const u = await request.user()
      if (!e) { // The event was not found in the database
        return this.response('Model not found', 404)
      }
      // TODO this is a temp fix
      e.attendees = await DB('event_rsvps')
        .join('users', 'event_rsvps.user_id', '=', 'users.id')
        .where({
          'event_rsvps.event_id': e.id
        })
        .select('users.name AS name', 'users.bio AS bio')
      e.organiser = await this.getEventOrganiser(e)
      e.can_edit = canEditEvent(e, u)
      if (u) {
        e.currentUserTicket = await DB('event_rsvps')
          .join('tickets', 'event_rsvps.ticket_id', '=', 'tickets.id')
          .where({
            'event_rsvps.event_id': e.id,
            'event_rsvps.user_id': u.id
          })
          .first('event_rsvps.id', 'event_rsvps.rsvp_count', 'tickets.type', 'tickets.price') || null
      }
      delete e.organisable_id
      delete e.organisable_type
      if (!e.endDate) {
        e.endDate = e.startDate
      }
      if (!e.location) {
        e.location = 'N/A'
      }
      if (!e.online_link) {
        e.online_link = 'N/A'
      }
      return this.response(e)
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
   * Update an event
   * @param {Array} request
   */
  async update (request) {
    const { body, params } = request
    const user = await request.user() // The current user
    const { event } = params // The the event Id
    const currentEvent = await Event.find(event) // Load the current event
    if (canEditEvent(currentEvent, user)) {
      try {
        await new Validator(body, { // Validate to input
          about: 'required',
          location: 'required',
          description: 'required',
          startDate: 'required',
          startTime: 'required'
        }).validate()
        // eslint-disable-next-line camelcase
        const { startDate, startTime, endDate, endTime, location, about, description } = body
        const startDateTime = formatToDateTime(startTime, startDate)
        const endDatetime = formatToDateTime(endTime, endDate)
        const res = await currentEvent.update({ location, about, description, startDate: startDateTime, endDate: endDatetime }) // Payload is valid
        return this.response(res, 201) // Looks good
      } catch (error) {
        return this.response(error, error.status || 422)
      }
    }
    return this.response({ message: 'You don\'t have permission to perform this action' }, 401)
  }

  /**
   * Delete the current model
   * @param {Array} payload
   */
  async delete (payload = {}) {
    const { params } = payload
    // The the event Id
    const { event } = params
    // Load the current event
    const currentEvent = await Event.find(event)
    // A user can only update his/her own event
    // TODO add this middleware
    // if (await currentEvent.user_id !== user.id) {
    //   return this.response('You dont\'t have permision to perfrom this action', 401)
    // }
    try {
      await currentEvent.destroy()
      return this.response('Deleted')
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
   * Get the events for the current user
   * @param {Express.Request} request
   */
  async currentUserEvents (request) {
    try {
      const user = await request.user()
      const events = await new User(user.id).events()
      return this.response(events)
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
   * -----------------------------------------------------------------
   * User registers for an event
   * @param {import('express').Request} param
   * @returns response
   *
   */
  async registerForEvent ({ body, params, user }) {
    try {
      await new Validator(body, { // Validate the input
        ticket_id: 'required',
        rsvp_count: 'required'
      }).validate()
      const currentUser = await user() // The user making the request
      // Next we check if the current user has registerd for the current event
      const alreadyRegisterd = await DB('event_rsvps').where({ event_id: params.event, user_id: currentUser.id }).first()
      if (alreadyRegisterd) {
        return this.response('You have already registerd for this event')
      }
      const currentEvent = await Event.find(params.event)
      const currentTicket = await Ticket.find(body.ticket_id)
      const ticketId = await DB('event_rsvps').insert({
        event_id: params.event, user_id: currentUser.id, ticket_id: body.ticket_id, rsvp_count: body.rsvp_count
      })
      // Send and email to user
      // TODO add attachments and refactor
      const icsData = ical({
        name: currentEvent.about,
        events: [
          {
            start: currentEvent.startDate,
            end: currentEvent.endDate,
            summary: currentEvent.about,
            location: currentEvent.location,
            url: currentEvent.online_link
          }
        ]
      })
      const icalString = icsData.toString()
      const data = {
        eventName: currentEvent.about,
        name: currentUser.name,
        ticketId,
        ticketCount: body.rsvp_count,
        currentTicket,
        date: new Date().toDateString(),
        ticketUrl: `${process.env.APP_URL}/tickets/${ticketId}`,
        icalString
      }
      await new Mail(currentUser, 'Your order from Events254', { template: 'ticket', data }).send()
      return this.response('You have registered for this event')
    } catch (error) {
      return this.response(error, 422)
    }
  }

  /**
   * Get the event organisers
   * @param {import('../models/event')} event
   * @returns Object || null
   */
  async getEventOrganiser (event = {}) {
    const organisableType = event.organisable_type
    if (organisableType === 'User') {
      const organiser = await DB(pluralize(organisableType.toLowerCase()))
        .where({
          id: event.organisable_id
        }).first('name', 'id')
      if (organiser) {
        organiser.type = 'user'
      }
      return organiser
    }
    const organiser = await DB(pluralize(organisableType.toLowerCase()))
      .where({
        id: event.organisable_id
      }).first('name', 'slug', 'id')
    if (organiser) {
      organiser.type = 'group'
    }
    return organiser
  }
}

module.exports = new EventsController()
