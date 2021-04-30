const router = require('express').Router()
const UserController = require('../app/controllers/usersController')

/**
 * Get all users. This is probaly not practical
 *
 */
router.get('/', async (req, res, next) => {
  try {
    const { status, message } = await UserController.index()
    res.status(status).json(message)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { status, message } = await UserController.show(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
