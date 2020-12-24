const Validator = require('mevn-validator')
const Event = require('../models/event')
const User = require('../models/user')
const Controller = require('./controller')

class EventsController extends Controller {
  /**
     * Store a new event in the database
     * @param {*} payload
     */
  async store (payload) {
    const { user, body } = payload
    try {
      await new Validator(body, {
        type: 'required',
        title: 'required',
        description: 'required',
        date: 'required',
        time: 'required',
        duration: 'required'
      }).validate()
      // The data is valid
      body.user_id = user.id
      const e = await Event.create(body)
      return this.response(e, 201)
    } catch (error) {
      return this.response(error, error.status || 422)
    }
  }

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
    const { user, body, params } = payload
    // The the event Id
    const { event } = params
    // Load the current event
    const currentEvent = await Event.find(event)
    // A user can only update his/her own event
    if (await currentEvent.user_id !== user.id) {
      return this.response('You dont\'t have permisiion to perfrom this action', 401)
    }
    try {
      await new Validator(body, {
        type: 'required',
        title: 'required',
        description: 'required',
        date: 'required',
        time: 'required',
        duration: 'required'
      }).validate()
      // Payload is valid
      const res = await currentEvent.update(body)
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
    const { user, params } = payload
    // The the event Id
    const { event } = params
    // Load the current event
    const currentEvent = await Event.find(event)
    // A user can only update his/her own event
    if (await currentEvent.user_id !== user.id) {
      return this.response('You dont\'t have permision to perfrom this action', 401)
    }
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
  async currentUserEvents (user) {
    try {
      const events = await new User(user.id).events()
      return this.response(events)
    } catch (error) {
      return this.response(error, 500)
    }
  }
}
module.exports = new EventsController()
