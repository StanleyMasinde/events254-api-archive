const router = require('express').Router()
const searchController = require('../app/controllers/searchController')

/**
 * Handle the search
 *
 */
router.get('/', (req, res, next) => {
  searchController.index(req, res, next)
})

/**
 * Filter events by a calendar date
 */
router.get('/calendar', (req, res, next) => {
  searchController.calendar(req, res, next)
})

module.exports = router
