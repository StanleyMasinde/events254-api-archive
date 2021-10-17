import { Router } from 'express'
import multer from 'multer'
import EventsController from '../app/controllers/eventsController.js'
import TicketController from '../app/controllers/ticketController.js'
import authenticated from '../app/middleware/authenticated.js'
import { cache } from '../app/middleware/cache.js'
const router = Router()

/**
 * --------------------------------------------------------
 * All this routes require an authenticated user
 * --------------------------------------------------------
 */
// router.use(authenticated())

/**
 * --------------------------------------------------------
 * This route is used to get all events from the database
 * --------------------------------------------------------
 */
router.get('/', cache(60), async (req, res, next) => {
	EventsController.index(req, res, next)
})
/**
 * -----------------------------------------------------------------------------
 * Create a new event in the system
 * The Event needs a poster, title, description, venue, meeting link if any
 * The file is deleted after the requiest to prevent accumlation of junk files
 * -----------------------------------------------------------------------------
 */
router.post('/', authenticated(), multer({ dest: './uploads' }).single('image'), (req, res, next) => {
	EventsController.store(req, res, next)
})

/**
 * -----------------------------------------------------------------
 * This route is used to get the events owned by the current user
 * The user can be fecthed via session or access token
 * -----------------------------------------------------------------
 */
router.get('/currentUser', authenticated(), async (req, res, next) => {
	try {
		const { message, status } = await EventsController.currentUserEvents(req)
		res.status(status).json(message)
	} catch (error) {
		next(error)
	}
})

/**
 * ---------------------------------------------------------------------
 * This route is used to update information about a particular event
 * The same rules a the event creation route above
 * ---------------------------------------------------------------------
 */
router.put('/:event', authenticated(), multer({ dest: './uploads' }).single('image'), (req, res, next) => {
	EventsController.update(req, res, next)
})

/**
 * ----------------------------------------------------------------------------------------------------------
 * Fetch an event by the database ID.
 * If the event is not found, a 404 response will be returned
 * The event also comes with a can_edit field to show wheather the current user has the permission to edit
 * the event
 * ----------------------------------------------------------------------------------------------------------
 */
router.get('/:event', async (req, res, next) => {
	EventsController.show(req, res, next)
})
/**
 * -------------------------------------------------------------------------
 * Delete a given event from the database. A response code 200 is returned
 * on success
 * -------------------------------------------------------------------------
 */
router.delete('/:event', authenticated(), async (req, res, next) => {
	EventsController.delete(req, res, next)
})

/**
 * -------------------------------------------------------------------------
 * Publish and unpublish an event. A response code 200 is returned on success
 * -------------------------------------------------------------------------
 */
router.put('/:event/publish', authenticated(), async (req, res, next) => {
	try {
		const { message, status } = await EventsController.publish(req)
		res.status(status).json(message)
	} catch (error) {
		next(error)
	}
})

/**
 * ----------------------------------------------------------------------
 * This route returns the tickets associated with a given event
 * ----------------------------------------------------------------------
 */
router.get('/:event/tickets', async (req, res, next) => {
	TicketController.allEventTickets(req, res, next)
})

/**
 * -----------------------------------------------------------------------------
 * Add a ticket to an event. An event can have multiple tickets e.g VIP, Regular
 * -----------------------------------------------------------------------------
 */
router.post('/:event/tickets', authenticated(), async (req, res, next) => {
	TicketController.createEventTicket(req, res, next)
})

/**
 * ----------------------------------------------------------------------------
 * Get a ticket associated with a given event by it's database ID
 * ----------------------------------------------------------------------------
 */
router.get('/:event/tickets/:ticket', async (req, res, next) => {
	await TicketController.showEventTicket(req, res, next)
})

/**
 * -------------------------------------------------------------------
 * Modifiy a ticket assiciated with an event
 * --------------------------------------------------------------------
 */
router.put('/:events/tickets/:ticket', authenticated(), async (req, res, next) => {
	TicketController.upDateEventTicket(req, res, next)
})

/**
 * -------------------------------------------------------------------
 * Delete a ticket assiciated with an event
 * --------------------------------------------------------------------
 */
router.delete('/:event/tickets/:ticket', (req, res, next) => {
	TicketController.deleteEventTicket(req, res, next)
})

/**
 * -------------------------------------------------------------------
 * Register for an event
 * ------------------------------------------------------------------
 */
router.post('/:event/register', authenticated(), async (req, res, next) => {
	EventsController.registerForEvent(req, res, next)
})

export default router
