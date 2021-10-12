const router = require('express').Router()
const UserController = require('../app/controllers/usersController')

/**
 * Get all users. This is probaly not practical
 *
 */
router.get('/', (req, res, next) => {
  UserController.index(req, res, next)
})

router.get('/:id', async (req, res, next) => {
  try {
    const { status, message } = await UserController.show(req)
    res.status(status).json(message)
  } catch (error) {
    next(error)
  }
})

module.exports = router
