const express = require('express')
const router = express.Router()
const User = require('../app/models/user')

router.post('/register', async (req, res) => {
	// TODO add validation
	try {
		const usr = await User.register(req.body)
		// TODO make the base model to return user object instead of ID
		const user = await User.find(usr[0])
		res.json(user)
	} catch (error) {
		console.log(error)
		res.status(500).json(error)
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
