const deviceService = require('../services/devices/deviceKey.service')
const userAgentParser = require('../utils/userAgentParser')
const logger = require('../utils/logger')
const provisionService = require('../services/provisioning/provisioning.service')

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

  const getDeviceKey = await deviceService.getDeviceKeyByDeviceKey(deviceKey)

  if (!getDeviceKey) {
    logger.error(`Invalid device key: <${deviceKey}> Device key does not exist in the database.`)
    return res.status(403).send({ message: 'Invalid device key!' })
  }

  if (!fileName) {
    logger.error('File name was not provided!')
    return res.status(400).send({ message: 'File name is required!' })
  }

  const userAgent = userAgentParser.parse(req.headers['user-agent'])

  if (!userAgent) {
    logger.error('User agent was not provided by the calling device!')
    return res.status(400).send({ message: 'User agent is required!' })
  }

  let configFile = null

  switch (userAgent.vendor?.toLowerCase()) {
    case 'yealink':
      configFile = await provisionService.provisionDevice(
        userAgent,
        fileName,
        getDeviceKey.tenantUuid
      )
      break
    default:
      logger.error('Unsupported device vendor!')
      return res.status(400).send({ message: 'Unsupported device vendor!' })
  }

  if (!configFile) {
    logger.error('No configuration file found!')
    return res.status(404).send({ message: 'No configuration file found!' })
  }

  res.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${fileName}"`,
    'Content-Length': configFile.length
  })

  // Send the buffer
  return res.send(configFile)
}
