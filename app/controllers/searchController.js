import { DB } from 'mevn-orm'
import Controller from './controller.js'

class SearchController extends Controller {
	/**
   * Handle search request
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   */
	async index(request, response) {
		// TODO midularize this search
		const query = request.query.q
		const eventsTable = DB('events')
		const groupsTable = DB('groups')
		const usersTable = DB('users')
		try {
			const res = await DB.
				raw('SELECT id, about,startDate,image,location  FROM events WHERE MATCH(about, description) AGAINST(? IN NATURAL LANGUAGE MODE)', [query])
			const events = res[0]

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
	async calendar(req, res, next) {
		let month
		let year
		if (!req.query.date) {
			month = new Date().getMonth() + 1
			year = new Date().getFullYear()
		}
		else {
			month = req.query.date.split('-')[1]
			year = req.query.date.split('-')[0]
		}

		try {
			const events = await DB.raw('SELECT `id`, `about`, `startDate`, `endDate`, `location`, TIMEDIFF(endDate, startDate) AS duration FROM events WHERE MONTH(startDate) = ? AND YEAR(startDate) = ?', [month, year])
			events[0].map(event => {
				if (!event.endDate) {
					event.endDate = event.startDate
				}
				return event
			})
			res.json(events[0])
		} catch (error) {
			next(error)
		}
	}
}
export default new SearchController()
