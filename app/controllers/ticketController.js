import { DB } from 'mevn-orm'
import Validator from 'mevn-validator'
import pluralize from 'pluralize'
import Ticket from '../models/ticket.js'
import Controller from './controller.js'

class TicketController extends Controller {
	/**
     * Get all the tickets of the current event
     * @param {*} request the request body
     */
	async allEventTickets(request) {
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
	async createEventTicket(request) {
		const { params, body } = request
		const { event } = params // Get the event ID
		const { price, limit, type } = body

		try {
			const ticket = await Ticket.create({
				price, limit, type, event_id: event
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
	async showEventTicket(request) {
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
	async upDateEventTicket(request) {
		try {
			await new Validator(request.body, {
				type: 'required'
			}).validate()

			const ticket = await Ticket.find(request.params.ticket)
			const { price, limit, type } = request.body
			await ticket.update({
				price, limit, type
			})
			return this.response(await this.connection().where({ id: request.params.ticket }).first()) // TODO fix this spaghetti
		} catch (error) {
			return this.response(error, 422)
		}
	}

	/**
     * Delete a ticket
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<void>}
     */
	async deleteEventTicket(req, res, next) {
		try {
			const ticket = await Ticket.find(req.params.ticket)
			if (ticket) {
				ticket.delete()
				return res.status(204).json()
			}
			return res.status(404).json(
				{
					message: 'Ticket not found'
				}
			)
		} catch (error) {
			return next(error)
		}
	}

	/**
   * Get the current user's tickets
   *
   * @param {Express.Request} request
   */
	async currentUser(request) {
		try {
			const user = await request.user()
			const tickets = await DB('event_rsvps')
				.join('tickets', 'event_rsvps.ticket_id', 'tickets.id')
				.join('events', 'tickets.event_id', 'events.id')
				.where({
					'event_rsvps.user_id': user.id
				})
				.select('events.about AS eventName', 'events.startDate AS eventDate', 'events.location AS eventLocation', 'event_rsvps.id AS ticketId', 'event_rsvps.rsvp_count AS ticketCount', 'tickets.type AS ticketType', 'tickets.price AS ticketPrice')
			return this.response(tickets)
		} catch (error) {
			return this.response(error, 500)
		}
	}

	/**
   * Get a ticket with ID
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
	async getTicket(req, res, next) {
		const ticketId = req.params.id
		try {
			const user = await req.user()
			const ticket = await DB('event_rsvps')
				.join('tickets', 'event_rsvps.ticket_id', 'tickets.id')
				.join('events', 'tickets.event_id', 'events.id')
				.where({
					'event_rsvps.id': ticketId
				})
				.first([
					'events.image AS image',
					'events.about AS eventName',
					'events.organisable_type as organisableType',
					'events.organisable_id as organisableId',
					'events.startDate AS eventDate',
					'events.location AS eventLocation',
					'event_rsvps.id AS ticketId',
					'event_rsvps.user_id AS userId',
					'event_rsvps.rsvp_count AS ticketCount',
					'tickets.type AS ticketType',
					'tickets.price AS ticketPrice',
					'tickets.currency AS currency'
				])
			// Validate the user. No one else is supposed to see the ticket
			if (user.id !== ticket.userId) {
				res.status(403).json('You are not authorized to view this resource')
				return
			}
			if (ticket.organisableType === 'User') {
				const organiser = await DB(pluralize(ticket.organisableType.toLowerCase()))
					.where({
						id: ticket.organisableId
					}).first('name', 'id')
				if (organiser) {
					organiser.type = 'user'
				}
			} else {
				if (!ticket.organisableType) {
					ticket.orgsniser = 'Organiszer not found'
				} else {
					const organiser = await DB(pluralize(ticket.organisableType.toLowerCase()))
						.where({
							id: ticket.organisableId
						}).first('name', 'slug', 'id')
					if (organiser) {
						organiser.type = 'group'
					}
					ticket.organiser = organiser
				}
			}
			delete ticket.organisableId; delete ticket.organisableType
			res.json(ticket)
		} catch (error) {
			next(error)
		}
	}

	/**
   * The database connection
   * @returns {DB}
   */
	connection() {
		return DB('tickets')
	}
}

export default new TicketController()
