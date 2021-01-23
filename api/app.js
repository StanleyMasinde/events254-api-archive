const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const sessionstore = require('sessionstore')

// Require passportjs for auth
const passport = require('./app/auth/auth')

const usersRouter = require('./routes/users')
const groupsRouter = require('./routes/groups')
const authRouter = require('./routes/auth')
const eventsRouter = require('./routes/events')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  secret: 'super-secret-cookie',
  resave: false,
  saveUninitialized: true,
  name: 'events254_session',
  store: process.env.NODE_ENV === 'testing'
    ? null
    : sessionstore.createSessionStore({
      type: 'redis'
    })
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

app.use('/users', usersRouter)
app.use('/groups', groupsRouter)
app.use('/auth', authRouter)
app.use('/events', eventsRouter)

module.exports = app
