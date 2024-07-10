const parsers = require('../parsers/Parsers')

/**
 * Show all endpoints
 * @param {*} ami
 */
module.exports.showEndpoints = async ami => {}

/**
 * Show a specific endpoint
 * @param {*} ami
 * @param {*} endpoint
 */
module.exports.showEndpoint = async (ami, endpoint) => {
  return new Promise((resolve, reject) => {
    ami.action(
      {
        action: 'Command',
        command: 'pjsip show endpoint ' + endpoint
      },
      (err, res) => {
        if (err) {
          console.error('Command error:', err)
          reject(err)
        } else {
          try {
            const parsedResult = parsers.pjSip.showEndpoint(res.output)
            resolve(parsedResult)
          } catch (parseError) {
            reject(parseError)
          }
        }
      }
    )
  })
}
