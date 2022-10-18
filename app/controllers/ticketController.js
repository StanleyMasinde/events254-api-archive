import { DB } from 'mevn-orm'
import Validator from 'mevn-validator'
import pluralize from 'pluralize'
import Ticket from '../models/ticket.js'
import Controller from './controller.js'

class TicketController extends Controller {
	/**
	 * Get all the tickets of the current event
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {import('express').NextFunction} next
	 * @returns {Promise<void>}
	 */
	async allEventTickets(req, res, next) {
		const { params } = req
		try {
			const events = await DB('tickets')
				.where({ event_id: params.event })
			return res.status(200).json(events)
		} catch (error) {
			return next(error)
		}
	}

	/**
	 * Create a ticket for the current event
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {import('express').NextFunction} next
	 * @returns {Promise<void>}
	 */
	async createEventTicket(req, res, next) {
		const { params, body } = req
		try {
			await new Validator(body, {
				'type': 'required',
			}).validate()
		} catch (error) {
			return res.status(422).json(error)
		}

		const { event } = params // Get the event ID
		let { price, limit, type, availability, url } = body
		try {
			const ticket = await Ticket.create({
				price, limit, type, event_id: event, availability, url
			})
			return res.status(201).json(ticket)
		} catch (error) {
			return next(error)
		}
	}

	/**
	 * Show a specified ticket for the current event
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {import('express').NextFunction} next
	 * @returns {Promise<void>}
	 */
	async showEventTicket(req, res, next) {
		try {
			const ticket = await Ticket.find(req.params.ticket)
			if (!ticket) {
				return res.status(404).json({
					message: 'Ticket not found'
				})
			}
			res.json(ticket)
		} catch (error) {
			next(error)
		}
	}

	/**
	 * Update a ticket information
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {import('express').NextFunction} next
	 * @returns {Promise<void>}
	 */
	async upDateEventTicket(req, res, next) {
		try {
			await new Validator(req.body, {
				type: 'required'
			}).validate()

			const ticket = await Ticket.find(req.params.ticket)
			const { price, limit, type } = req.body
			await ticket.update({
				price, limit, type
			})
			res.json(await DB('tickets')
				.where({ id: req.params.ticket }).first()) // TODO fix this spaghetti
		} catch (error) {
			next(error)
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
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
	async currentUser(req, res, next) {
		try {
			const user = await req.user()
			const tickets = await DB('event_rsvps')
				.join('tickets', 'event_rsvps.ticket_id', 'tickets.id')
				.join('events', 'tickets.event_id', 'events.id')
				.where({
					'event_rsvps.user_id': user.id
				})
				.select('events.about AS eventName', 'events.startDate AS eventDate', 'events.location AS eventLocation', 'event_rsvps.id AS ticketId', 'event_rsvps.rsvp_count AS ticketCount', 'tickets.type AS ticketType', 'tickets.price AS ticketPrice')
			res.status(200).json(tickets)
		} catch (error) {
			next(error)
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
					'events.startDate AS eventDate', // TODO: change this to start date
					'events.endDate AS endDate',
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
