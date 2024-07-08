const deviceKeyService = require('../services/devices/deviceKey.service')
const generators = require('../utils/generators')
const logger = require('../utils/logger')

/**
 * Create a new device key
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.createDeviceKey = async (req, res) => {
  const { tenantUuid, key, rps } = req.body

  if (!tenantUuid) {
    logger.error('Tenant UUID was not provided!')
    return res.status(400).send({ message: 'Tenant UUID is required!' })
  }

  const getDeviceKey = await deviceKeyService.getDeviceKey(tenantUuid)

  if (getDeviceKey) {
    logger.error(`Device key already exists for tenant: <${tenantUuid}>`)
    return res.status(403).send({ message: 'Device key already exists!' })
  }

  const deviceKey = key || generators.generateRandomString()

  await deviceKeyService.createDeviceKey(tenantUuid, deviceKey)

  logger.info(`Device key created for tenant: <${tenantUuid}>`)

  return res.status(201).send({ message: 'Device key created!', deviceKey })
}

/**
 * Get device key
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.getDeviceKey = async (req, res) => {
  const { tenantUuid } = req.params

  if (!tenantUuid) {
    logger.error('Tenant UUID was not provided!')
    return res.status(400).send({ message: 'Tenant UUID is required!' })
  }

  const getDeviceKey = await deviceKeyService.getDeviceKey(tenantUuid)

  if (!getDeviceKey) {
    logger.error(`Device key does not exist for tenant: <${tenantUuid}>`)
    return res.status(404).send({ message: 'Device key not found!' })
  }

  return res.status(200).json({ tenantUuid, deviceKey: getDeviceKey.deviceKey })
}

/**
 * Delete device key
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.deleteDeviceKey = async (req, res) => {
  const { tenantUuid } = req.params

  if (!tenantUuid) {
    logger.error('Tenant UUID was not provided!')
    return res.status(400).send({ message: 'Tenant UUID is required!' })
  }

  const getDeviceKey = await deviceKeyService.getDeviceKey(tenantUuid)

  if (!getDeviceKey) {
    logger.error(`Device key does not exist for tenant: <${tenantUuid}>`)
    return res.status(404).send({ message: 'Device key not found!' })
  }

  await deviceKeyService.deleteDeviceKey(tenantUuid)

  logger.info(`Device key deleted for tenant: <${tenantUuid}>`)

  return res.status(200).send({ message: 'Device key deleted!' })
}

/**
 * Update device key - change the device key with a random string
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.updateDeviceKey = async (req, res) => {
  const { tenantUuid, key, rps } = req.body

  if (!tenantUuid) {
    logger.error('Tenant UUID was not provided!')
    return res.status(400).send({ message: 'Tenant UUID is required!' })
  }

  const getDeviceKey = await deviceKeyService.getDeviceKey(tenantUuid)

  if (!getDeviceKey) {
    logger.error(`Device key does not exist for tenant: <${tenantUuid}>`)
    return res.status(404).send({ message: 'Device key not found!' })
  }

  const newDeviceKey = key || generators.generateRandomString()

  await deviceKeyService.updateDeviceKey(tenantUuid, newDeviceKey)

  logger.info(`Device key updated for tenant: <${tenantUuid}>`)

  return res.status(200).send({ message: 'Device key updated!' })
}
