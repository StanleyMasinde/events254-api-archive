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

// TODO Create a resusbale mail class or package
// class BaseMail {
//   constructor (subject, message, to, from, replyTo) {
//     this.subject = subject
//     this.recipient = to
//     this.sender = from
//     this.replyTo = replyTo
//     this.message = message
//   }

//   /**
//    * Send the email immediately
//    */
//   sendNow () {
//     mail.sendMail({
//       subject: this.subject,
//       to: this.recipient,
//       from: this.sender,
//       replyTo: this.replyTo
//     })
//   }

//   /**
//    * Add mail to queue
//    * // TODO add queueing
//    */
//   queue () {

//   }
// }

module.exports = mail
