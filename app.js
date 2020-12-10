/* eslint-disable func-call-spacing */
require('dotenv').config()
const path = require('path')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')

// Auth
const passport = require('./app/auth/auth')

const usersRouter = require('./routes/users')
const groupsRouter = require('./routes/groups')
const authRouter = require('./routes/auth')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'super-secret-cookie', resave: false, saveUninitialized: true, name: 'events254_session'
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/groups', groupsRouter)
app.use('/auth', authRouter)

module.exports = app
