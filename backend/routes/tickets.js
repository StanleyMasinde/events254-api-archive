const router = require('express').Router()
const ticketController = require('../app/controllers/ticketController')

/**
 * Get a ticket using ID
 *
 */
router.get('/:id', (req, res) => {
  ticketController.getTicket(req, res)
})

module.exports = router
