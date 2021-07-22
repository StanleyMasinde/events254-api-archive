const router = require('express').Router()
const ticketController = require('../app/controllers/ticketController')

/**
 * Get a ticket using ID
 *
 */
router.get('/:id', (req, res, next) => {
  ticketController.getTicket(req, res, next)
})

module.exports = router
