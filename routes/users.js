const router = require('express').Router()
const UserController = require('../app/controllers/usersController')

router.get('/', async (req, res) => {
	try {
		const { status, message } = await UserController.index()
		res.status(status).json(message)
	} catch (error) {
		res.status(500).json(error)
	}
})

module.exports = router