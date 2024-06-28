const wazoProxy = require('../ApiProxy')
const endpoints = require('../endpoints')

/**
 * Get SIP endpoint
 * @param {*} tenantUuid
 * @param {*} sipUuid
 * @documentation https://wazo-platform.org/documentation/api/configuration.html#tag/endpoints/operation/get_endpoint_sip
 * @returns
 */
module.exports.getSipEndpoint = async (tenantUuid, sipUuid) => {
  return await wazoProxy.get(`${endpoints.confd}/endpoints/sip/${sipUuid}`, {
    headers: {
      'Wazo-Tenant': tenantUuid
    }
  })
}
