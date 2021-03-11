const { DB } = require('mevn-orm')
const Validator = require('mevn-validator')
const slugify = require('../actions/slugify')
const upload = require('../filesystem/s3')
const Group = require('../models/group')
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
        const res = await group.update(body)
        return this.response(res, 201)
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
