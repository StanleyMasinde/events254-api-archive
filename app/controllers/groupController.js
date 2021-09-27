const { DB } = require('mevn-orm')
const Validator = require('mevn-validator')
const formatToDateTime = require('../actions/formatToDateTime')
const getEventOrganiser = require('../actions/getEventOrganiser')
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
  async index() {
    try {
      return this.response(await Group.all())
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
   * Create a new group.
   * A group will contain the user that created it
   * @param {Express.Request} request
   * @returns response
   */
  async create(request) {
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
      console.log(error);
      return this.response(error, 422)
    }
  }

  /**
   * Show a specified group
   * We use the slug to identify a group.
   * e.g events-254-kenya
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Group} group
   */
  async show(req, res, next) {
    try {
      const u = await req.user()
      console.log(u)
      const group = await Group.where({
        slug: req.params.slug
      }).first()

      if (group) {
        const m = await group.memberCount()
        group.organisers = await group.organisers()
        group.memberCount = m.members
        group.isManager = canManageGroup(group, u)
        group.isMember = await group.isMember(u)
        group.organisers.map(o => delete o.password)
        return res.json(group)
      }
      return res.status(404).json('We could not find the group 😢')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update information of a given group
   * @param {Express.Request} request
   * @returns response
   */
  async update(request) {
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
   * @param {Express.Request} request
   * @returns response
   */
  async delete(request) {
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
   * @param {Express.Request} request
   * @returns
   */
  async currentUser(request) {
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
   * Get the members of a particular group
   * @param {Express.Request} request
   * @returns
   */
  async members(request) {
    const slug = request.params.slug
    try {
      const group = await Group.where({
        slug
      }).first()
      return this.response(await group.members())
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
   * List all group events
   * @param {Express.Request} request
   */
  async groupEvents(request) {
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
   * @param {Express.Request} request
   */
  async createEvent(request) {
    const { body, file, params } = request
    const group = await Group.where({ slug: params.slug }).first()

    try {
      await new Validator(body, {
        about: 'required',
        location: 'required',
        description: 'required',
        startDate: 'required',
        startTime: 'required'
      })
        .validate()

      // eslint-disable-next-line camelcase
      const image = await upload(file, 'event-posters')

      // The data is valid
      // eslint-disable-next-line camelcase
      const { startDate, startTime, online_link, endDate, endTime, location, about, description } = body
      const startDateTime = formatToDateTime(startTime, startDate)
      const endDatetime = formatToDateTime(endTime, endDate)
      // eslint-disable-next-line camelcase
      const organisable_id = group.id // The authenticated user's ID
      // eslint-disable-next-line camelcase
      const organisable_type = 'Group' // The organiser's Model can be group or user
      const e = await Event.create({ image, location, online_link, about, description, startDate: startDateTime, endDate: endDatetime, organisable_id, organisable_type })
      // Add the organiser
      return this.response(e, 201)
    } catch (error) {
      return this.response(error, error.status || 422)
    }
  }

  /**
   * Show an event using it's id
   * @param {import('express').Request}
   * @param {import('superagent').Response}
   * @param {import('express').NextFunction}
   * @returns {Event} event
   */
  async showEvent(req, res, next) {
    try {
      const u = await req.user()
      const group = await Group.where({
        slug: req.params.slug
      }).first()

      if (group) {
        const event = await Event.where({
          id: req.params.event,
          organisable_type: 'Group',
          organisable_id: group.id
        }).first()

        if (event) {
          if (!event.endDate) {
            await event.update({
              endDate: event.startDate
            })
            event = await Event.find(request.params.event)
          }
          event.tickets = await DB('tickets')
            .where('event_id', event.id) || []
          event.isFree = event.tickets[0] == null
          event.allDay = new Date(event.startDate).getHours() === new Date(event.endDate).getHours()
          event.inProgress = new Date(event.startDate).getTime() < new Date().getTime() && new Date(e.endDate).getTime() > new Date().getTime()
          event.past = new Date(event.startDate).getTime() < new Date().getTime()
          event.hasEndTime = event.startDate !== event.endDate
          // TODO this is a temp fix
          event.attendees = await DB('event_rsvps')
            .join('users', 'event_rsvps.user_id', '=', 'users.id')
            .where({
              'event_rsvps.event_id': event.id
            })
            .select('users.name AS name', 'users.bio AS bio')
          event.organiser = await getEventOrganiser(event)
          event.can_edit = canEditEvent(event, u)
          if (u) {
            event.currentUserTicket = await DB('event_rsvps')
              .join('tickets', 'event_rsvps.ticket_id', '=', 'tickets.id')
              .where({
                'event_rsvps.event_id': event.id,
                'event_rsvps.user_id': u.id
              })
              .first('event_rsvps.id', 'event_rsvps.rsvp_count', 'tickets.type', 'tickets.price') || null
          }
          delete event.organisable_id; delete event.organisable_type
          if (!event.location) {
            event.location = 'N/A'
          }
          if (!event.online_link) {
            event.online_link = 'N/A'
          }
          return res.json(event)
        }
        return res.status(404).json('We could not find the event 😢')
      }
      return res.status(404).json('We could not find the event 😢')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update a given event
   * @param {Express.Request} request
   */
  async updateEvent(request) {
    const user = await request.user()
    const { body, params } = request
    const { event } = params // The the event Id
    const currentEvent = await Event.find(event) // Load the current event
    currentEvent.organiser = await getEventOrganiser(currentEvent)
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
        const endDateTime = formatToDateTime(endTime, endDate)
        const res = await currentEvent.update({ location, about, description, startDate: startDateTime, endDate: endDateTime }) // Payload is valid
        return this.response(res, 201) // Looks good
      } catch (error) {
        return this.response(error, error.status || 422)
      }
    }
    return this.response({ message: 'You don\'t have permission to perform this action' }, 401)
  }

  /**
   * Delete a given event
   * @param {Express.Request} request
   */
  async deleteEvent(request) {
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
   * User joins a group
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async join(req, res, next) {
    try {
      const group = await DB('groups').where('slug', req.params.slug).first()
      const user = await req.user()

      await DB('group_user').insert({
        user_id: user.id,
        group_id: group.id
      })

      res.status(201).json('')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Make sure the payload is valid
   * @param {Array} body
   * @returns Promise
   */
  validate(body) {
    return new Validator(body, {
      name: 'required',
      description: 'required'
    }).validate()
  }
}

module.exports = new GroupController()
