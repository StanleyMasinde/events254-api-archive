const { randomBytes } = require('crypto')
const Validator = require('mevn-validator')
const { DB } = require('mevn-orm')
const { hash } = require('bcrypt')
const Mail = require('../mail/mail')
const User = require('../models/user')
const createToken = require('../auth/createToken')
const Controller = require('./controller')

class UserController extends Controller {
  /**
  * @returns {Array} A collection of users
  */
  async index () {
    try {
      return this.response(await User.all())
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   *
   * @param {Express.Request} request
   * @returns
   */
  async show ({ params }) {
    try {
      const user = await User.find(params.id)
      delete user.password
      return this.response(user)
    } catch (error) {
      return this.response(error, 500)
    }
  }

  /**
   * Register a new user
   * @param {Express.Request} request the express request object
   */
  async register (request) {
    const { body } = request
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
        return this.response({ errors: { email: 'This email is already registerd' } }, 422)
      }

      const user = await User.register(body) // TODO This now returns a Model
      const data = {
        name: body.name
      }
      await new Mail(body, 'Welcome to events254', { template: 'welcome', data }).send()
      // Determine if the request requires a token and pass it if so
      if (request.requiresToken()) {
        const token = await createToken({
          tokenable_id: user.id,
          tokenable_type: 'users'
        })
        user.token = token
        return this.response({ user })
      }
      return this.response(user)
    } catch (error) {
      // If error is 422
      return this.response(error, error.status || 422)
    }
  }

  /**
   * Send a password reset Email
   * @param {String} email - The email of the user
   */
  async sendPasswordResetEmail (email) {
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
        await new Mail(user, 'Password Reset Notification', { template: 'resetPassword', data }).send()
        // Return a response to the user
        return this.response('Please check your email for a password reset link')
      }
      return this.response('We could not find a user associated with this email', 422)
    } catch (error) {
      return this.response(error, error.status || 422)
    }
  }

  /**
   * Reset a use's password
   * @param {*} payload
   */
  async resetPassword (payload = {}) {
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
      return this.response('Invalid token', 422)
    } catch (error) {
      return this.response(error, error.status || 422)
    }
  }
}

module.exports = new UserController()
