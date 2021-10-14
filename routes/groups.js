import { unlinkSync } from 'fs'
import { Router } from 'express'
import multer from 'multer'
import GroupController from '../app/controllers/groupController.js'
import authenticated from '../app/middleware/authenticated.js'
const router = Router()

/**
 * -----------------------------------------------------------------
 * Get all groups as JSON.
 * The results will be paginated to reduce load when the app grows
 * -----------------------------------------------------------------
 */
router.get('/', async (req, res, next) => {
  GroupController.index(req, res, next)
})

/**
 * ------------------------------------------------------------
 * Create a group.
 * This route requires an authenticated request
 * The request is validated before any creation event
 * ------------------------------------------------------------
 */
router.post('/', multer({ dest: './uploads' }).single('picture'), (req, res, next) => {
  GroupController.create(req, res, next)
})

/**
 * ----------------------------------------------------------------
 * Get the groups managed by the current user
 * This will be shown in the user's home page
 * -----------------------------------------------------------------
 */
router.get('/currentUser', async (req, res, next) => {
  try {
    const { status, message } = await GroupController.currentUser(req)
    res.status(status).json(message)
  } catch (error) {
    next(error)
  }
})

/**
 * -----------------------------------------------------------------------
 * Get a specific group using it's slug
 * e.g /api/groups/opensource254.
 * On the client side it would be something like domain.com/opensource254
 * ------------------------------------------------------------------------
 */
router.get('/:slug', (req, res, next) => {
  GroupController.show(req, res, next)
})

/**
 * ------------------------------------------------------------------
 * Update information about a group.
 * This can include the name, and description
 * Other fields will be changed elsewhere.
 * This route requires both authentication and authorization
 * ------------------------------------------------------------------
 */
router.put('/:slug', multer({ dest: './uploads' }).single('picture'), async (req, res, next) => {
  GroupController.update(req, res, next)
})

/**
 * --------------------------------------------------------------------
 * Delete a given group from the database.
 * The group will still remai in the database but cannot be visible
 * This route requires both authentication and authorization
 * ---------------------------------------------------------------------
 */
router.delete('/:slug', async (req, res, next) => {
  try {
    const { status, message } = await GroupController.delete(req)
    res.status(status).json(message)
  } catch (error) {
    next(error)
  }
})

/**
 * --------------------------
 * User joins a group
 *-----------------------------
 */
router.post('/:slug/join', authenticated(), (req, res, next) => {
  GroupController.join(req, res, next)
})

/**
 * ------------------------------------------------------------------
 * Get the group members
 * ------------------------------------------------------------------
 */
router.get('/:slug/members', async (req, res, next) => {
  try {
    const { status, message } = await GroupController.members(req)
    res.status(status).json(message)
  } catch (error) {
    next(error)
  }
})

/**
 * --------------------------------------------------------------------
 * Get all the events in the group
 * current group
 * --------------------------------------------------------------------
 */
router.get('/:slug/events', async (req, res, next) => {
  GroupController.groupEvents(req, res, next)
})

/**
 * -----------------------------------------------------------------------
 * Get a group's specific events using it's slug and event id
 * e.g /api/groups/opensource254/events/1
 * On the client side it would be something like domain.com/opensource254/events/1
 */
router.get('/:slug/:event', (req, res, next) => {
  GroupController.showEvent(req, res, next)
})

/**
 * --------------------------------------------------------------------
 * Create a group's event. An event that will be owned and managed by
 * the current group
 * --------------------------------------------------------------------
 */
router.post('/:slug/events', multer({ dest: './uploads' }).single('image'), (req, res, next) => {
  GroupController.createEvent(req, res, next)
})

/**
 * --------------------------------------------------------------------
 * Update a given event
 * --------------------------------------------------------------------
 */
router.put('/:slug/events/:event', async (req, res, next) => {
  try {
    const { status, message } = await GroupController.updateEvent(req)
    res.status(status).json(message)
  } catch (error) {
    next(error)
  }
})

/**
 * --------------------------------------------------------------------
 * Delete an event
 * --------------------------------------------------------------------
 */
router.delete('/:slug/events/:event', async (req, res, next) => {
  try {
    const { status, message } = await GroupController.delete(req)
    res.status(status).json(message)
  } catch (error) {
    next(error)
  }
})

export default router
