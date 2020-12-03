const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const { compare } = require('bcrypt')

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
}, (username, password, done) => {
	new User().whereFirst({ email: username })
		.then((u) => {
			compare(password, u.password, (err, same) => {
				if (err) {
					done(err)
				}
				if (same) {
					done(null, u)
				} else {
					done('Invalid credentials')
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
	new User().whereFirst({ id })
		.then((user) => {
			done(null, user)
		}).catch((e) => {
			done(e)
		})
})



module.exports =  passport
