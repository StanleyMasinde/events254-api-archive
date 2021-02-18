const fs = require('fs')
const router = require('express').Router()
const multer = require('multer')
const EventsController = require('../app/controllers/eventsController')
const authenticated = require('../app/middleware/authenticated')

/**
 * All these routes require auth
 */
router.use(authenticated())

/**
 * Get all events from the database
 */
router.get('/', (req, res) => {
  res.json('All events')
})

/**
 * Create a new event
 */
router.post('/', multer({ dest: './uploads' }).single('poster'), async (req, res) => {
  try {
    const { message, status } = await EventsController.store(req)
    fs.unlinkSync(req.file.path) // TODO: Make this a resusable function Delete the temp file.
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
    const { message, status } = await EventsController.currentUserEvents(req)
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

module.exports = router
