require('dotenv').config()
const server = require('./app')
const logger = require('./utils/logger')
const mongooseService = require('./services/mongoose/mongoose.service')

require('./services/asterisk/asterisk')

init()

async function init() {
  await connectToDatabase()
  await startServer()
}

async function connectToDatabase() {
  logger.info('Connecting to database...')

  await mongooseService.connect().catch(err => {
    logger.error('Error connecting to database: ', err)

    process.exit(1)
  })
}

async function startServer() {
  logger.info('Starting server...')

  server.listen(process.env.PORT, async () => {
    logger.info(`Server is running on port ${process.env.PORT}`)
  })
}
