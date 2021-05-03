const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const sessionstore = require('sessionstore')

const publicRouter = require('./routes/public')
const usersRouter = require('./routes/users')
const groupsRouter = require('./routes/groups')
const authRouter = require('./routes/auth')
const eventsRouter = require('./routes/events')
const auth = require('./app/auth/auth')

const app = express()

app.locals.applicationName = 'Events254'
app.locals.applicationemail = 'info@events254.co.ke'

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(session({
  rolling: true,
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
app.use(auth)

app.use('/users', usersRouter)
app.use('/groups', groupsRouter)
app.use('/auth', authRouter)
app.use('/events', eventsRouter)
app.use('/p', publicRouter)
if (process.env.NODE_ENV === 'api') {
  const port = process.env.PORT | 3000
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API DEV server running on http://localhost:${port}`)
  })
} else {
  module.exports = app
}
