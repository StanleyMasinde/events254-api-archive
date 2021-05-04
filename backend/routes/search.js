const router = require('express').Router()
const searchController = require('../app/controllers/searchController')

/**
 * Handle the search
 *
 */
router.get('/', (req, res) => {
  searchController.index(req, res)
})

module.exports = router
