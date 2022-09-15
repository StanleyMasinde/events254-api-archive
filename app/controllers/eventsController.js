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
import moment from 'moment-timezone'

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
			const events = await DB('events').orderBy('created_at', 'desc').limit(20).select()
			return res.status(200).json(events)
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
				startTime: 'required',
				category_id: 'required',
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
			const { startDate, startTime, frequency, repeat_count, endDate, endTime, location, location_name, formatted_address, location_coordinates, online_link, about, description, category_id } = body
			const startDateTime = formatToDateTime(startTime, startDate)
			const endDateTime = formatToDateTime(endTime, endDate) // TODO Add this field
			// eslint-disable-next-line camelcase
			const organisable_id = user.id // The authenticated user's ID
			// eslint-disable-next-line camelcase
			const organisable_type = 'User' // The organiser's Model can be group or user
			let location_id
			if (location) {
				await new Validator(body, {
					location_name: 'required',
					formatted_address: 'required',
					location_coordinates: 'required'
				}).validate()
				const [lat, lng] = location_coordinates.split(',')
				// Check if exists
				const exists = await DB('locations').where({ name: location_name }).first()
				if (exists) {
					location_id = exists.id
				} else {
					location_id = await DB('locations')
						.insert({
							name: location_name,
							formatted_address,
							coordinates: DB.raw(`POINT(${lat}, ${lng})`)
						})
				}
			}
			const e = await Event.create({
				image,
				location_id,
				online_link,
				about,
				description,
				startDate: startDateTime,
				endDate: endDateTime,
				frequency,
				repeat_count,
				organisable_id,
				organisable_type,
				category_id
			})
			return res.status(201).json(e)
		} catch (error) {
			if (error.errors) {
				return res.status(422).json({ errors: error.errors })
			}
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
				return res.status(201).json(currentEvent)
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
   * @param {import('express').Request} req Express request object
   * @param {import('express').Response} res Express response object
   * @param {import('express').NextFunction} next Express next function
   * @returns {Promise<object>} The events for the current user
   */
	async currentUserEvents(req, res, next) {
		try {
			const user = await req.user()
			const events = await new User(user).events()
			return res.json(events)
		} catch (error) {
			next(error)
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
			currentEvent.humanStartDate = moment(currentEvent.startDate).tz('Africa/Nairobi').format('LLLL')
			currentEvent.organiser = await getEventOrganiser(currentEvent)
			// Send and email to user
			// TODO add attachments and refactor
			// Remove html tags from the event description
			const eventDescription = currentEvent.description.replace(/<(?:.|\n)*?>/gm, '')
			const icsData = ical({
				name: currentEvent.about,
				description: eventDescription,
				timezone: 'UTC',
				events: [
					{
						start: currentEvent.startDate,
						end: currentEvent.endDate,
						summary: currentEvent.about,
						location: currentEvent.location,
						description: eventDescription,
						url: currentEvent.online_link || `${req.app.locals.config.webClientUrl}/events/${currentEvent.id}`,
						allDay: moment(currentEvent.startDate).format('HH:mm') === '00:00' && moment(currentEvent.endDate).diff(currentEvent.startDate, 'days') === 1,
						attendees: [
							{
								name: currentUser.name || currentUser.name,
								email: currentUser.email || currentUser.email
							}
						],
						organizer: {
							name: currentEvent.organiser.name ? currentEvent.organiser.name : 'Events254',
							email: currentEvent.organiser.email ? currentEvent.organiser.email : 'info@events254.co.ke'
						},
						alarms: [
							{
								trigger: -30,
								description: `${currentEvent.about} is starting soon`,
								type: 'display'
							},
							{
								trigger: -60,
								description: `${currentEvent.about} is starting soon`,
								type: 'display'
							}
						]
					}
				]
			})

			let attachments = []
			const icalString = icsData.toString()
			attachments.push({
				filename: 'event.ics',
				content: new Buffer.from(icalString),
				contentType: 'text/calendar'
			})
			const data = {
				eventName: currentEvent.about,
				eventDescription,
				currentEvent,
				name: currentUser.name,
				ticketId,
				ticketCount: req.body.rsvp_count,
				currentTicket,
				date: new Date().toDateString(),
				ticketUrl: `${process.env.APP_URL}/tickets/${ticketId}`,
			}
			await new Mail(currentUser, 'Your order from Events254', { template: 'ticket', data, attachments }).send()
			res.status(201).json({
				message: 'You have successfully registerd for this event',
				ticketId,
			})
		} catch (error) {
			next(error)
		}
	}
}

export default new EventsController()
