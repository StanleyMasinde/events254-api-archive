const Validator = require('mevn-validator')
const moment = require('moment-timezone')
const Event = require('../models/event')
const User = require('../models/user')
const upload = require('../filesystem/s3')
const Controller = require('./controller')

class EventsController extends Controller {
  /**
     * Store a new event in the database
     * @param {*} payload
     */
  async store (request) {
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
   * @param {Array} params
   */
  async show ({ params }) {
    const e = await Event.find(params.event)
    if (!e) {
      return this.response('Model not found', 404)
    }
    return this.response(e)
  }

  /**
   * Update an event
   * @param {Array} payload
   */
  async update (payload) {
    const { body, params } = payload
    // The the event Id
    const { event } = params
    // Load the current event
    const currentEvent = await Event.find(event)
    // A user can only update his/her own event
    // TODO add a middleware or policy for this
    // if (await currentEvent.user_id !== user.id) {
    //   return this.response('You dont\'t have permisiion to perfrom this action', 401)
    // }
    try {
      await new Validator(body, {
        type: 'required',
        title: 'required',
        description: 'required',
        from_date: 'required',
        from_time: 'required'
      }).validate()
      // create the from date
      // eslint-disable-next-line camelcase
      const { from_date, from_time, type, meeting_link, title, description } = body
      const from = this.formatToDateTime(from_time, from_date)
      const to = null
      // Payload is valid
      const res = await currentEvent.update({ type, meeting_link, title, description, from, to })
      // Looks good
      return this.response(res, 201)
    } catch (error) {
      return this.response(error, error.status || 422)
    }
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

    return moment(fromDateTime).tz(timezone).format()
  }
}

module.exports = new EventsController()
