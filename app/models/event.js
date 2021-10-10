const { Model, DB } = require('mevn-orm')
const moment = require('moment-timezone')

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
    try {
      const today = moment.tz('Africa/Nairobi').utc().toISOString()
      const offset = paginate * (page - 1)
      const records = await DB('events').whereRaw('startDate >= ?', today).count('id as recordCount')
      const totalShown = paginate * page
      const remaining = parseInt(records[0].recordCount) - totalShown
      const lastPage = parseInt(records[0].recordCount / paginate)
      const events = await DB('events')
        .where('startDate', '>=', today)
        .limit(paginate)
        .offset(offset)
        .orderBy('startDate', 'asc')
        .select()

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

module.exports = Event
