import { Model, DB } from 'mevn-orm'
import moment from 'moment-timezone'

class Event extends Model {
	/**
     * -------------------------------------------
     * Get all the tickets for the current model
     * -------------------------------------------
     */
	tickets () {
		return this.hasMany('Ticket')
	}

	/**
   * Get events for the landing page
   * @param {Number} paginate
   * @param {Number} offset
   */
	static async landingPage (paginate = 10, page = 1) {
		const offset = (page - 1) * paginate
		const now = moment.tz('Africa/Nairobi').format('YYYY-MM-DD HH:mm:ss')
		const endOfWeek = moment.tz('Africa/Nairobi').endOf('week').format('YYYY-MM-DD HH:mm:ss')
		const endOfMonth = moment.tz('Africa/Nairobi').endOf('month').format('YYYY-MM-DD HH:mm:ss')
		const startOfNextMonth = moment.tz('Africa/Nairobi').add(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss')
		const endOfNextMonth = moment.tz('Africa/Nairobi').add(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss')
		const nextMonth = moment.tz('Africa/Nairobi').add(1, 'month').format('MMMM')
		try {
			const upcomingEvents = await DB('events')
				.where('startDate', '>=', now)
				.orderBy('startDate', 'asc')
				.limit(paginate)
				.offset(offset)
				.select()
			const happeningThisWeek = await DB('events')
				.whereRaw(`startDate BETWEEN '${now}' AND '${endOfWeek}'`)
				.orderBy('startDate', 'asc')
				.limit(paginate)
				.select()
			const happeningThisMonth = await DB('events')
				.whereRaw(`startDate BETWEEN '${now}' AND '${endOfMonth}'`)
				.orderBy('startDate', 'asc')
				.limit(paginate)
				.select()
			const freeEvents = await DB('tickets')
				.whereRaw(`tickets.price = 0 AND events.startDate >= '${now}'`)
				.join('events', 'events.id', 'tickets.event_id')
				.orderBy('startDate', 'asc')
				.limit(paginate)
			const onlineEvents = await DB('events')
				.whereRaw(`online_link IS NOT NULL AND startDate >= '${now}'`)
				.orderBy('startDate', 'asc')
				.limit(paginate)
			const nextMonthEvents = await DB('events')
				.whereRaw(`startDate BETWEEN '${startOfNextMonth}' AND '${endOfNextMonth}'`)
				.orderBy('startDate', 'asc')
				.limit(paginate)
				.select()
			const happeningNowEvents = await DB('events')
				.whereRaw(`startDate <= '${now}' AND endDate >= '${now}'`)
				.orderBy('startDate', 'asc')
				.limit(paginate)
				.select()
			
	
			
			// Select from tickets where event_id = each event id
			const upcomingEventsTickets = await DB('tickets').select('*').where('event_id', 'IN', upcomingEvents.map(e => e.id))
			const happeningThisWeekTickets = await DB('tickets').select('*').where('event_id', 'IN', happeningThisWeek.map(e => e.id))
			const happeningThisMonthTickets = await DB('tickets').select('*').where('event_id', 'IN', happeningThisMonth.map(e => e.id))
			const nextMonthEventsTickets = await DB('tickets').select('*').where('event_id', 'IN', nextMonthEvents.map(e => e.id))
			const happeningNowEventsTickets = await DB('tickets').select('*').where('event_id', 'IN', happeningNowEvents.map(e => e.id))


			upcomingEvents.forEach((event) => {
				const ticketsForEvent = upcomingEventsTickets.filter(ticket => ticket.event_id === event.id)
				event.soldOut = ticketsForEvent.length === 0

				if (event.soldOut) {
					event.lowestPrice = 0
					event.highestPrice = 0
				} else {
					event.lowestPrice = ticketsForEvent.reduce((prev, current) => {
						if (prev.price > current.price) {
							return current
						}
						return prev
					}).price
					event.highestPrice = ticketsForEvent.reduce((prev, current) => {
						if (prev.price < current.price) {
							return current
						}
						return prev
					}).price
				}
				event.isFree = event.lowestPrice === 0
				if (!event.location) {
					event.isOnline = true
				} else {
					event.isOnline = false
				}
				if (!event.endDate) {
					event.isAllDay = true
					event.endDate = event.startDate
				}
				for (const key in event) {
					if (Object.hasOwnProperty.call(event, key)) {
						if (event[key] == null) {
							event[key] = 'N/A'
						}
					}
				}
			})

			happeningThisWeek.forEach((event) => {
				const ticketsForEvent = happeningThisWeekTickets.filter(ticket => ticket.event_id === event.id)
				event.soldOut = ticketsForEvent.length === 0

				if (event.soldOut) {
					event.lowestPrice = 0
					event.highestPrice = 0
				} else {
					event.lowestPrice = ticketsForEvent.reduce((prev, current) => {
						if (prev.price > current.price) {
							return current
						}
						return prev
					}).price
					event.highestPrice = ticketsForEvent.reduce((prev, current) => {
						if (prev.price < current.price) {
							return current
						}
						return prev
					}).price
				}
				event.isFree = event.lowestPrice === 0
				if (!event.location) {
					event.isOnline = true
				} else {
					event.isOnline = false
				}
				if (!event.endDate) {
					event.isAllDay = true
					event.endDate = event.startDate
				}
				for (const key in event) {
					if (Object.hasOwnProperty.call(event, key)) {
						if (event[key] == null) {
							event[key] = 'N/A'
						}
					}
				}
			})

			happeningThisMonth.forEach((event) => {
				const ticketsForEvent = happeningThisMonthTickets.filter(ticket => ticket.event_id === event.id)
				event.soldOut = ticketsForEvent.length === 0

				if (event.soldOut) {
					event.lowestPrice = 0
					event.highestPrice = 0
				} else {
					event.lowestPrice = ticketsForEvent.reduce((prev, current) => {
						if (prev.price > current.price) {
							return current
						}
						return prev
					}).price
					event.highestPrice = ticketsForEvent.reduce((prev, current) => {
						if (prev.price < current.price) {
							return current
						}
						return prev
					}).price
				}
				event.isFree = event.lowestPrice === 0
				if (!event.location) {
					event.isOnline = true
				} else {
					event.isOnline = false
				}
				if (!event.endDate) {
					event.isAllDay = true
					event.endDate = event.startDate
				}
				for (const key in event) {
					if (Object.hasOwnProperty.call(event, key)) {
						if (event[key] == null) {
							event[key] = 'N/A'
						}
					}
				}
			})

			freeEvents.forEach((event) => {
				event.soldOut = false
				event.lowestPrice = 0
				event.highestPrice = 0
				event.isFree = true
				if (!event.location) {
					event.isOnline = true
				} else {
					event.isOnline = false
				}
				if (!event.endDate) {
					event.isAllDay = true
					event.endDate = event.startDate
				}
				for (const key in event) {
					if (Object.hasOwnProperty.call(event, key)) {
						if (event[key] == null) {
							event[key] = 'N/A'
						}
					}
				}
			})

			onlineEvents.forEach((event) => {
				event.soldOut = false
				event.lowestPrice = 0
				event.highestPrice = 0
				event.isFree = true
				event.isOnline = true
				if (!event.endDate) {
					event.isAllDay = true
					event.endDate = event.startDate
				}
				for (const key in event) {
					if (Object.hasOwnProperty.call(event, key)) {
						if (event[key] == null) {
							event[key] = 'N/A'
						}
					}
				}
			})

			nextMonthEvents.forEach((event) => {
				const ticketsForEvent = nextMonthEventsTickets.filter(ticket => ticket.event_id === event.id)
				event.soldOut = ticketsForEvent.length === 0

				if (event.soldOut) {
					event.lowestPrice = 0
					event.highestPrice = 0
				} else {
					event.lowestPrice = ticketsForEvent.reduce((prev, current) => {
						if (prev.price > current.price) {
							return current
						}
						return prev
					}).price
					event.highestPrice = ticketsForEvent.reduce((prev, current) => {
						if (prev.price < current.price) {
							return current
						}
						return prev
					}).price
				}
				event.isFree = event.lowestPrice === 0
				if (!event.location) {
					event.isOnline = true
				} else {
					event.isOnline = false
				}
				if (!event.endDate) {
					event.isAllDay = true
					event.endDate = event.startDate
				}
				for (const key in event) {
					if (Object.hasOwnProperty.call(event, key)) {
						if (event[key] == null) {
							event[key] = 'N/A'
						}
					}
				}
			})

			happeningNowEvents.forEach((event) => {
				const ticketsForEvent = happeningNowEventsTickets.filter(ticket => ticket.event_id === event.id)
				event.soldOut = ticketsForEvent.length === 0

				if (event.soldOut) {
					event.lowestPrice = 0
					event.highestPrice = 0
				} else {
					event.lowestPrice = ticketsForEvent.reduce((prev, current) => {
						if (prev.price > current.price) {
							return current
						}
						return prev
					}).price
					event.highestPrice = ticketsForEvent.reduce((prev, current) => {
						if (prev.price < current.price) {
							return current
						}
						return prev
					}).price
				}
				event.isFree = event.lowestPrice === 0
				if (!event.location) {
					event = 'N/A'
				} 
				if (!event.endDate) {
					event.isAllDay = true
					event.endDate = event.startDate
				}
				for (const key in event) {
					if (Object.hasOwnProperty.call(event, key)) {
						if (event[key] == null) {
							event[key] = 'N/A'
						}
					}
				}
			})


			return {
				happeningNowEvents: {
					name: 'Happening Now',
					events: happeningNowEvents
				},
				upcomingEvents: {
					name: 'Upcoming events',
					events: upcomingEvents
				},
				happeningThisWeek: {
					name: 'This week',
					events: happeningThisWeek
				},
				happeningThisMonth: {
					name: 'This month',
					events: happeningThisMonth
				},
				nextMonthEvents: {
					name: nextMonth,
					events: nextMonthEvents
				},
				freeEvents: {
					name: 'Free events',
					events: freeEvents
				},
				onlineEvents: {
					name: 'Online events',
					events: onlineEvents
				}
			}
		
		} catch (error) {
			throw new Error(error)
		}
	}
}

export default Event
