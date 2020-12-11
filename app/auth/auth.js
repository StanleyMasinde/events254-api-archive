const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { compare } = require('bcrypt')
const User = require('../models/user')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (username, password, done) => {
  User.whereFirst({ email: username })
    .then((u) => {
      compare(password, u.password, (err, same) => {
        if (err) {
          done(err)
        }
        if (same) {
          done(null, u)
        } else {
          done()
        }
      })
    }).catch((e) => {
      done(e)
    })
}))
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.whereFirst({ id })
    .then((user) => {
      done(null, user)
    }).catch((e) => {
      done(e)
    })
})

module.exports = passport
