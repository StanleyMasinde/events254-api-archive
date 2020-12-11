const express = require('express')
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

router.post('/login', function (req, res) {
  res.json({
    message: 'Events254'
  })
})

router.post('/logout', function (req, res) {
  res.json({
    message: 'Events254'
  })
})

module.exports = router
