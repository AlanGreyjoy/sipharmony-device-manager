const userAgentParser = require('../utils/userAgentParser')
const logger = require('../utils/logger')
const provisionService = require('../services/provisioning/provisioning.service')
const rpsService = require('../services/rps/rps.service')
const deviceService = require('../services/devices/device.service')
const deviceKeyService = require('../services/devices/deviceKey.service')
const wazoService = require('../services/wazo/wazo.service')
const AmiCommands = require('../services/asterisk/commands/AmiCommands')

/**
 * Get device files
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.getFile = async (req, res) => {
  const { deviceKey, fileName } = req.params

  const getDeviceKey = await deviceKeyService.getDeviceKeyByDeviceKey(deviceKey)

  if (!getDeviceKey) {
    logger.error(`Invalid device key: <${deviceKey}> Device key does not exist in the database.`)

    return res.status(403).send({ message: 'Invalid device key!' })
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

/**
 * Create a new device
 * @param {*} req
 * @param {*} res
 */
module.exports.createDevice = async (req, res) => {
  const device = req.body
  device.macAddress = device.macAddress.toUpperCase()

  const deviceExists = await deviceService.getDeviceByMac(device.macAddress)

  if (deviceExists) {
    return res.status(403).json({ message: 'Device already exists!' })
  }

  const rpsAccounts = await rpsService.getRpsAccounts({
    tenantUuid: device.tenantUuid
  })

  const hasRpsAccount = rpsAccounts.find(account => account.rpsType === device.vendor)

  if (hasRpsAccount) {
    device.rpsBound = true

    await rpsService.addDeviceToRps(
      {
        serverId: hasRpsAccount.id
      },
      device
    )
  }

  const newDevice = await deviceService.createDevice(device)

  return res.status(200).json(newDevice)
}

module.exports.getDevice = async (req, res) => {}

/**
 * Get devices by tenant UUID
 * @param {*} req
 * @param {*} res
 */
module.exports.getDevices = async (req, res) => {
  const { tenantUuid } = req.params

  const devices = await deviceService.getDevices({
    tenantUuid
  })

  return res.status(200).json(devices || [])
}

/**
 * Update device
 * @param {*} req
 * @param {*} res
 */
module.exports.updateDevice = async (req, res) => {
  const { id } = req.params
  const device = req.body

  console.log('device', device)

  const updatedDevice = await deviceService.updateDevice(id, device)

  return res.status(200).json(updatedDevice)
}

module.exports.deleteDevice = async (req, res) => {}

/**
 * Assign device to a user
 * @param {*} req
 * @param {*} res
 */
module.exports.assignDevice = async (req, res) => {
  const device = req.body

  const updatedDevice = await deviceService.assignDevice(device.userUuid, device._id)

  return res.status(200).json(updatedDevice)
}

/**
 * Unassign device from a user
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.unassignDevice = async (req, res) => {
  const { mac } = req.params

  const device = await deviceService.getDeviceByMac(mac)

  if (!device) {
    return res.status(404).send({ message: 'Device not found!' })
  }

  const updatedDevice = await deviceService.unassignDevice(device._id)

  return res.status(200).json(updatedDevice)
}

/**
 * Resync device
 * @param {*} req
 * @param {*} res
 */
module.exports.resyncDevice = async (req, res) => {
  const device = req.body

  const sipEndpoint = await wazoService.confd.lines.getSipEndpointOfMainLineForAUser(
    device.tenantUuid,
    device.userUuid
  )

  if (!sipEndpoint) throw new Error('SIP endpoint not found')

  AmiCommands.pjSip.resyncDevice(global.ami, sipEndpoint.name).catch(err => {
    logger.error(err)

    throw new Error('Failed to resync device')
  })

  return res.status(200).send({ message: 'Resync command sent successfully' })
}
