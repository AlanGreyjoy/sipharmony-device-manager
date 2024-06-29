const deviceSettingsService = require('../services/devices/deviceSettings.service')
const logger = require('../utils/logger')

module.exports.getDeviceSettings = async (req, res) => {}

/**
 * Update a device setting
 * @param {*} req
 * @param {*} res
 */
module.exports.updateDeviceSettings = async (req, res) => {
  const { tenantUuid, vendor, setting, value } = req.body

  await deviceSettingsService.updateDeviceSetting(vendor, tenantUuid, setting, value)

  res.status(204).send()
}
