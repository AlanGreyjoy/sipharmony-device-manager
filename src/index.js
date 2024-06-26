require('dotenv').config()
const server = require('./app')
const logger = require('./utils/logger')

init()

async function init() {
  startServer()
}

async function startServer() {
  logger.info('Starting server...')

  server.listen(process.env.PORT, async () => {
    logger.info(`Server is running on port ${process.env.PORT}`)
  })
}
