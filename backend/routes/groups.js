const fs = require('fs')
const router = require('express').Router()
const multer = require('multer')
const GroupController = require('../app/controllers/groupController')

/**
 * -----------------------------------------------------------------
 * Get all groups as JSON.
 * The results will be paginated to reduce load when the app grows
 * -----------------------------------------------------------------
 */
router.get('/', async (req, res) => {
  try {
    const { status, message } = await GroupController.index()
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * ------------------------------------------------------------
 * Create a group.
 * This route requires an authenticated request
 * The request is validated before any creation event
 * ------------------------------------------------------------
 */
router.post('/', multer({ dest: './uploads' }).single('picture'), async (req, res) => {
  try {
    const { status, message } = await GroupController.create(req)
    fs.unlinkSync(req.file.path) // TODO: Make this a resusable function Delete the temp file.
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * ----------------------------------------------------------------
 * Get the groups managed by the current user
 * This will be shown in the user's home page
 * -----------------------------------------------------------------
 */
router.get('/currentUser', async (req, res) => {
  try {
    const { status, message } = await GroupController.currentUser(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * -----------------------------------------------------------------------
 * Get a specific group using it's slug
 * e.g /api/groups/opensource254.
 * On the client side it would be something like domain.com/opensource254
 * ------------------------------------------------------------------------
 */
router.get('/:slug', async (req, res) => {
  try {
    const { status, message } = await GroupController.show(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * ------------------------------------------------------------------
 * Update information about a group.
 * This can include the name, and description
 * Other fields will be changed elsewhere.
 * This route requires both authentication and authorization
 * ------------------------------------------------------------------
 */
router.put('/:slug', multer({ dest: './uploads' }).single('picture'), async (req, res) => {
  try {
    const { status, message } = await GroupController.update(req)
    res.status(status).json(message)
    fs.unlinkSync(req.file.path) // TODO: Make this a resusable function Delete the temp file.
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * --------------------------------------------------------------------
 * Delete a given group from the database.
 * The group will still remai in the database but cannot be visible
 * This route requires both authentication and authorization
 * ---------------------------------------------------------------------
 */
router.delete('/:slug', async (req, res) => {
  try {
    const { status, message } = await GroupController.delete(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * ------------------------------------------------------------------
 * Get the group members
 * ------------------------------------------------------------------
 */
router.get('/:slug/members', async (req, res) => {
  try {
    const { status, message } = await GroupController.members(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * --------------------------------------------------------------------
 * Get all the events in the group
 * current group
 * --------------------------------------------------------------------
 */
router.get('/:slug/events', async (req, res) => {
  try {
    const { status, message } = await GroupController.groupEvents(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * --------------------------------------------------------------------
 * Create a group's event. An event that will be owned and managed by
 * the current group
 * --------------------------------------------------------------------
 */
router.post('/:slug/events', multer({ dest: './uploads' }).single('image'), async (req, res) => {
  try {
    const { status, message } = await GroupController.createEvent(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * --------------------------------------------------------------------
 * Update a given event
 * --------------------------------------------------------------------
 */
router.put('/:slug/events/:event', async (req, res) => {
  try {
    const { status, message } = await GroupController.updateEvent(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * --------------------------------------------------------------------
 * Delete an event
 * --------------------------------------------------------------------
 */
router.delete('/:slug/events/:event', async (req, res) => {
  try {
    const { status, message } = await GroupController.deleteEvent(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
