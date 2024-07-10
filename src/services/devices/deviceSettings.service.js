const yealinkTemplateOptions = require('../templates/yealink/yealinkTemplateOptions')
const DeviceSetting = require('../../models/DeviceSettings')

/**
 * Get a device setting
 * @param {*} vendor
 * @param {*} tenantUuid
 * @param {*} setting
 */
module.exports.getDeviceSetting = async (vendor, tenantUuid, setting) => {}

/**
 * Update a device setting
 * @param {*} vendor
 * @param {*} tenantUuid
 * @param {*} setting
 * @param {*} value
 */
module.exports.updateDeviceSetting = async (vendor, tenantUuid, setting, value) => {
  switch (vendor) {
    case 'yealink':
      if (!yealinkTemplateOptions[setting.toUpperCase()]) {
        throw new Error('Unsupported setting')
      }

      const deviceSetting = await DeviceSetting.findOneAndUpdate(
        { tenantUuid, vendor, setting },
        { tenantUuid, vendor, setting, value },
        { upsert: true, new: true }
      )

      return deviceSetting
  }

  throw new Error('Unsupported vendor')
}

/**
 * Get all device settings
 * @param {*} vendor
 * @param {*} tenantUuid
 * @returns
 */
module.exports.getDeviceSettings = async (vendor, tenantUuid) => {
  return await DeviceSetting.find({ tenantUuid, vendor })
}
