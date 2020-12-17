const { randomBytes } = require('crypto')
const Validator = require('mevn-validator')
const { DB } = require('mevn-orm')
const { hash } = require('bcrypt')
const mail = require('../mail/mail')
const User = require('../models/user')
const Controller = require('./controller')

class UserController extends Controller {
  /**
  * @returns {Object} A collection of users
  */
  async index () {
    try {
      return this.response(await User.all())
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Register a new user
   * @param {*} details
   */
  async register (details = []) {
    try {
      // Validate the input
      await new Validator(details, {
        name: 'required',
        email: 'required|email',
        password: 'required|min:8'
      })
        .validate()

      const u = await User.register(details)
      // TODO use queing here
      await mail.sendMail({
        from: '"Events254" <no-reply@events254.com>',
        to: details.email,
        subject: 'Welcome to Events254',
        template: 'welcome',
        ctx: {
          user: details
        }
      })
      return this.response(u)
    } catch (error) {
      return this.response(error, error.status || 422)
    }
  }

  /**
   * Send a password reset Email
   * @param {*} email
   */
  async sendPasswordResetEmail (email = '') {
    try {
      // Validate the input
      await new Validator({ email }, {
        email: 'required'
      }).validate()
      // Make sure the user exists
      const exists = await User.whereFirst({ email })
      if (exists) {
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
          created_at: new Date().toISOString()
        })
        // Send the token to the user
        await mail.sendMail({
          from: '"Events254" <no-reply@events254.com>',
          to: email,
          subject: 'Password Reset notification',
          template: 'resetPassword',
          ctx: {
            url: `${process.env.APP_URL}/password/update?email=${email}&token=${token}`
          }
        })
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
