const Validator = require('mevn-validator')
const moment = require('moment-timezone')
const { DB } = require('mevn-orm')
const pluralize = require('pluralize')
const Event = require('../models/event')
const User = require('../models/user')
const upload = require('../filesystem/s3')
const canEditEvent = require('../policies/canEditEvent')
const mail = require('../mail/mail')
const Ticket = require('../models/ticket')
const PDF = require('../services/pdf')
const slugify = require('../actions/slugify')
const Controller = require('./controller')

class EventsController extends Controller {
  /**
   * GET all the events. This route is very unnecessary for normal users
   * IT will be usefull for debugging though
   * @param {*} request
   */
  async index () {
    // TODO add pagination
    try {
      const events = await Event.all()
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
          start: moment(e.startDate).tz('Africa/Nairobi').toString(),
          end: moment(e.endDate).tz('Africa/Nairobi').toString(),
          created_at: e.created_at,
          updated_at: e.updated_at
        }
      })
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
        from_date: 'required',
        from_time: 'required'
      })
        .validate()

      // eslint-disable-next-line camelcase
      const image = await upload(file, 'event-posters')

      // The data is valid
      // eslint-disable-next-line camelcase
      const { from_date, from_time, location, online_link, about, description } = body
      const startDate = this.formatToDateTime(from_time, from_date)
      const endDate = null // TODO Add this field
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
      e.organiser = await DB(pluralize(e.organisable_type))
        .where({
          id: e.organisable_id
        }).first('name', 'id') || null
      delete e.organisable_id
      delete e.organisable_type
      const u = await request.user()
      if (!u) { // No user in session
        e.can_edit = false
        return this.response(e)
      }
      e.can_edit = canEditEvent(e, u)
      e.currentUserTicket = await DB('event_rsvps')
        .join('tickets', 'event_rsvps.ticket_id', '=', 'tickets.id')
        .where({
          'event_rsvps.event_id': e.id,
          'event_rsvps.user_id': u.id
        })
        .first('event_rsvps.id', 'event_rsvps.rsvp_count', 'tickets.type', 'tickets.price') || null
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
          from_date: 'required',
          from_time: 'required'
        }).validate()
        // eslint-disable-next-line camelcase
        const { from_date, from_time, location, about, description } = body
        const startDate = this.formatToDateTime(from_time, from_date)
        const endDate = null
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
   * @param {*} user
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
   * @param {Array} param
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

      const ticket = new PDF({
        currentEvent,
        name: currentUser.name,
        ticketId,
        ticketCount: body.rsvp_count,
        currentTicket,
        date: new Date().toDateString()
      })
      // Send and email to user
      await mail.sendMail({
        from: '"Events254" <no-reply@events254.com>',
        to: currentUser.email,
        subject: 'Your oder from Events254',
        template: 'ticket',
        attachments: [{ filename: `${slugify(currentEvent.about)}.pdf`, content: ticket.createTicket() }],
        ctx: {
          eventName: currentEvent.about,
          name: currentUser.name,
          ticketId,
          ticketCount: body.rsvp_count,
          currentTicket,
          date: new Date().toDateString()
        }
      })
      return this.response('You have registered for this event')
    } catch (error) {
      return this.response(error, 422)
    }
  }

  /**
  * Format the date and time into a datetime field
  * @param {String} fromTime
  * @param {String} fromDate
  * @param {String} timezone
  * @returns new Date()
  */
  formatToDateTime (fromTime, fromDate, timezone = 'Africa/Nairobi') {
    /** Format the date */
    const fromTimeArray = fromTime.split(':')
    const fromDateArray = fromDate.split('-')
    const fromDateTime = new Date() // New date instance
    fromDateTime.setHours(fromTimeArray[0]) // Set the hours from the input
    fromDateTime.setMinutes(fromTimeArray[1]) // set the minutes from the input
    fromDateTime.setSeconds(0) // Seconds should always be zero
    fromDateTime.setFullYear(fromDateArray[0]) // set the year
    fromDateTime.setMonth(fromDateArray[1] - 1) // the month -1
    fromDateTime.setDate(fromDateArray[2]) // The day of the month
    const t = moment(fromDateTime, true).tz(timezone, true).toDate()
    return t
  }

  /**
   * Get the event organisers
   * @param {Array} event
   * @returns Object || null
   */
  async getEventOrganiser (event = {}) {
    return await DB(pluralize(event.organisable_type))
      .where({
        id: event.organisable_id
      }).first('name', 'id') || null
  }
}

module.exports = new EventsController()
