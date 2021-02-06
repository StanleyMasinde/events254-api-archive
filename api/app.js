const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const sessionstore = require('sessionstore')
const useragent = require('express-useragent')

// Require passportjs for auth
const passport = require('./app/auth/auth')

const usersRouter = require('./routes/users')
const groupsRouter = require('./routes/groups')
const authRouter = require('./routes/auth')
const eventsRouter = require('./routes/events')

const app = express()

app.use(useragent.express())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// this is the original session manager

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
// the new session handler
/* const sessionHandler = session({
  secret: 'super-secret-cookie',
  resave: false,
  saveUninitialized: true,
  name: 'events254_session',
  store: process.env.NODE_ENV === 'testing'
    ? null
    : sessionstore.createSessionStore({
      type: 'redis'
    })
})

// a simple middleware to check useraget and create session
app.use((req, res, next) => {
  // check the user agent
  // TIP use (req.useragent.isMobile) to check if the session was created
  if (req.useragent.isDesktop) {
    return sessionHandler(req, res, next)
  } else {
    next()
  }
}) */

// Passport
app.use(passport.initialize())
app.use(passport.session())

app.use('/users', usersRouter)
app.use('/groups', groupsRouter)
app.use('/auth', authRouter)
app.use('/events', eventsRouter)

if (process.env.NODE_ENV === 'api') {
  const port = process.env.PORT | 3000
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API DEV server running on http://localhost:${port}`)
  })
} else {
  module.exports = app
}
