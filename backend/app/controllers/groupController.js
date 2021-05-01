const { DB } = require('mevn-orm')
const Validator = require('mevn-validator')
const formatToDateTime = require('../actions/formatToDateTime')
const slugify = require('../actions/slugify')
const upload = require('../filesystem/s3')
const Event = require('../models/event')
const Group = require('../models/group')
const canEditEvent = require('../policies/canEditEvent')
const canManageGroup = require('../policies/canManageGroup')
const Controller = require('./controller')

class GroupController extends Controller {
  /**
   * Return all groups in the database.
   * By default, these results will paginated when the app grows
  * @returns {Object} A collection of users
  */
  async index () {
    try {
      return this.response(await Group.all())
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
   * Create a new group.
   * A group will contain the user that created it
   * @param {Array} request
   * @returns response
   */
  async create (request) {
    const { body, file } = request
    try {
      const user = await request.user() // The current user
      await this.validate(body) // 👀 Looks good let us add it to the DB
      const pictureUrl = await upload(file, 'groups')
      body.pictureUrl = pictureUrl
      body.slug = slugify(body.name) // TODO add group picture and Organiser's
      const group = await Group.create(body)
      await DB('group_organisers').insert({
        group_id: group.id,
        user_id: user.id
      })
      group.organisers = await group.organisers()
      group.organisers.map(o => delete o.password) // TODO this should happend at the model level
      return this.response(group, 201)
    } catch (error) {
      return this.response(error, 422)
    }
  }

  /**
   * Show a specified group
   * We use the slug to identify a group.
   * e.g events-254-kenya
   * @param {Array} request
   * @returns Group
   */
  async show (request) {
    const { params, user } = request
    const u = await user()
    try {
      const group = await Group.where({
        slug: params.slug
      }).first()

      if (group) {
        group.organisers = await group.organisers()
        group.organisers.map(o => delete o.password)
        group.isManager = canManageGroup(group, u)
        return this.response(group)
      }
      return this.response('Group not found', 404)
    } catch (error) {
      return this.response(error, error.status | 500)
    }
  }

  /**
   * Update information of a given group
   * @param {Array} request
   * @returns response
   */
  async update (request) {
    const { body, params, file } = request

    try {
      await this.validate(body)
      const group = await Group.where({
        slug: params.slug
      }).first()

      if (file) { // Append the picture URL id the file has been uploaded
        body.pictureUrl = await upload(file, 'groups')
      }

      body.slug = slugify(body.name) // TODO make sure the slug is unique
      if (group) {
        await group.update(body)
        return this.response(await Group.find(group.id), 201)
      }
      return this.response('We could not find the group 😢', 404)
    } catch (error) {
      return this.response(error, 422)
    }
  }

  /**
   * Delete a given group from the database
   * @param {Array} request
   * @returns response
   */
  async delete (request) {
    const group = await Group.where({
      slug: request.params.slug
    }).first()

    if (group) {
      await group.destroy()
      return this.response(`${group.name} has been deleted.`)
    }
    return this.response('Could not find the group 😢', 404)
  }

  /**
   * Get the groups managed by the current
   * @param {*} body
   * @returns
   */
  async currentUser (request) {
    const { user } = request
    try {
      const u = await user()
      const rows = await DB('group_organisers').where({ user_id: u.id })
      const groupIds = rows.map((group) => {
        return group.group_id
      })
      const groups = await DB('groups').whereIn('id', groupIds)
      return this.response(groups)
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
   * List all group events
   * @param {*} request
   */
  async groupEvents (request) {
    const filter = request.query.filter
    const { slug } = request.params
    try {
      const group = await Group.where({
        slug
      }).first()
      let events = []
      switch (filter) {
        case 'upcoming':
          events = await group.upcomingEvents()
          break
        case 'past':
          events = await group.pastEvents()
          break
        default:
          events = await group.events()
          break
      }
      return this.response(events)
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
   * Create a new event
   * @param {*} request
   */
  async createEvent (request) {
    const { body, file, params } = request
    const group = await Group.where({ slug: params.slug }).first()

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
      const startDate = formatToDateTime(from_time, from_date)
      const endDate = null // TODO Add this field
      // eslint-disable-next-line camelcase
      const organisable_id = group.id // The authenticated user's ID
      // eslint-disable-next-line camelcase
      const organisable_type = 'Group' // The organiser's Model can be group or user
      const e = await Event.create({ image, location, online_link, about, description, startDate, endDate, organisable_id, organisable_type })
      // Add the organiser
      return this.response(e, 201)
    } catch (error) {
      return this.response(error, error.status || 422)
    }
  }

  /**
   * Update a given event
   * @param {*} request
   */
  async updateEvent (request) {
    const { body, params } = request
    const { event, slug } = params // The the event Id
    const group = await Group.where({ slug }).first() // The current user
    const currentEvent = await Event.find(event) // Load the current event
    if (canEditEvent(currentEvent, group, 'Group')) {
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
        const startDate = formatToDateTime(from_time, from_date)
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
   * Delete a given event
   * @param {*} request
   */
  async deleteEvent (request) {
    const { params } = request
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
   * Make sure the payload is valid
   * @param {Array} body
   * @returns Promise
   */
  validate (body) {
    return new Validator(body, {
      name: 'required',
      description: 'required'
    }).validate()
  }
}

module.exports = new GroupController()
