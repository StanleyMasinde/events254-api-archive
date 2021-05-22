const { DB } = require('mevn-orm')
const moment = require('moment-timezone')
const Controller = require('./controller')

class SearchController extends Controller {
  /**
   * Handle search request
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   */
  async index (request, response) {
    // TODO midularize this search
    const query = request.query.q
    const eventsTable = DB('events')
    const groupsTable = DB('groups')
    const usersTable = DB('users')
    try {
      const events = await eventsTable.where('about', 'like', `%${query}%`)
        .orWhere('description', 'like', `%${query}%`)
        .orWhere('location', 'like', `%${query}%`)
        .select('id', 'about', 'startDate', 'image', 'location').limit(50)

      const groups = await groupsTable.where('name', 'like', `%${query}%`)
        .orWhere('description', 'like', `%${query}%`)
        .limit(30)

      const users = await usersTable.where('name', 'like', `%${query}%`).limit(30)

      response.json({
        events, groups, users
      })
    } catch (error) {
      response.status(500).json(error)
    }
  }

  /**
   * Handle the calendar filter
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async calendar (req, res) {
    // TODO add timezone
    const startDate = moment(req.query.date).toISOString()
    const endDate = moment(req.query.date).add(1, 'day').toISOString()
    try {
      const events = await DB('events')
        .whereBetween('startDate', [startDate, endDate]).limit(100)

      res.json(events)
    } catch (error) {
      res.status(500).json(new Error().message)
    }
  }
}
module.exports = new SearchController()
