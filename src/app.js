const express = require('express')
require('express-async-errors')
const http = require('http')
const helmet = require('helmet')
const cors = require('cors')
const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')

const Cabin = require('cabin')
const Axe = require('axe')
const requestReceived = require('request-received')
const responseTime = require('response-time')
const { Signale } = require('signale')

const logger = new Axe({
  logger: new Signale({
    types: {
      debug: {
        badge: '🐛',
        color: 'magenta',
        label: 'debug'
      },
      error: {
        badge: '🔥',
        color: 'red',
        label: 'error'
      },
      fatal: {
        badge: '💀',
        color: 'red',
        label: 'fatal'
      },
      info: {
        badge: '💡',
        color: 'blue',
        label: 'info'
      },
      trace: {
        badge: '📝',
        color: 'grey',
        label: 'trace'
      },
      warn: {
        badge: '⚠️',
        color: 'yellow',
        label: 'warn'
      }
    },
    scope: 'express'
  })
})

const cabin = new Cabin({ logger })

const app = express()

app.use(requestReceived)
app.use(responseTime())
app.use(cabin.middleware)

const server = http.createServer(app)

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
)

const corsOptions = {
  origin: '*'
}

app.use(cors(corsOptions))

app.use(express.json({ limit: '200mb' }))
app.use(express.urlencoded({ limit: '200mb', extended: true }))

app.use(express.static('public'))

app.use(routes)

app.use((req, res, next) => {
  logger.debug(`Route not found: ${req.originalUrl}`)
  return res.status(404).send({ message: 'Route not found!', requestedRoute: req.originalUrl })
})

app.use(errorHandler)

module.exports = server
