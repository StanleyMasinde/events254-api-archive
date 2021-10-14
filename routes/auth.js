import { Router } from 'express'
import TicketController from '../app/controllers/ticketController.js'
import UsersController from '../app/controllers/usersController.js'
import authenticated from '../app/middleware/authenticated.js'
const router = Router()

/**
 * Register a new user to the application
 */
router.post('/register', (req, res, next) => {
	UsersController.register(req, res, next)
})

/**
 * Login a user using the local strategy
 */
router.post('/login', (req) => {
	req.attempt()
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
router.post('/password', async (req, res, next) => {
	try {
		const { message, status } = await UsersController.sendPasswordResetEmail(req.body.email)
		res.status(status)
			.json(message)
	} catch (error) {
		next(error)
	}
})

/**
 * This route is used to update a user's password
 */
router.post('/password/update', async (req, res, next) => {
	try {
		const { message, status } = await UsersController.resetPassword(req.body)
		res.status(status).json(message)
	} catch (error) {
		next(error)
	}
})

/**
 * Get the current authenticated user
 */
router.get('/user', authenticated(), async (req, res) => {
	const user = await req.user()
	if (user) {
		delete user.password
	}
	res.json({ user })
})

/**
 * -----------------------------------------------------------------
 * This route is used to get the tickets purchased by the current user
 * The user can be fecthed via session or access token
 * -----------------------------------------------------------------
 */
router.get('/tickets', authenticated(), async (req, res, next) => {
	try {
		const { message, status } = await TicketController.currentUser(req)
		res.status(status).json(message)
	} catch (error) {
		next(error)
	}
})

export default router
