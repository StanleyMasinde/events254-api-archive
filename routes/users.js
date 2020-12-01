const router = require('express').Router()
const User = require('../app/models/user')

router.get('/', async (req, res) => {
	try {
		const users = await User.all()
		res.json(users)
	} catch (error) {
		res.status(500).json(error)
	}
})

module.exports = router