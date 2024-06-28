const wazoProxy = require('../ApiProxy')
const endpoints = require('../endpoints')

/**
 * Get devices from Wazo API by tenantUuid
 * @param {*} tenantUuid
 * @returns
 */
module.exports.getDevices = async tenantUuid => {
  return await wazoProxy.get(`${endpoints.confd}/devices`, {
    headers: {
      'Wazo-Tenant': tenantUuid
    }
  })
}

/**
 * List device lines from Wazo API by tenantUuid and deviceId
 * @param {*} tenantUuid
 * @param {*} deviceId
 * @returns
 */
module.exports.listDeviceLines = async (tenantUuid, deviceId) => {
  return await wazoProxy.get(`${endpoints.confd}/devices/${deviceId}/lines`, {
    headers: {
      'Wazo-Tenant': tenantUuid
    }
  })
}

/**
 * Get device from Wazo API by tenantUuid and deviceId
 * @param {*} tenantUuid
 * @param {*} deviceId
 * @returns
 */
module.exports.getDevice = async (tenantUuid, deviceId) => {
  return await wazoProxy.get(`${endpoints.confd}/devices/${deviceId}`, {
    headers: {
      'Wazo-Tenant': tenantUuid
    }
  })
}
