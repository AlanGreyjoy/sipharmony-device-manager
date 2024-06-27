const DeviceKey = require('../../models/DeviceKeys')

/**
 * Get the device key for the given tenant
 * @param {*} tenantUuid
 * @returns
 */
module.exports.getDeviceKey = async tenantUuid => {
  return await DeviceKey.findOne({
    tenantUuid
  })
}

/**
 * Create a new device key
 * @param {*} tenantUuid
 * @param {*} deviceKey
 * @returns
 */
module.exports.createDeviceKey = async (tenantUuid, deviceKey) => {
  return await DeviceKey.create({
    tenantUuid,
    deviceKey
  })
}

/**
 * Delete the device key for the given tenant
 * @param {*} tenantUuid
 * @returns
 */
module.exports.deleteDeviceKey = async tenantUuid => {
  return await DeviceKey.deleteOne({
    tenantUuid
  })
}

/**
 * Update the device key for the given tenant
 * @param {*} tenantUuid
 * @param {*} deviceKey
 * @returns
 */
module.exports.updateDeviceKey = async (tenantUuid, deviceKey) => {
  return await DeviceKey.updateOne({ tenantUuid }, { deviceKey })
}
