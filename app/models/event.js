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
	static async landingPage (paginate = 15, page = 1) {
		const offset = (page - 1) * paginate
		const now = moment.tz('Africa/Nairobi').format('YYYY-MM-DD HH:mm:ss')
		try {
			const eventCount = await DB('events')
				.where('startDate', '>=', now)
				.count()
			const events = await DB('events')
				.where('startDate', '>=', now)
				.orderBy('startDate', 'asc')
				.limit(paginate)
				.offset(offset)
				.select()
			
			const lastPage = Math.ceil(eventCount[0]['count(*)'] / paginate)
			// const nextPage = page + 1
			// const prevPage = page - 1
			// const hasNextPage = nextPage <= lastPage
			// const hasPrevPage = prevPage >= 1
			const remaining = eventCount[0]['count(*)'] - (page * paginate)
			console.log(events)
			// Select from tickets where event_id = each event id
			const tickets = await DB('tickets').select('*').where('event_id', 'IN', events.map(e => e.id))

			events.forEach((event) => {
				// Get the tickets for each event
				const ticketsForEvent = tickets.filter(ticket => ticket.event_id === event.id)
				// Boolean to determine if the event is sold out
				event.soldOut = ticketsForEvent.length === 0
				// Get the lowest price for each event

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
					// Get the highest price for each event
					event.highestPrice = ticketsForEvent.reduce((prev, current) => {
						if (prev.price < current.price) {
							return current
						}
						return prev
					}).price
				}
				// Boolean to determine if event is free
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
			return {
				events, lastPage, remaining
			}
		} catch (error) {
			throw new Error(error)
		}
	}
}

export default Event
