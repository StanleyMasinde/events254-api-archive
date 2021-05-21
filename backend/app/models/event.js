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
  static async landingPage (paginate = 15, page = 0) {
    const offset = paginate * page
    const records = await DB(this.tableName()).count()
    const lastPage = parseInt(records[0]['count(*)'] / paginate)
    const events = await DB(this.tableName())
      .where('startDate', '>', new Date())
      .where('id', '>', offset)
      .limit(paginate)
      .select()
    return {
      events, lastPage
    }
  }
}

module.exports = Event
