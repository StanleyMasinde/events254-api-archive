/* eslint-disable func-call-spacing */
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')

const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const groupsRouter = require('./routes/groups')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/groups', groupsRouter)

module.exports = app
