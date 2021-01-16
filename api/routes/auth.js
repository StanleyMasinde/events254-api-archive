const express = require('express')
const passport = require('passport')
const usersController = require('../app/controllers/usersController')
const router = express.Router()

/**
 * Register a new user to the application
 */
router.post('/register', async (req, res) => {
  try {
    const { status, message } = await usersController.register(req.body)
    res.status(status).json(message)
  } catch (error) {
    res.json(error)
  }
})

/**
 * Login a user using the local strategy
 */
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user)
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
router.get('/user', (req, res) => {
  const { user } = req
  res.json({ user })
})

module.exports = router
