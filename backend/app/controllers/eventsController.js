const Validator = require('mevn-validator')
const moment = require('moment-timezone')
const { DB } = require('mevn-orm')
const pluralize = require('pluralize')
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
   * @param {*} request
   */
  async index (request) {
    // TODO add pagination
    try {
      let events = []
      if (request.query.paginate) {
        const eventsObject = await Event.landingPage(request.query.paginate, request.query.page)
        events = eventsObject.events
        // eslint-disable-next-line no-var
        var lastPageUrl = `/api/p/events/?paginate=${request.query.paginate}&page=${eventsObject.lastPage}`
      } else {
        events = await Event.all() // TODO deprecate this
      }
      const mapped = events.map((e) => {
        return {
          id: e.id,
          image: e.image,
          about: e.about,
          location: e.location,
          online_link: e.online_link,
          description: e.description,
          startDate: e.startDate,
          endDate: e.endDate,
          start: moment(e.startDate).tz('Africa/Nairobi').toLocaleString(),
          end: moment(e.endDate).tz('Africa/Nairobi').toLocaleString(),
          created_at: e.created_at,
          updated_at: e.updated_at
        }
      })
      if (request.query.paginate) {
        const currentPage = request.query.page || 0
        const nextPageUrl = `/api/p/events/?paginate=${request.query.paginate}&page=${parseInt(currentPage) + 1}`
        return this.response({
          currentPage,
          nextPageUrl,
          lastPageUrl,
          events: mapped
        })
      }
      return this.response(mapped)
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
     * Store a new event in the database
     * @param {*} payload
     */
  async store (request) {
    const { body, file } = request
    const user = await request.user()

    try {
      await new Validator(body, {
        about: 'required',
        location: 'required',
        description: 'required',
        start_date: 'required',
        start_time: 'required'
      })
        .validate()

      // eslint-disable-next-line camelcase
      const image = await upload(file, 'event-posters')

      // The data is valid
      // eslint-disable-next-line camelcase
      const { start_date, start_time, end_date, end_time, location, online_link, about, description } = body
      const startDate = formatToDateTime(start_time, start_date)
      const endDate = formatToDateTime(end_time, end_date) // TODO Add this field
      // eslint-disable-next-line camelcase
      const organisable_id = user.id // The authenticated user's ID
      // eslint-disable-next-line camelcase
      const organisable_type = 'User' // The organiser's Model can be group or user
      const e = await Event.create({ image, location, online_link, about, description, startDate, endDate, organisable_id, organisable_type })
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
      if (!e) { // The event was not found in the database
        return this.response('Model not found', 404)
      }
      e.organiser = await this.getEventOrganiser(e)
      const u = await request.user()
      if (!u) { // No user in session
        e.can_edit = false
        return this.response(e)
      }
      e.can_edit = canEditEvent(e, u)
      delete e.organisable_id
      delete e.organisable_type
      e.currentUserTicket = await DB('event_rsvps')
        .join('tickets', 'event_rsvps.ticket_id', '=', 'tickets.id')
        .where({
          'event_rsvps.event_id': e.id,
          'event_rsvps.user_id': u.id
        })
        .first('event_rsvps.id', 'event_rsvps.rsvp_count', 'tickets.type', 'tickets.price') || null

      e.attendees = await DB('event_rsvps')
        .join('users', 'event_rsvps.user_id', '=', 'users.id')
        .where({
          'event_rsvps.event_id': e.id
        })
        .select('users.name AS name', 'users.bio AS bio')
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
          start_date: 'required',
          start_time: 'required'
        }).validate()
        // eslint-disable-next-line camelcase
        const { start_date, start_time, end_date, end_time, location, about, description } = body
        const startDate = formatToDateTime(start_time, start_date)
        const endDate = formatToDateTime(end_time, end_date)
        const res = await currentEvent.update({ location, about, description, startDate, endDate }) // Payload is valid
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
      const data = {
        eventName: currentEvent.about,
        name: currentUser.name,
        ticketId,
        ticketCount: body.rsvp_count,
        currentTicket,
        date: new Date().toDateString(),
        ticketUrl: `${process.env.APP_URL}/tickets/${ticketId}`
      }
      await new Mail(currentUser, 'Your oder from Events254', { template: 'ticket', data }).send()
      return this.response('You have registered for this event')
    } catch (error) {
      return this.response(error, 422)
    }
  }

  /**
   * Get the event organisers
   * @param {Event} event
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
