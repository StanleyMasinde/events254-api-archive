const Controller = require('./controller')
const Group = require('../models/group')

class GroupController extends Controller {
	/**
      * @returns {Object} A collection of users
      */
	async index() {
		try {
			return this.response(await Group.all())
		} catch (error) {
			return this.response(error, 500)
		}
	}
}

module.exports = new GroupController