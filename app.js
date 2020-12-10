/* eslint-disable func-call-spacing */
require('dotenv').config()
const path = require('path')
const { loadNuxt, build } = require('nuxt')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const groupsRouter = require('./routes/groups')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/groups', groupsRouter)

const doBuild = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing'

async function start () {
  const nuxt = await loadNuxt(doBuild ? 'start' : 'dev')
  app.use(nuxt.render)
  if (!doBuild) {
    build(nuxt)
  }
  app.use(nuxt.render)
}
start()

module.exports = app
