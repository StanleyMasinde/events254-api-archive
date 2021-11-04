import { Router } from 'express'
import { DB } from 'mevn-orm'
import moment from 'moment'

const router = Router()

router.get('/', async (req, res, next) => {
	let sponsoredEvents = []
	let suggestedGroups = []
	let happeningNow = []
	let upcomingEvents = []
	// let userLocation = req.query.location
	let freeEvents = []
	let onlineEvents = []

	try {
		// Get all events happening now
		happeningNow = await DB('events')
			.select(DB.raw('events.id, events.about as name, events.description, \'events\' as linkPrefix, events.startDate, events.endDate, TIMEDIFF(events.startDate, events.endDate) as duration, events.image'))
			.where('startDate', '<', moment().format('YYYY-MM-DD HH:mm:ss'))
			.where('endDate', '>', moment().format('YYYY-MM-DD HH:mm:ss'))
			.orderByRaw('RAND()')
			.limit(10)

		// Get all 10 groups in random order
		suggestedGroups = await DB('groups')
			.select(DB.raw('slug as id, \'groups\' as linkPrefix, name, description, pictureUrl as image'))
			.orderByRaw('RAND()')
			.limit(10)

		// Get all upcoming events in random order
		upcomingEvents = await DB('events')
			.select(DB.raw('events.id, events.about as name, events.description, \'events\' as linkPrefix, events.startDate, events.endDate, TIMEDIFF(events.startDate, events.endDate) as duration, events.image'))
			.where('startDate', '>', moment().format('YYYY-MM-DD HH:mm:ss'))
			.orderByRaw('RAND()')
			.limit(10)

		// Get all free events in random order
		freeEvents = await DB('events')
			.select(DB.raw('events.id, events.about as name, events.description, \'events\' as linkPrefix, events.startDate, events.endDate, TIMEDIFF(events.startDate, events.endDate) as duration, events.image'))
			.join('tickets', 'events.id', 'tickets.event_id')
			.whereRaw('tickets.price = 0 AND events.startDate > NOW()')
			.orderByRaw('RAND()')
			.limit(10)

		// Get all online events in random order
		onlineEvents = await DB('events')
			.select(DB.raw('events.id, events.about as name, events.description, \'events\' as linkPrefix, events.startDate, events.endDate, TIMEDIFF(events.startDate, events.endDate) as duration, events.image'))
			.where('online_link', '!=', '')
			.orderByRaw('RAND()')
			.limit(10)

		// Get all sponsored events in random order
		sponsoredEvents = await DB('events')
			.select(DB.raw('events.id, events.about as name, events.description, \'events\' as linkPrefix, events.startDate, events.endDate, TIMEDIFF(events.startDate, events.endDate) as duration, events.image'))
			.where('is_sponsored', '=', 1)
			.orderByRaw('RAND()')
			.limit(10)

		res.json({
			sponsoredEvents: {
				name: 'Sponsored Events',
				data: sponsoredEvents
			},
			happeningNow: {
				name: 'Happening Now',
				data: happeningNow
			},
			suggestedGroups: {
				name: 'Suggested Groups',
				data: suggestedGroups
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
