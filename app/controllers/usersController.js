const Controller = require('./controller')
const User = require('../models/user')

class UserController extends Controller {

	/**
  * @returns {Object} A collection of users
  */
	async index() {
		try {
			return this.response(await User.all())
		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports = new UserController
