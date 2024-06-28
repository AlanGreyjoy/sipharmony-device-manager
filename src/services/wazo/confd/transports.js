const wazoProxy = require('../ApiProxy')
const endpoints = require('../endpoints')

/**
 * Get transport from Wazo API by tenantUuid and transportUuid
 * @param {*} tenantUuid
 * @param {*} transportUuid
 * @documentation https://wazo-platform.org/documentation/api/configuration.html#tag/sip/operation/get_sip_transport
 */
module.exports.getTransport = async (tenantUuid, transportUuid) => {
  return await wazoProxy.get(`${endpoints.confd}/sip/transports/${transportUuid}`, {
    headers: {
      'Wazo-Tenant': tenantUuid
    }
  })
}
