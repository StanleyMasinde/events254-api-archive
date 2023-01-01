import { compareSync } from 'bcrypt'
import { DB } from 'mevn-orm'
import createToken from './createToken.js'

const auth = () => {
	/**
   * Auth middleware
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
	return function (req, res, next) {
		/**
	   * Attempt to login a user with the given credentials
	   * @param {String} guard The current user table
	   */
		req.attempt = function (guard = 'users') {
			const { email, password } = this.body
			DB.table(guard)
				.where({ email })
				.orWhere({ username: email })
				.first()
				.then((user) => {
					// The email is correct
					if (user) {
						if (compareSync(password, user.password)) {

							return createToken({
								tokenable_id: user.id,
								tokenable_type: 'users'
							}).then((token) => {
								user.token = token
								return res.json({ user })
							})
								.catch((e) => {
									return next(e)
								})
						}
						return res.status(401).json({ message: 'These credentials do not match our records' }) // The password did not match
					}
					return res.status(401).json({ message: 'These credentials do not match our records' }) // The email is wrong
				})
				.catch((err) => {
					return next(err) // An error occoured possibly a database error
				})
		}

		/**
	   * Login a user using the database ID
	   * @param {number} id
	   */
		req.logIn = (id) => {
			DB.table(this.guard())
				.where({ id })
				.first()
		}

		/**
	 * Get the current user
	 * @param {String} guard the guard to use default is users
	 * @returns {Array}
	 */
		req.user = async (guard = 'users') => {
			if (req.header('Authorization')) {
				// eslint-disable-next-line func-call-spacing
				const token = req.header('Authorization').split(' ')[1]
				// eslint-disable-next-line no-unexpected-multiline
				return (async function () {
					if (!token) {
						return null
					}
					try {
						const tk = await DB.table('personal_access_tokens')
							.where({ token, tokenable_type: guard }).first()
						if (!tk) {
							return null
						}
						const user = await DB.table(guard).where({ id: tk.tokenable_id }).first(['id', 'name', 'username', 'email', 'bio', 'created_at', 'updated_at'])
						return user
					} catch (e) {
						return next(e)
					}
				})()
			}
			return null
		}

		/**
	 * Destroy a user's sessions
	 */
		req.logOut = () => {
			req.session.auth = {}
		}

		/**
	 * Check if request is authenticated
	 * @param {String} guard
	 * @returns {Boolean}
	 */
		req.isAuthenticated = async (guard = 'users') => {
			return await req.user(guard)
		}
		next()
	}
}

export default auth()
