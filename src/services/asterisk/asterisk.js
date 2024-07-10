const logger = require('../../utils/logger')
const Events = require('./ami-events/Events')

const enableLogging = true

async function connectToAsterisk() {
  logger.info('Connecting to Asterisk...')

  const amiConfig = {
    host: process.env.AMI_HOST,
    port: 5038,
    username: process.env.AMI_USERNAME,
    password: process.env.AMI_PASSWORD
  }

  const ami = new require('asterisk-manager')(
    amiConfig.port,
    amiConfig.host,
    amiConfig.username,
    amiConfig.password,
    true
  )

  ami.keepConnected()

  global.ami = ami

  ami.on('managerevent', function (evt) {
    switch (evt.event) {
      case 'DeviceStateChange':
        //Events.DeviceStateChange(ami, evt)
        break
      case 'ContactStatus':
        Events.ContactStatus(ami, evt)
        break
      case 'MessageWaiting':
        Events.MessageWaiting(ami, evt)
        break
      case 'UserEvent':
        Events.UserEvent(ami, evt)
        break
      default:
        if (enableLogging) logger.info(`Event received: ${evt.event}`)
        break
    }
  })
}

connectToAsterisk()
