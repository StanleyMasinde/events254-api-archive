import { randomBytes, randomUUID } from 'crypto'
import Validator from 'mevn-validator'
import { DB } from 'mevn-orm'
import { hash } from 'bcrypt'
import Mail from '../mail/mail.js'
import User from '../models/user.js'
import createToken from '../auth/createToken.js'
import Controller from './controller.js'

class UserController extends Controller {
	/**
  * Get all users
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  * @returns {import('../models/user')} Users
  */
	async index(req, res, next) {
		const currentPage = +req.query.page || 1
		const limit = req.query.limit || 500
		const offset = (currentPage - 1) * limit
		try {
			const userCount = await DB('users').count('id as count')
			const users = await DB('users').select('*').limit(limit).offset(offset)
			const totalPages = Math.ceil(userCount[0].count / limit)
			const remainingPages = totalPages - currentPage
			users.map(user => {
				delete user.password
			})
			return res.json({
				nextPageUrl: remainingPages > 0 ? `${process.env.APP_URL}/users?page=${currentPage + 1}&limit=${limit}` : null,
				previousPageUrl: currentPage > 1 ? `${process.env.APP_URL}/users?page=${currentPage - 1}&limit=${limit}` : null,
				totalPages,
				currentPage,
				limit,
				totalCount: userCount[0].count,
				data: users
			})
		} catch (error) {
			next(error)
		}
	}

	/**
   *
   * @param {Express.Request} request
   * @returns
   */
	async show({ params }) {
		try {
			const user = await User.find(params.id)
			delete user.password
			user.events = await user.events()
			return this.response(user)
		} catch (error) {
			return this.response(error, 500)
		}
	}

	/**
   * Register a new user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {import('../models/user')} User
   */
	async register(req, res, next) {
		const { body } = req
		try {
			// Validate the input
			await new Validator(body, {
				name: 'required',
				email: 'required|email',
				password: 'required|min:8'
			})
				.validate()


			// user exists
			const { email } = body
			const exists = await User.where({ email }).first()

			if (exists) {
				return res.status(422).json({
					errors: [{
						email: 'Email already exists'
					}]
				})
			}

			// Generate a unique username from the name. ensure it is not taken
			let username = body.name.replace(/\s/g, '').toLowerCase() + '-' + randomUUID()


			body.username = username
			body.bio = 'No bio yet'

			const user = await User.register(body) // TODO This now returns a Model
			const data = {
				name: body.name,
				email: body.email,
				text: `
				   Your Events254 account has been created. You can login with the following credentials:
				   Email: ${body.email}
				   Password: the password you provided.
				   Go to https://events254.co.ke/login to login.
				   Thank you for using Events254.
				   `
			}
			await new Mail(body, 'Welcome to events254', { template: 'welcome', data }).send()
			// Determine if the request requires a token and pass it if so
			if (req.requiresToken()) {
				const token = await createToken({
					tokenable_id: user.id,
					tokenable_type: 'users'
				})
				user.token = token
				return res.json(user)
			}
			return res.json(user)
		} catch (error) {
			next(error)
		}
	}

	/**
   * Send a password reset Email
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
	async sendPasswordResetEmail(req, res, next) {
		const { email } = req.body
		try {
			// Validate the input
			await new Validator({ email }, {
				email: 'required'
			}).validate()
			// Make sure the user exists
			const user = await User.where({ email }).first()
			if (user) {
				// Generate a token
				const token = randomBytes(64).toString('hex')
				// Delete any existing tokens
				await DB.table('password_resets')
					.where({ email })
					.delete()
				// Save it in the database
				await DB.table('password_resets').insert({
					email,
					token,
					created_at: new Date()
				})
				// Send the token to the user
				const data = {
					name: user.name,
					url: `${process.env.APP_URL}/password/update?email=${email}&token=${token}`
				}
				// Return a response to the user
				res.json('Please check your email for a password reset link')
				await new Mail(user, 'Password Reset Notification', { template: 'resetPassword', data }).send()
				return
			}
			return res.status(422).json('Sorry, we could not find that email address in our system')
		} catch (error) {
			if ('errors' in error) {
				return res.status(422).json(error)
			}
			next(error)
		}
	}

	/**
   * Reset a use's password
   * @param {*} payload
   */
	async resetPassword(payload = {}) {
		try {
			// Validate payload
			await new Validator(payload, {
				email: 'required|email',
				token: 'required',
				password: 'required'
			}).validate()
			// Verify the token
			const rec = await DB.table('password_resets')
				.where('email', payload.email)
				.first()


			// The record exists
			if (rec) {
				// if the token was created more than 30 minutes ago, it is invalid
				const created_at = new Date(rec.created_at).toUTCString()
				const now = new Date().toUTCString()
				const diff = (new Date(now) - new Date(created_at)) / 1000
				if (diff > 1800) {
					return this.response('The token has expired reset your password again', 422)
				}
				// Compare the two tokens
				if (rec.token === payload.token) {
					/** Hash the given password */
					const newP = await hash(payload.password, 10)
					await DB.table('users')
						.where('email', rec.email)
						.update({
							password: newP
						})
					/** Send a success message */
					return this.response('Success')
				}
			}
			/** Send a failed response */
			return this.response('Invalid token or token has expired please reset your password again', 422)
		} catch (error) {
			return this.response(error, error.status || 422)
		}
	}

	/**
	 * Update a user's profile
	 * 
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {import('express').NextFunction} next
	 * @returns {Promise<void>}
	 */
	async updateProfile(req, res, next) {
		try {
			// Validate the input
			await new Validator(req.body, {
				name: 'required|string',
				bio: 'string'
			}).validate()
			// Update the user
			const user = await req.user()
			const u = await User.find(user.id)
			await u.update(req.body)
			// Return a response to the user
			res.json(user)
		} catch (error) {
			next(error)
		}
	}
}

export default new UserController()
