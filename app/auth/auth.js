const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { compare } = require('bcrypt')
const User = require('../models/user')

passport.use(new LocalStrategy({
  // TODO enable login with both username and email
  usernameField: 'email',
  passwordField: 'password'
}, (username, password, done) => {
  User.whereFirst({ email: username })
    .then((u) => {
      // Ensure the user is not null
      if (!u) {
        return done()
      }
      // The user exists
      compare(password, u.password, (err, same) => {
        // Error during comparision this would result to a 500 status code
        if (err) {
          done(err)
        }
        // Password matches
        if (same) {
          done(null, u)
        }
        // Password did not match
        done()
      })
    })
    .catch((e) => {
      done(e)
    })
}))

/** Store the user ID in the session */
passport.serializeUser((user, done) => {
  done(null, user.id)
})

/** Getting a user from the database  */
passport.deserializeUser((id, done) => {
  User.whereFirst({ id })
    .then((user) => {
      done(null, user)
    }).catch((e) => {
      done(e)
    })
})

module.exports = passport
