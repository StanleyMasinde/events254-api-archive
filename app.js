import dotenv from 'dotenv'
import express, { json, urlencoded } from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { createSessionStore } from 'sessionstore'
dotenv.config()


import { init, Integrations, Handlers } from '@sentry/node'
import { Integrations as _Integrations } from '@sentry/tracing'
import publicRouter from './routes/public.js'
import usersRouter from './routes/users.js'
import groupsRouter from './routes/groups.js'
import authRouter from './routes/auth.js'
import eventsRouter from './routes/events.js'
import searchRouter from './routes/search.js'
import ticketRouter from './routes/tickets.js'
import paymentsRouter from './routes/payments.js'
import auth from './app/auth/auth.js'

const app = express()

app.use(cors({
	origin: process.env.CORS_ORIGIN || true,
	credentials: true,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}))

init({
	dsn: 'https://d88004dc1b994722b6152a3d89af37e4@o954334.ingest.sentry.io/5986920',
	environment: 'production',
	integrations: [
		new Integrations.Http({ tracing: false }),
		new _Integrations.Express({ app })
	],
	tracesSampleRate: 1.0
})

app.use(Handlers.requestHandler())
app.use(Handlers.tracingHandler())

app.use(json())
app.use(urlencoded({ extended: false }))
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
	store: process.env.NODE_ENV === 'development'
		? null
		: createSessionStore({
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
		error: 'Sorry, the requested resource does not live here 😢'
	})
})

// Catch all error routes
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
	const env = process.env.NODE_ENV
	if (env === 'development' || env === 'testing' || process.env.DEBUG) {
		return res.status(err.status || 500).json({
			error: err.message,
			stack: err.stack
		})
	}

	return res.status(err.status || 500).json({
		error: 'Sorry, something went wrong 😢. Our team has been notified and is working on it.'
	})
})

app.use(Handlers.errorHandler())
export default app
