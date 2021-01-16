const router = require('express').Router()
const EventsController = require('../app/controllers/eventsController')

/**
 * All these routes require auth
 */
router.use((req, res, next) => {
  req.user === undefined ? res.status(401).json('Unauthenticated') : next()
})

/**
 * Get all events from the database
 */
router.get('/', (req, res) => {
  res.json('All events')
})

/**
 * Create a new event
 */
router.post('/', async (req, res) => {
  try {
    const { message, status } = await EventsController.store(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * Update a specified event
 */
router.put('/:event', async (req, res) => {
  try {
    const { message, status } = await EventsController.update(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * Fetch a specified event
 */
router.get('/:event', async (req, res) => {
  try {
    const { message, status } = await EventsController.show(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * Delete a specified event
 */
router.delete('/:event', async (req, res) => {
  try {
    const { message, status } = await EventsController.delete(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * Get events for the current authenticated user
 */
router.get('/currentUser', async (req, res) => {
  try {
    const { message, status } = await EventsController.currentUserEvents(req.user)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
