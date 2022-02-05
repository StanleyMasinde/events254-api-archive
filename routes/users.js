import { Router } from 'express'
import UsersController from '../app/controllers/usersController.js'
const router = Router()

/**
 * Get all users. This is probaly not practical
 *
 */
router.get('/', (req, res, next) => {
	UsersController.index(req, res, next)
})

router.get('/:id', async (req, res, next) => {
	try {
		const { status, message } = await UsersController.show(req)
		res.status(status).json(message)
	} catch (error) {
		next(error)
	}
})

router.post('/update', UsersController.updateProfile)

export default router
