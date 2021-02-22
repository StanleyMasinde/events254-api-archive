const { DB } = require('mevn-orm')
const Ticket = require('../models/ticket')
const Controller = require('./controller')

class TicketController extends Controller {
  /**
     * Get all the tickets of the current event
     * @param {*} request the request body
     */
  async allEventTickets (request) {
    const { params } = request
    try {
      const events = await this.connection().where({ event_id: params.event })
      return this.response(events)
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
     * Create a ticket for the current event
     * @param {*} request the request body
     */
  async createEventTicket (request) {
    const { params, body } = request
    const { event } = params // Get the event ID
    const { price, limit, description } = body
    try {
      const ticket = await Ticket.create({
        price, limit, description, event_id: event
      })
      return this.response(ticket, 201)
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
     * Show a specified ticket for the current event
     * @param {*} request the request body
     */
  async showEventTicket (request) {
    try {
      const ticket = await Ticket.find(request.params.ticket)
      return this.response(ticket)
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
     * Update a ticket information
     * @param {*} request the request body
     */
  async upDateEventTicket (request) {
    try {
      const ticket = await Ticket.find(request.params.ticket)
      const { price, limit, description } = request.body
      await ticket.update({
        price, limit, description
      })
      return this.response(await this.connection().where({ id: request.params.ticket }).first()) // TODO fix this spaghetti
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
     * Delete a ticket
     * @param {*} request
     */
  async deleteEventTicket (request) {
    try {
      await Ticket.delete(request.params.ticket)
      return this.response('Ticket Deleted')
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
   * The database connection
   * @returns {DB}
   */
  connection () {
    return DB('tickets')
  }
}

module.exports = new TicketController()
