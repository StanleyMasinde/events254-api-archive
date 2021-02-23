const Validator = require('mevn-validator')
const moment = require('moment-timezone')
const { DB } = require('mevn-orm')
const Event = require('../models/event')
const User = require('../models/user')
const upload = require('../filesystem/s3')
const canEditEvent = require('../policies/canEditEvent')
const mail = require('../mail/mail')
const Ticket = require('../models/ticket')
const Controller = require('./controller')

class EventsController extends Controller {
  /**
     * Store a new event in the database
     * @param {*} payload
     */
  async store(request) {
    const { body, file } = request
    const user = await request.user()
    // eslint-disable-next-line camelcase
    const poster_url = await upload(file, 'event-posters')

    try {
      await new Validator(body, {
        type: 'required',
        title: 'required',
        description: 'required',
        from_date: 'required',
        from_time: 'required'
      })
        .validate()

      // The data is valid
      // eslint-disable-next-line camelcase
      const { from_date, from_time, type, meeting_link, title, description } = body
      const from = this.formatToDateTime(from_time, from_date)
      const to = null // TODO Add this field
      // eslint-disable-next-line camelcase
      const organisable_id = user.id // The authenticated user's ID
      // eslint-disable-next-line camelcase
      const organisable_type = 'User' // The organiser's Model can be group or user
      const e = await Event.create({ poster_url, type, meeting_link, title, description, from, to, organisable_id, organisable_type })
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
  async show(request) {
    const e = await Event.find(request.params.event)
    const u = await request.user()
    if (!e) {
      return this.response('Model not found', 404)
    }
    e.can_edit = canEditEvent(e, u)
    return this.response(e)
  }

  /**
   * Update an event
   * @param {Array} request
   */
  async update(request) {
    const { body, params } = request
    const user = await request.user() // The current user
    const { event } = params // The the event Id
    const currentEvent = await Event.find(event) // Load the current event
    if (canEditEvent(currentEvent, user)) {
      try {
        await new Validator(body, { // Validate to input
          type: 'required', // TODO refactor this
          title: 'required',
          description: 'required',
          from_date: 'required',
          from_time: 'required'
        }).validate()
        // eslint-disable-next-line camelcase
        const { from_date, from_time, type, meeting_link, title, description } = body
        const from = this.formatToDateTime(from_time, from_date)
        const to = null
        const res = await currentEvent.update({ type, meeting_link, title, description, from, to }) // Payload is valid
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
  async delete(payload = {}) {
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
  async currentUserEvents(request) {
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
  async registerForEvent({ body, params, user }) {
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
      await mail.sendMail({
        from: '"Events254" <no-reply@events254.com>',
        to: currentUser.email,
        subject: 'Your oder from Events254',
        template: 'ticket',
        ctx: {
          eventName: currentEvent.title,
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
  formatToDateTime(fromTime, fromDate, timezone = 'Africa/Nairobi') {
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
    const t = moment(fromDateTime).tz(timezone).toISOString()
    return new Date(t)
  }
}

module.exports = new EventsController()
