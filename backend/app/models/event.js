const { Model, DB } = require('mevn-orm')
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
    const offset = paginate * page
    const today = new Date().toISOString().substr(0, 10)
    const records = await DB.raw('SELECT COUNT(id) as count FROM events WHERE DATE(startDate) >= ?', [today])
    const totalShown = paginate * page
    const remaining = parseInt(records[0][0].count) - totalShown
    const lastPage = parseInt(records[0][0].count / paginate)
    const events = await DB.raw('(SELECT * FROM events WHERE DATE(startDate) >= ? LIMIT ? OFFSET ?) ORDER BY `startDate` ASC', [today, parseInt(paginate), parseInt(offset)])
    return {
      events: events[0], lastPage, remaining
    }
  }
}

module.exports = Event
