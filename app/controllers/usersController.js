const Validator = require('mevn-validator')
const mail = require('../mail/mail')
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

  /**
   * Register a new user
   * @param {*} details
   */
  async register (details = []) {
    try {
      // Validate the input
      await new Validator(details, {
        name: 'required',
        email: 'required|email',
        password: 'required|min:8'
      })
        .validate()

      const u = await User.register(details)
      // TODO use queing here
      await mail.sendMail({
        from: '"Events254" <no-reply@events254.com>',
        to: details.email,
        subject: 'Welcome to Events254',
        template: 'main',
        context: {
          user: details
        }
      })
      return this.response(u)
    } catch (error) {
      return this.response(error, error.status || 422)
    }
  }
}

module.exports = new UserController()
