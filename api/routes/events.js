const router = require('express').Router()
const EventsController = require('../app/controllers/eventsController')

router.use((req, res, next) => {
  req.user === undefined ? res.status(401).json('Unauthenticated') : next()
})

router.get('/', (req, res) => {
  res.json('All events')
})

router.post('/', async (req, res) => {
  try {
    const { message, status } = await EventsController.store(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.put('/:event', async (req, res) => {
  try {
    const { message, status } = await EventsController.update(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/:event', async (req, res) => {
  try {
    const { message, status } = await EventsController.show(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.delete('/:event', async (req, res) => {
  try {
    const { message, status } = await EventsController.delete(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/currentUser', async (req, res) => {
  try {
    const { message, status } = await EventsController.currentUserEvents(req.user)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
