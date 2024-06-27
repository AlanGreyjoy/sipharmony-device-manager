const deviceService = require('../services/devices/deviceKey.service')
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

  const file = fileName.split('.')[0]
  const extension = fileName.split('.')[1]

  res.download(`./public/${file}.${extension}`, `${file}.${extension}`)
}

/**
 * Create a new device key
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.createDeviceKey = async (req, res) => {
  const { tenantUuid, deviceKey } = req.body

  if (!tenantUuid) {
    logger.error('Tenant UUID was not provided!')
    return res.status(400).send({ message: 'Tenant UUID is required!' })
  }

  if (!deviceKey) {
    logger.error('Device key was not provided!')
    return res.status(400).send({ message: 'Device key is required!' })
  }

  const getDeviceKey = await deviceService.getDeviceKey(tenantUuid)

  if (getDeviceKey) {
    logger.error(`Device key already exists for tenant: <${tenantUuid}>`)
    return res.status(403).send({ message: 'Device key already exists!' })
  }

  await deviceService.createDeviceKey(tenantUuid, deviceKey)

  logger.info(`Device key created for tenant: <${tenantUuid}>`)

  return res.status(201).send({ message: 'Device key created!' })
}
