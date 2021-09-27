require('dotenv').config()
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const sessionstore = require('sessionstore')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const publicRouter = require('./routes/public')
const usersRouter = require('./routes/users')
const groupsRouter = require('./routes/groups')
const authRouter = require('./routes/auth')
const eventsRouter = require('./routes/events')
const searchRouter = require('./routes/search')
const ticketRouter = require('./routes/tickets')
const paymentsRouter = require('./routes/payments')
const auth = require('./app/auth/auth')

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}))

Sentry.init({
  dsn: 'https://6aaa64b176a0433da7cb306409587b56@o954334.ingest.sentry.io/5903368',
  environment: 'production',
  integrations: [
    new Sentry.Integrations.Http({ tracing: false }),
    new Tracing.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(session({
  rolling: true,
  secret: 'super-secret-cookie',
  resave: false,
  saveUninitialized: true,
  name: 'events254_session',
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: 'auto'
  },
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
app.use('/search', searchRouter)
app.use('/tickets', ticketRouter)
app.use('/payments', paymentsRouter)
app.use('/p', publicRouter)

// Catch all 404 routes
app.use((req, res) => {
  res.status(404).json({
    error: 'The requested resource could not be found.'
  })
})

app.use(Sentry.Handlers.errorHandler())
module.exports = app
