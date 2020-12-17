const express = require('express')
const passport = require('passport')
const usersController = require('../app/controllers/usersController')
const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { status, message } = await usersController.register(req.body)
    res.status(status).json(message)
  } catch (error) {
    res.json(error)
  }
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user)
})

router.post('/logout', function (req, res) {
  req.logOut()
  res.json({ message: 'Logout' })
})

router.post('/password', async (req, res) => {
  try {
    const { message, status } = await usersController.sendPasswordResetEmail(req.body.email)
    res.status(status)
      .json(message)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/user', (req, res) => {
  res.json(req.user)
})

module.exports = router
