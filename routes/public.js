import { Router } from 'express'
import EventsController from '../app/controllers/eventsController.js'
const router = Router()
/**
 * -------------------------------------------------------------------------------
 * The routes are publicly accessible by anyone without need for authentication.
 * This is because when using router.use(authenticated), we cannot exclude some
 * routes without Making Spaghetti
 * -------------------------------------------------------------------------------
 */

router.get('/events', async (req, res, next) => {
	const { message, status } = await EventsController.index(req)
	res.status(status).json(message)
})
/**
 * ----------------------------------------------------------------------------------------------------------
 * Fetch an event by the database ID.
 * If the event is not found, a 404 response will be returned
 * The event also comes with a can_edit field to show wheather the current user has the permission to edit
 * the event
 * ----------------------------------------------------------------------------------------------------------
 */
router.get('/events/:event', async (req, res, next) => {
	try {
		const { message, status } = await EventsController.show(req)
		res.status(status).json(message)
	} catch (error) {
		next(error)
	}
})

export default router
