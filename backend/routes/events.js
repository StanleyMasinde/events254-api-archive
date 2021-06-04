const fs = require('fs')
const router = require('express').Router()
const multer = require('multer')
const EventsController = require('../app/controllers/eventsController')
const ticketController = require('../app/controllers/ticketController')
const authenticated = require('../app/middleware/authenticated')

/**
 * --------------------------------------------------------
 * All this routes require an authenticated user
 * --------------------------------------------------------
 */
// router.use(authenticated())

/**
 * --------------------------------------------------------
 * This route is used to get all events from the database
 * --------------------------------------------------------
 */
router.get('/', async (req, res) => {
  const { message, status } = await EventsController.index(req)
  res.status(status).json(message)
})

/**
 * -----------------------------------------------------------------------------
 * Create a new event in the system
 * The Event needs a poster, title, description, venue, meeting link if any
 * The file is deleted after the requiest to prevent accumlation of junk files
 * -----------------------------------------------------------------------------
 */
router.post('/', authenticated(), multer({ dest: './uploads' }).single('image'), async (req, res) => {
  try {
    const { message, status } = await EventsController.store(req)

    if (req.file) {
      fs.unlinkSync(req.file.path) // TODO: Make this a resusable function Delete the temp file.
    }

    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * -----------------------------------------------------------------
 * This route is used to get the events owned by the current user
 * The user can be fecthed via session or access token
 * -----------------------------------------------------------------
 */
router.get('/currentUser', authenticated(), async (req, res) => {
  try {
    const { message, status } = await EventsController.currentUserEvents(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * ---------------------------------------------------------------------
 * This route is used to update information about a particular event
 * The same rules a the event creation route above
 * ---------------------------------------------------------------------
 */
router.put('/:event', authenticated(), multer({ dest: './uploads' }).single('image'), async (req, res) => {
  try {
    const { message, status } = await EventsController.update(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * ----------------------------------------------------------------------------------------------------------
 * Fetch an event by the database ID.
 * If the event is not found, a 404 response will be returned
 * The event also comes with a can_edit field to show wheather the current user has the permission to edit
 * the event
 * ----------------------------------------------------------------------------------------------------------
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
 * -------------------------------------------------------------------------
 * Delete a given event from the database. A response code 200 is returned
 * on success
 * -------------------------------------------------------------------------
 */
router.delete('/:event', authenticated(), async (req, res) => {
  try {
    const { message, status } = await EventsController.delete(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * ----------------------------------------------------------------------
 * This route returns the tickets associated with a given event
 * ----------------------------------------------------------------------
 */
router.get('/:event/tickets', async (req, res) => {
  const { status, message } = await ticketController.allEventTickets(req)
  res.status(status).json(message)
})

/**
 * -----------------------------------------------------------------------------
 * Add a ticket to an event. An event can have multiple tickets e.g VIP, Regular
 * -----------------------------------------------------------------------------
 */
router.post('/:event/tickets', authenticated(), async (req, res) => {
  const { message, status } = await ticketController.createEventTicket(req)
  res.status(status).json(message)
})

/**
 * ----------------------------------------------------------------------------
 * Get a ticket associated with a given event by it's database ID
 * ----------------------------------------------------------------------------
 */
router.get('/:event/tickets/:ticket', async (req, res) => {
  const { message, status } = await ticketController.showEventTicket(req)
  res.status(status).json(message)
})

/**
 * -------------------------------------------------------------------
 * Modifiy a ticket assiciated with an event
 * --------------------------------------------------------------------
 */
router.put('/:events/tickets/:ticket', authenticated(), async (req, res) => {
  const { message, status } = await ticketController.upDateEventTicket(req)
  res.status(status).json(message)
})

/**
 * -------------------------------------------------------------------
 * Delete a ticket assiciated with an event
 * --------------------------------------------------------------------
 */
router.delete('/:event/tickets/:ticket', async (req, res) => {
  const { status, message } = await ticketController.deleteEventTicket(req)
  res.status(status).json(message)
})

/**
 * -------------------------------------------------------------------
 * Register for an event
 * ------------------------------------------------------------------
 */
router.post('/:event/register', authenticated(), async (req, res) => {
  const { message, status } = await EventsController.registerForEvent(req)
  res.status(status).json(message)
})

module.exports = router
