const router = require('express').Router()
const GroupController = require('../app/controllers/groupController')

router.get('/', async (req, res) => {
	try {
		const { status, message } = await GroupController.index()
		res.status(status).json(message)
	} catch (error) {
		res.status(500).json(error)
	}
})

module.exports = router