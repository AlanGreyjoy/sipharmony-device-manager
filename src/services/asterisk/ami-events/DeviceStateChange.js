const logger = require('../../../utils/logger')
const amiCommands = require('../../asterisk/commands/AmiCommands')

const States = {
  UNAVAILABLE: 'UNAVAILABLE',
  NOT_INUSE: 'NOT_INUSE'
}

const Transports = {
  WSS: 'transport-wss',
  TLS: 'transport-tls',
  UDP: 'transport-udp',
  TCP: 'transport-tcp'
}

/**
 * DeviceStateChange event handler
 * @param {*} ami
 * @param {*} event
 */
module.exports = (ami, event) => {
  logger.info('DeviceStateChange event received')
  logger.info(JSON.stringify(event, null, 2))

  const device = event.device.split('/')[1]

  ami.action(
    {
      action: 'Command',
      command: 'pjsip show endpoint ' + device
    },
    (err, res) => {
      if (err) {
        console.error('Command error:', err)
      } else {
        console.log('output', res.output)
        const parameters = parseOutput(res.output)
        saveDeviceStatus(parameters, States[event.state])
      }
    }
  )
}

async function saveDeviceStatus(parameters, state) {
  console.log(parameters)

  const tenantUuid = parameters['__WAZO_TENANT_UUID']
  const userUuid = parameters['XIVO_USERUUID']
  const userId = parameters['XIVO_USERID']
  const transport = parameters['transport']

  if (!tenantUuid || !userUuid || !userId || !transport) {
    logger.error('Missing parameters to save device status')
    logger.error(
      `Parameter missing: ${!tenantUuid ? 'tenantUuid' : ''} ${!userUuid ? 'userUuid' : ''} ${!userId ? 'userId' : ''} ${!transport ? 'transport' : ''}`
    )
    return
  }

  // Check if device is in firestore
  const deviceRef = firestore.collection('deviceRegistration').doc(tenantUuid)

  const device = await deviceRef.get()

  if (!device.exists) {
    logger.error('Device not found in firestore')

    firestore
      .collection('deviceRegistration')
      .doc(tenantUuid)
      .set({
        devices: [
          {
            userId,
            userUuid,
            tenantUuid,
            transport,
            state
          }
        ]
      })
      .catch(error => {
        logger.error('Error writing document: ', error)
      })

    return
  }

  const devices = device.data().devices

  const deviceIndex = devices.findIndex(device => device.userId === userId)

  if (deviceIndex === -1) {
    devices.push({
      userId,
      userUuid,
      tenantUuid,
      transport,
      state
    })
  } else {
    devices[deviceIndex].state = state
  }

  firestore
    .collection('deviceRegistration')
    .doc(tenantUuid)
    .update({
      devices
    })
    .catch(error => {
      logger.error('Error writing document: ', error)
    })
}

function parseOutput(data) {
  const headersSection = data.slice(
    1,
    data.indexOf(
      '=========================================================================================='
    )
  )
  const valuesSectionStart =
    data.indexOf(
      '=========================================================================================='
    ) + 1
  const valuesSectionEnd = data.indexOf(' ParameterName                      : ParameterValue')
  const valuesSection = data
    .slice(valuesSectionStart, valuesSectionEnd)
    .filter(line => line.trim() !== '')
  const parametersSectionStart =
    data.indexOf(' ParameterName                      : ParameterValue') + 1
  const parametersSection = data.slice(parametersSectionStart)

  const headers = headersSection.reduce((acc, line) => {
    const match = line.match(/^\s*(\S+):\s*(.*)$/)
    if (match) {
      const [, key, value] = match
      acc[key.trim()] = value.trim()
    }
    return acc
  }, {})

  const combinedHeadersValues = {}
  Object.keys(headers).forEach(key => {
    combinedHeadersValues[key] = {}
  })

  valuesSection.forEach(line => {
    const match = line.match(/^\s*(\S+):\s*(.*)$/)
    if (match) {
      const [, key, value] = match
      if (key in combinedHeadersValues) {
        const parts = headers[key].split(/\s\s+/)
        const values = value.split(/\s\s+/)
        parts.forEach((part, index) => {
          combinedHeadersValues[key][part.trim()] = values[index] ? values[index].trim() : ''
        })
      } else {
        combinedHeadersValues[key] = value.trim()
      }
    }
  })

  const parameters = parametersSection.reduce((acc, line) => {
    const match = line.match(/^\s*(\S.*?)\s*:\s*(.*?)\s*$/)
    if (match) {
      const [, paramName, paramValue] = match
      acc[paramName.trim()] = paramValue.trim()
    }
    return acc
  }, {})

  return {
    ...combinedHeadersValues,
    ...parameters
  }
}
