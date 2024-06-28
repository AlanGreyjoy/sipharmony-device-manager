const wazoProxy = require('../ApiProxy')
const endpoints = require('../endpoints')

/**
 * Get lines from Wazo API by tenantUuid
 * @param {*} tenantUuid
 * @returns
 */
module.exports.getLines = async tenantUuid => {
  return await wazoProxy.get(`${endpoints.confd}/lines`, {
    headers: {
      'Wazo-Tenant': tenantUuid
    }
  })
}

/**
 * Get line from Wazo API by tenantUuid and lineId
 * @param {*} tenantUuid
 * @param {*} lineId
 * @returns
 */
module.exports.getLine = async (tenantUuid, lineId) => {
  return await wazoProxy.get(`${endpoints.confd}/lines/${lineId}`, {
    headers: {
      'Wazo-Tenant': tenantUuid
    }
  })
}

/**
 * Get SIP endpoint of main line for a user
 * @param {*} tenantUuid
 * @param {*} userUuid
 * @documentation https://wazo-platform.org/documentation/api/configuration.html#tag/lines/operation/get_user_line_main_associated_endpoints_sip
 * @returns
 */
module.exports.getSipEndpointOfMainLineForAUser = async (tenantUuid, userUuid) => {
  return await wazoProxy.get(
    `${endpoints.confd}/users/${userUuid}/lines/main/associated/endpoints/sip`,
    {
      headers: {
        'Wazo-Tenant': tenantUuid
      }
    }
  )
}
