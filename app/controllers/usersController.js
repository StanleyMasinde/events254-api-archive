const User = require('../models/user')
const Controller = require('./controller')

class UserController extends Controller {
  /**
  * @returns {Object} A collection of users
  */
  async index () {
    try {
      return this.response(await User.all())
    } catch (error) {
      throw new Error(error)
    }
  }

  async register (details = []) {
    try {
      await User.register(details)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new UserController()
