const wazoProxy = require('../ApiProxy')
const endpoints = require('../endpoints')

/**
 * Get user from Wazo API by tenantUuid and userId
 * @param {*} tenantUuid
 * @param {*} userId
 * @documentation https://wazo-platform.org/documentation/api/configuration.html#tag/users/operation/get_user
 * @returns
 */
module.exports.getUser = async (tenantUuid, userId) => {
  return await wazoProxy.get(`${endpoints.confd}/users/${userId}`, {
    headers: {
      'Wazo-Tenant': tenantUuid
    }
  })
}
