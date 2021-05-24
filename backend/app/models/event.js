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
    const offset = (paginate - 1) * page
    const records = await DB(this.tableName()).where('startDate', '>', new Date()).count('id as recordCount')
    const remaining = parseInt(records[0].recordCount / paginate) - (page * (paginate))
    const lastPage = parseInt(records[0].recordCount / paginate)
    const events = await DB(this.tableName())
      .where('startDate', '>', new Date())
      .limit(paginate)
      .offset(offset)
      .select()
    return {
      events, lastPage, remaining
    }
  }
}

module.exports = Event
