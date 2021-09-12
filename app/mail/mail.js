const nodemailer = require('nodemailer')
const { pugEngine } = require('nodemailer-pug-engine')

const mail = nodemailer.createTransport({
  streamTransport: process.env.STREAM_MAIL === 'true',
  host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  port: process.env.MAIL_PORT || 2525,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
})
mail.use('compile', pugEngine({
  templateDir: __dirname
}))

class Mail {
  /**
   * Send a new email
   * @param {Object} recipient - The user receiving the email
   * @param {String} subject - the subject of the email
   * @param {Object} Options - The email params
   */
  constructor (recipient, subject, options = { template: null, data: null }) {
    this.sender = '"Events254" <no-reply@events254.com>'
    this.recipient = recipient
    this.subject = subject
    this.template = options.template
    this.data = options.data
  }

  /**
   * Save sent email to database
   * @param {Object} email - The email to be saved
   */
  async save (email) {
    const Email = require('../models/email')
    const newEmail = new Email(email)
    await newEmail.save()
  }

  /**
   * Send the email
   */
  async send () {
    try {
      await mail.sendMail({
        from: this.sender,
        to: this.recipient.email,
        subject: this.subject,
        template: this.template,
        ctx: this.data,
        icalEvent: this.data.icalString
      })

    } catch (error) {
      error.status = 500
      throw error
    }
  }
}

module.exports = Mail
