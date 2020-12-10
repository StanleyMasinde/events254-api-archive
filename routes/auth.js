const router = require('express').Router()

/**
 * Register a new user
 */
router.post('/register', function (req, res) {
  res.json({
    message: 'Events254'
  })
})

/**
 * Login a user
 */
router.post('/login', (req, res) => {
  res.json('Hello')
})

/**
 * Get the authenticated user
 */
router.get('/user', (req, res) => {
  res.json('jshsh')
})

/**
 * End a user's session
 */
router.post('/logout', (req, res) => {
  res.json('Haha')
})

module.exports = router
