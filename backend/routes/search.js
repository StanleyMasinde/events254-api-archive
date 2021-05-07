const router = require('express').Router()
const searchController = require('../app/controllers/searchController')

/**
 * Handle the search
 *
 */
router.get('/', (req, res) => {
  searchController.index(req, res)
})

/**
 * Filter events by a calendar date
 */
router.get('/calendar', (req, res) => {
  searchController.calendar(req, res)
})

module.exports = router
