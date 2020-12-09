/* eslint-disable func-call-spacing */
require('dotenv').config()
const path = require('path')
const { loadNuxt, build } = require('nuxt')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const usersRouter = require('./routes/users')
const groupsRouter = require('./routes/groups')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// app.use('/', indexRouter)
app.use('/api/users', usersRouter)
app.use('/api/groups', groupsRouter)

const doBuild = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing'

// eslint-disable-next-line no-unexpected-multiline
async function start () {
  // We get Nuxt instance
  const nuxt = await loadNuxt(doBuild ? 'start --spa' : 'dev')

  // Render every route with Nuxt.js
  app.use(nuxt.render)

  // Build only in dev mode with hot-reloading
  if (!doBuild) {
    build(nuxt)
  }
  app.use(nuxt.render)
}
start()

// TODO Remove this
// Error handling
// app.use(function (err, req, res) {
//   // eslint-disable-next-line no-console
//   console.error(err.stack)
//   res.status(500).json('Server error!')
// })

module.exports = app
