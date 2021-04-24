const express = require('express')
const ticketController = require('../app/controllers/ticketController')
const usersController = require('../app/controllers/usersController')
const authenticated = require('../app/middleware/authenticated')
const router = express.Router()

/**
 * Register a new user to the application
 */
router.post('/register', async (req, res) => {
  try {
    const { status, message } = await usersController.register(req)
    res.status(status).json(message)
  } catch (error) {
    res.json(error)
  }
})

/**
 * Login a user using the local strategy
 */
router.post('/login', (req, res) => {
  req.attempt()
})

/**
 * End a user's session
 */
router.post('/logout', function (req, res) {
  req.logOut()
  res.json({ message: 'Logout' })
})

/**
 * Reset a user's password
 * This route is used to request a new password
 * The user receives an email
 */
router.post('/password', async (req, res) => {
  try {
    const { message, status } = await usersController.sendPasswordResetEmail(req.body.email)
    res.status(status)
      .json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * This route is used to update a user's password
 */
router.post('/password/update', async (req, res) => {
  try {
    const { message, status } = await usersController.resetPassword(req.body)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * Get the current authenticated user
 */
router.get('/user', authenticated(), async (req, res) => {
  const user = await req.user()
  if (user) {
    delete user.password
  }
  res.json({ user })
})

/**
 * -----------------------------------------------------------------
 * This route is used to get the tickets purchased by the current user
 * The user can be fecthed via session or access token
 * -----------------------------------------------------------------
 */
router.get('/tickets', authenticated(), async (req, res) => {
  try {
    const { message, status } = await ticketController.currentUser(req)
    res.status(status).json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
