const deviceService = require('../services/devices/deviceKey.service')
const userAgentParser = require('../utils/userAgentParser')
const logger = require('../utils/logger')

/**
 * Get device files
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.getFile = async (req, res) => {
  const { deviceKey, fileName } = req.params

  if (!deviceKey) {
    logger.error('Device key was not provided!')
    return res.status(400).send({ message: 'Device key is required!' })
  }

  const getDeviceKey = await deviceService.getDeviceKey(deviceKey)

  if (!getDeviceKey) {
    logger.error(`Invalid device key: <${deviceKey}> Device key does not exist in the database.`)
    return res.status(403).send({ message: 'Invalid device key!' })
  }

  if (!fileName) {
    logger.error('File name was not provided!')
    return res.status(400).send({ message: 'File name is required!' })
  }

  // Get user agent
  const userAgent = userAgentParser.parse(req.headers['user-agent'])
  console.log(userAgent)

  const file = fileName.split('.')[0]
  const extension = fileName.split('.')[1]

  res.download(`./public/${tenantUuid}/${file}.${extension}`, `${file}.${extension}`)
}
