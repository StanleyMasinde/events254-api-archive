import { Router } from 'express'
import { DB } from 'mevn-orm'
import moment from 'moment'
const router = Router()

router.get('/', async (req, res, next) => {
	let sponsoredEvents = []
	let happeningNow = []
	let upcomingEvents = []
	// let userLocation = req.query.location
	let freeEvents = []
	let onlineEvents = []

	try {
		// Get all events happening now
		happeningNow = await DB('events')
			.select(DB.raw('events.id, events.about as name, SUBSTRING(events.description, 1, 100) as description, \'events\' as linkPrefix, events.startDate, events.endDate, TIMEDIFF(events.startDate, events.endDate) as duration, events.image'))
			.where('startDate', '<', moment().format('YYYY-MM-DD HH:mm:ss'))
			.where('endDate', '>', moment().format('YYYY-MM-DD HH:mm:ss'))
			.orderByRaw('RAND()')
			.limit(20)

		// Get all upcoming events in random order
		upcomingEvents = await DB('events')
			.select(DB.raw('events.id, events.about as name, SUBSTRING(events.description, 1, 100) as description, \'events\' as linkPrefix, events.startDate, events.endDate, TIMEDIFF(events.startDate, events.endDate) as duration, events.image'))
			.where('startDate', '>', moment().format('YYYY-MM-DD HH:mm:ss'))
			.orderByRaw('startDate ASC')
			.limit(20)

		// Get all free events in random order
		freeEvents = await DB('events')
			.select(DB.raw('events.id, events.about as name, SUBSTRING(events.description, 1, 100) as description, \'events\' as linkPrefix, events.startDate, events.endDate, TIMEDIFF(events.startDate, events.endDate) as duration, events.image'))
			.join('tickets', 'events.id', 'tickets.event_id')
			.whereRaw('tickets.price = 0 AND events.startDate > NOW()')
			.orderByRaw('startDate ASC')
			.limit(20)

		// Get all online events in random order
		onlineEvents = await DB('events')
			.select(DB.raw('events.id, events.about as name, SUBSTRING(events.description, 1, 100) as description, \'events\' as linkPrefix, events.startDate, events.endDate, TIMEDIFF(events.startDate, events.endDate) as duration, events.image'))
			.where('is_online', '=', '1')
			.andWhere('startDate', '>', moment().format('YYYY-MM-DD HH:mm:ss'))
			.orderByRaw('startDate ASC')
			.limit(20)

		// Get all sponsored events in random order
		sponsoredEvents = await DB('events')
			.select(DB.raw('events.id, events.about as name, SUBSTRING(events.description, 1, 100) as description, \'events\' as linkPrefix, events.startDate, events.endDate, TIMEDIFF(events.startDate, events.endDate) as duration, events.image'))
			.where('is_sponsored', '=', 1)
			.orderByRaw('startDate ASC')
			.limit(20)

		res.json({
			sponsoredEvents: {
				name: 'Sponsored Events',
				data: sponsoredEvents
			},
			happeningNow: {
				name: 'Happening Now',
				data: happeningNow
			},
			upcomingEvents: {
				name: 'Upcoming Events',
				data: upcomingEvents
			},
			freeEvents: {
				name: 'Free Events',
				data: freeEvents
			},
			onlineEvents: {
				name: 'Online Events',
				data: onlineEvents
			},
		})
	} catch (error) {
		next(error)
	}
})

export default router
