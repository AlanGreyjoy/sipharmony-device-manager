const yealink = require('./yealink.provisioning')

/**
 * Provision a device
 * @param {*} device
 * @param {*} requestedFile
 * @param {*} tenantUuid
 * @returns
 */
module.exports.provisionDevice = async (device, requestedFile, tenantUuid) => {
  if (device.vendor.toLowerCase() === 'yealink') {
    return yealink(device, requestedFile, tenantUuid)
  }

  throw new Error('Unsupported vendor')
}
