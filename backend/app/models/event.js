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
    const today = moment.tz('Africa/Nairobi').utc().toISOString()
    const offset = paginate * (page - 1)
    const records = await DB(this.tableName()).where('startDate', '>', new Date()).count('id as recordCount')
    const totalShown = paginate * page
    const remaining = parseInt(records[0].recordCount) - totalShown
    const lastPage = parseInt(records[0].recordCount / paginate)
    const events = await DB(this.tableName())
      .where('startDate', '>', today)
      .limit(paginate)
      .offset(offset)
      .orderBy('startDate', 'desc')
      .select()
    return {
      events, lastPage, remaining
    }
  }
}

module.exports = Event
