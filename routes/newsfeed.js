import { Router } from 'express'
import { DB } from 'mevn-orm'
import moment from 'moment'
const router = Router()

router.get('/', async (req, res, next) => {
	let upcomingEvents = []
	// let userLocation = req.query.location
	try {
		// Get all upcoming events in random order
		upcomingEvents = await DB('events')
			.select(DB.raw('events.id, events.about as name, SUBSTRING(events.description, 1, 100) as description, \'events\' as linkPrefix, events.startDate, events.endDate, TIMEDIFF(events.startDate, events.endDate) as duration, events.image'))
			.where('startDate', '>=', moment().format('YYYY-MM-DD HH:mm:ss'))
			.orderByRaw('startDate ASC')

		res.json({
			upcomingEvents: {
				name: 'Upcoming Events',
				data: upcomingEvents
			},
		})
	} catch (error) {
		next(error)
	}
})

export default router
