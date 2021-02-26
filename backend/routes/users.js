const router = require('express').Router()
const UserController = require('../app/controllers/usersController')

/**
 * Get all users
 */
router.get('/', async (req, res, next) => {
  try {
    const { status, message } = await UserController.index()
    res.status(status).json(message)
  } catch (error) {
    next(error)
  }
})

module.exports = router
