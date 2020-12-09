const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.json({
    message: 'Events254'
  })
})

module.exports = router
