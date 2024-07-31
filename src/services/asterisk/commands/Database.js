const logger = require('../../../utils/logger')

/**
 * Show all registrations
 * @param {*} ami
 * @param {*} device
 * @returns
 */
module.exports.showRegistrations = async (ami, device) => {
  return new Promise((resolve, reject) => {
    ami.action(
      {
        action: 'Command',
        command: 'database show registrar'
      },
      (err, res) => {
        if (err) {
          console.error('Command error:', err)
          reject(err)
        } else {
          try {
            const parsedResult = parseResponse(res)

            return resolve(parsedResult)
          } catch (parseError) {
            reject(parseError)
          }
        }
      }
    )
  })
}

/**
 * Show a specific registration
 * @param {*} ami
 * @param {*} endpoint
 * @returns
 */
module.exports.showEndpointRegistration = async (ami, endpoint) => {
  logger.info(`Show endpoint registration for ${endpoint}`)

  return new Promise((resolve, reject) => {
    ami.action(
      {
        action: 'Command',
        command: 'database show registrar'
      },
      (err, res) => {
        if (err) {
          console.error('Command error:', err)
          reject(err)
        } else {
          try {
            const parsedResult = parseResponse(res)

            console.log('parsedResult', parsedResult)

            const deviceRegistration = parsedResult.find(
              registration => registration.details.endpoint === endpoint
            )

            console.log('deviceRegistration', deviceRegistration)

            return resolve(deviceRegistration?.details || null)
          } catch (parseError) {
            reject(parseError)
          }
        }
      }
    )
  })
}

const parseResponse = res => {
  const parsedOutput = res.output.slice(0, -1).map(item => {
    const [contact, details] = item.split(': ', 2)
    return {
      contact,
      details: JSON.parse(details)
    }
  })
  return parsedOutput
}
