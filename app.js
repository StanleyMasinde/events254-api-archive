require('dotenv').config()
const express = require('express')
const session = require('express-session')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// Auth
const passport  = require('./app/auth/auth')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const groupsRouter = require('./routes/groups')
const authRouter = require('./routes/auth')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
	secret: 'super-secret-cookie', resave: false, saveUninitialized: true, name: 'events254_session',
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())


app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/groups', groupsRouter)
app.use('/auth', authRouter)

// Error handling
app.use(function (err, req, res) {
	console.error(err.stack)
	res.status(500).json('Server error!')
})

module.exports = app
