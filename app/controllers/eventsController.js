import Validator from 'mevn-validator'
import { DB } from 'mevn-orm'
import ical from 'ical-generator'
import axios from 'axios'
import Event from '../models/event.js'
import User from '../models/user.js'
import upload from '../filesystem/s3.js'
import canEditEvent from '../policies/canEditEvent.js'
import Mail from '../mail/mail.js'
import Ticket from '../models/ticket.js'
import formatToDateTime from '../actions/formatToDateTime.js'
import getEventOrganiser from '../actions/getEventOrganiser.js'
import Controller from './controller.js'

class EventsController extends Controller {
	/**
   * GET all the events. This route is very unnecessary for normal users
   * IT will be usefull for debugging though
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
	async index(req, res, next) {
		try {
			if(!req.params.paginate) {
				const events = await Event.all()
				return res.status(200).json(events)
			}
			const events = await Event.landingPage()
			res.json(events)
		} catch (err) {
			next(err)
		}
	}

	/**
     * Store a new event in the database
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
	async store(req, res, next) {
		const { body, file } = req
		const user = await req.user()
		try {
			await new Validator(body, {
				about: 'required',
				description: 'required',
				startDate: 'required',
				startTime: 'required'
			})
				.validate()

			let image
			if (file) {
				image = await upload(file, 'event-posters')
			} else {
				const { data } = await axios.get(`https://api.unsplash.com/search/photos?page=1&query=${body.about}&client_id=pOTyoPLsz5ef-yfgY549ovpcsN4Lv622n_MYA4H9Tj8&per_page=1&orientation=landscape`)
				image = data.results[0].urls.regular ? data.results[0].urls.regular : 'https://placeimg.com/640/500/null?30219'
			}

			// The data is valid
			// eslint-disable-next-line camelcase
			const { startDate, startTime, endDate, endTime, location, online_link, about, description } = body
			const startDateTime = formatToDateTime(startTime, startDate)
			const endDateTime = formatToDateTime(endTime, endDate) // TODO Add this field
			// eslint-disable-next-line camelcase
			const organisable_id = user.id // The authenticated user's ID
			// eslint-disable-next-line camelcase
			const organisable_type = 'User' // The organiser's Model can be group or user
			const e = await Event.create({
				image,
				location,
				online_link,
				about,
				description,
				startDate: startDateTime,
				endDate: endDateTime,
				organisable_id,
				organisable_type
			})
			// Add the organiser
			return res.status(201).json(e)
		} catch (error) {
			next(error)
		}
	}

	/**
   * Show an event
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
	async show(req, res, next) {
		try {
			let e = await Event.find(req.params.event)
			const u = await req.user()
			if (!e) { // The event was not found in the database
				return res.status(404).json({
					error: 'Event not found'
				})
			}
			if (!e.endDate) {
				await e.update({
					endDate: e.startDate
				})
				e = await Event.find(req.params.event)
			}
			// Get the event tickets
			e.tickets = await DB('tickets')
				.where('event_id', e.id) || []

      
			e.isFree = e.tickets[0] == null
			e.allDay = new Date(e.startDate).getHours() === new Date(e.endDate).getHours()
			e.inProgress = new Date(e.startDate).getTime() < new Date().getTime() && new Date(e.endDate).getTime() > new Date().getTime()
			e.past = new Date(e.startDate).getTime() < new Date().getTime()
			e.hasEndTime = e.startDate !== e.endDate
			// TODO this is a temp fix
			e.attendees = await DB('event_rsvps')
				.join('users', 'event_rsvps.user_id', '=', 'users.id')
				.where({
					'event_rsvps.event_id': e.id
				})
				.select('users.name AS name', 'users.bio AS bio')
			e.organiser = await getEventOrganiser(e)
			e.can_edit = canEditEvent(e, u)
			if (u) {
				e.currentUserTicket = await DB('event_rsvps')
					.join('tickets', 'event_rsvps.ticket_id', '=', 'tickets.id')
					.where({
						'event_rsvps.event_id': e.id,
						'event_rsvps.user_id': u.id
					})
					.first('event_rsvps.id', 'event_rsvps.rsvp_count', 'tickets.type', 'tickets.price') || null
			}
			delete e.organisable_id; delete e.organisable_type
			if (!e.location) {
				e.location = 'N/A'
			}
			if (!e.online_link) {
				e.online_link = 'N/A'
			}
			return res.json(e)
		} catch (error) {
			next(error)
		}
	}

	/**
   * Update an event
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
	async update(req, res, next) {
		const { body, params } = req
		const user = await req.user() // The current user
		const { event } = params // The the event Id
		const currentEvent = await Event.find(event) // Load the current event
		if (canEditEvent(currentEvent, user)) {
			try {
				await new Validator(body, { // Validate to input
					about: 'required',
					location: 'required',
					description: 'required',
					startDate: 'required',
					startTime: 'required'
				}).validate()
				// eslint-disable-next-line camelcase
				const { startDate, startTime, endDate, endTime, location, about, description } = body
				const startDateTime = formatToDateTime(startTime, startDate)
				const endDatetime = formatToDateTime(endTime, endDate)
				const ev = await currentEvent.update({ location, about, description, startDate: startDateTime, endDate: endDatetime }) // Payload is valid
				return res.status(201).json(ev)
			} catch (error) {
				return next(error)
			}
		}
		return res.status(401).json({
			error: 'You are not authorized to edit this event'
		})
	}

	/**
   * Delete the current model
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
	async delete(req, res, next) {
		const { params } = req
		const { event } = params
		// A user can only update his/her own event
		// TODO add this middleware
		// if (await currentEvent.user_id !== user.id) {
		//   return this.response('You dont\'t have permision to perfrom this action', 401)
		// }
		try {
			const currentEvent = await Event.find(event)
			await DB('tickets').where('event_id', currentEvent.id).delete()
			await currentEvent.delete()
			res.status(200).json({
				message: 'Event deleted'
			})
		} catch (error) {
			next(error)
		}
	}

	/**
   * Publish and unpublish an event
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
	async publish(req, res, next) {
		const { params } = req
		const { event } = params
		const currentEvent = await Event.find(event)
		if (canEditEvent(currentEvent, await req.user())) {
			try {
				await currentEvent.update({ published: !currentEvent.published })
				return res.status(201).json({
					message: 'Event published'
				})
			} catch (error) {
				return next(error)
			}
		}
		return res.status(401).json({
			error: 'You are not authorized to edit this event'
		})
	}

	/**
   * Get the events for the current user
   * @param {Express.Request} request
   */
	async currentUserEvents(request) {
		try {
			const user = await request.user()
			const events = await new User(user).events()
			return this.response(events)
		} catch (error) {
			console.log(error)
			return this.response(error, 500)
		}
	}

	/**
   * -----------------------------------------------------------------
   * User registers for an event
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
	async registerForEvent(req, res, next) {
		try {
			await new Validator(req.body, { // Validate the input
				ticket_id: 'required',
				rsvp_count: 'required'
			}).validate()
			const currentUser = await req.user() // The user making the request
			// Next we check if the current user has registerd for the current event
			const alreadyRegisterd = await DB('event_rsvps').where({ event_id: req.params.event, user_id: currentUser.id }).first()
			if (alreadyRegisterd) {
				return res.status(409).json({
					error: 'You have already registered for this event'
				})
			}
			const currentEvent = await Event.find(req.params.event)
			const currentTicket = await Ticket.find(req.body.ticket_id)
			if (!currentTicket) {
				return res.status(404).json({
					error: 'Ticket not found'
				})
			}
			if (!currentEvent) {
				return res.status(404).json({
					error: 'Event not found'
				})
			}
			const ticketId = await DB('event_rsvps').insert({
				event_id: req.params.event, user_id: currentUser.id, ticket_id: req.body.ticket_id, rsvp_count: req.body.rsvp_count
			})
			// Send and email to user
			// TODO add attachments and refactor
			const icsData = ical({
				name: currentEvent.about,
				events: [
					{
						start: currentEvent.startDate,
						end: currentEvent.endDate,
						summary: currentEvent.about,
						location: currentEvent.location,
						url: currentEvent.online_link
					}
				]
			})
			const icalString = icsData.toString()
			const data = {
				eventName: currentEvent.about,
				name: currentUser.name,
				ticketId,
				ticketCount: req.body.rsvp_count,
				currentTicket,
				date: new Date().toDateString(),
				ticketUrl: `${process.env.APP_URL}/tickets/${ticketId}`,
				icalString
			}
			res.status(201).json({
				message: 'You have successfully registerd for this event'
			})
			await new Mail(currentUser, 'Your order from Events254', { template: 'ticket', data }).send()
		} catch (error) {
			next(error)
		}
	}
}

export default new EventsController()
