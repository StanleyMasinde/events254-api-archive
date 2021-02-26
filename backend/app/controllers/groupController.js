const Validator = require('mevn-validator')
const Group = require('../models/group')
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

  }

  /**
   * Show a specified group
   * We use the slug to identify a group.
   * e.g events-254-kenya
   * @param {Array} request
   * @returns Group
   */
  show (request) {}

  /**
   * Update information of a given group
   * @param {Array} request
   * @returns response
   */
  update (request) {}

  /**
   * Delete a given group from the database
   * @param {Array} request
   * @returns response
   */
  delete (request) {}

  /**
   * Make sure the payload is valid
   * @param {Array} body
   * @returns Promise
   */
  async validate (body) {
    await new Validator(body, {
      name: 'required',
      type: 'required',
      
    })
  }
}

module.exports = new GroupController()
