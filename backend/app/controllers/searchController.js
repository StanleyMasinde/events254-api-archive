const { DB } = require('mevn-orm')
const Controller = require('./controller')

class SearchController extends Controller {
  /**
   * Handle search request
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   */
  async index (request, response) {
    const query = request.query.q
    const eventsTable = DB('events')
    const groupsTable = DB('groups')
    const usersTable = DB('users')
    try {
      const events = await eventsTable.where('about', 'like', `%${query}%`)
        .orWhere('description', 'like', `%${query}%`)
        .select('id', 'about', 'startDate', 'image').limit(10)

      const groups = await groupsTable.where('name', 'like', `%${query}%`)
        .orWhere('description', 'like', `%${query}%`)
        .limit(10)

      const users = await usersTable.where('name', 'like', `%${query}%`).limit(10)

      response.json({
        events, groups, users
      })
    } catch (error) {
      response.status(500).json(error)
    }
  }
}
module.exports = new SearchController()
