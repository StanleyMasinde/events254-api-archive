import { Router } from 'express'
import TicketController from '../app/controllers/ticketController.js'
const router = Router()

/**
 * Get a ticket using ID
 *
 */
router.get('/:id', (req, res, next) => {
	TicketController.getTicket(req, res, next)
})

export default router
