const AGIServer = require('asteriskagi')
const logger = require('../../../utils/logger')

function startFastAgiServer() {
  logger.info('Starting FastAGI server...')

  const agi = new AGIServer({ port: 4573 }) // Server (optional port, default: 4573)

  agi.on('ready', () => {
    logger.info('AGI server is ready to accept connections.')
  })

  agi.on('call', async call => {
    const {
      remoteServer,
      uniqueid,
      context,
      extension,
      priority,
      calleridname,
      callerid,
      channel
    } = call

    console.log('call', call)

    call.on('hangup', () => {
      console.log(`Hangup  ${remoteServer}/${channel}`)
    })

    call.on('error', err => {
      console.error(`ERROR: ${remoteServer}/${channel}: ${err}`)
    })

    await call.Answer()
    await call.Playback('beep')
    await call.SayAlpha('hello')
    await call.Hangup()
  })

  agi.on('error', err => {
    logger.error(`AGI server error: ${err}`)
  })
}

startFastAgiServer()
