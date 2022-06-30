import { Router } from 'express'
import multer from 'multer'
import EventsController from '../app/controllers/eventsController.js'
import TicketController from '../app/controllers/ticketController.js'
import authenticated from '../app/middleware/authenticated.js'
import { cache, clearCache } from '../app/middleware/cache.js'
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
router.get('/', cache(60), EventsController.index)
	/**
	 * -----------------------------------------------------------------------------
	 * Create a new event in the system
	 * The Event needs a poster, title, description, venue, meeting link if any
	 * The file is deleted after the requiest to prevent accumlation of junk files
	 * -----------------------------------------------------------------------------
	 */
	.post('/', authenticated(), multer({ dest: './uploads' }).single('image'), clearCache(), EventsController.store)

	/**
	 * -----------------------------------------------------------------
	 * This route is used to get the events owned by the current user
	 * The user can be fecthed via session or access token
	 * -----------------------------------------------------------------
	 */
	.get('/currentUser', authenticated(), EventsController.currentUserEvents)

	/**
	 * ---------------------------------------------------------------------
	 * This route is used to update information about a particular event
	 * The same rules a the event creation route above
	 * ---------------------------------------------------------------------
	 */
	.put('/:event', authenticated(), multer({ dest: './uploads' }).single('image'), clearCache(), EventsController.update)

	/**
	 * ----------------------------------------------------------------------------------------------------------
	 * Fetch an event by the database ID.
	 * If the event is not found, a 404 response will be returned
	 * The event also comes with a can_edit field to show wheather the current user has the permission to edit
	 * the event
	 * ----------------------------------------------------------------------------------------------------------
	 */
	.get('/:event', EventsController.show)
	/**
	 * -------------------------------------------------------------------------
	 * Delete a given event from the database. A response code 200 is returned
	 * on success
	 * -------------------------------------------------------------------------
	 */
	.delete('/:event', authenticated(), EventsController.delete)

	/**
	 * -------------------------------------------------------------------------
	 * Publish and unpublish an event. A response code 200 is returned on success
	 * -------------------------------------------------------------------------
	 */
	.put('/:event/publish', authenticated(), EventsController.publish)

	/**
	 * ----------------------------------------------------------------------
	 * This route returns the tickets associated with a given event
	 * ----------------------------------------------------------------------
	 */
	.get('/:event/tickets', TicketController.allEventTickets)


	/**
	 * -----------------------------------------------------------------------------
	 * Add a ticket to an event. An event can have multiple tickets e.g VIP, Regular
	 * -----------------------------------------------------------------------------
	 */
	.post('/:event/tickets', authenticated(), TicketController.createEventTicket)

	/**
	 * ----------------------------------------------------------------------------
	 * Get a ticket associated with a given event by it's database ID
	 * ----------------------------------------------------------------------------
	 */
	.get('/:event/tickets/:ticket', TicketController.showEventTicket)

	/**
	 * -------------------------------------------------------------------
	 * Modifiy a ticket assiciated with an event
	 * --------------------------------------------------------------------
	 */
	.put('/:events/tickets/:ticket', authenticated(), TicketController.upDateEventTicket)

	/**
	 * -------------------------------------------------------------------
	 * Delete a ticket assiciated with an event
	 * --------------------------------------------------------------------
	 */
	.delete('/:event/tickets/:ticket', authenticated(), TicketController.deleteEventTicket)

	/**
	 * -------------------------------------------------------------------
	 * Register for an event
	 * ------------------------------------------------------------------
	 */
	.post('/:event/register', authenticated(), EventsController.registerForEvent)

export default router
