import { Router } from 'express'
import SearchController from '../app/controllers/searchController.js'
const router = Router()

/**
 * Handle the search
 *
 */
router.get('/', (req, res, next) => {
	SearchController.index(req, res, next)
})

/**
 * Filter events by a calendar date
 */
router.get('/calendar', (req, res, next) => {
	SearchController.calendar(req, res, next)
})

export default router
