const logger = require('../../utils/logger')
const RpsAccount = require('../../models/RpsAccount')

/**
 * Get all RPS accounts
 * @param {*} tenantUuid
 * @returns
 */
module.exports.getAllRpsAccounts = async tenantUuid => {
  logger.info(`Getting all RPS accounts for tenant: <${tenantUuid}>`)

  const rpsAccounts = await RpsAccount.find({ tenantUuid })

  return rpsAccounts
}

/**
 * Add RPS account
 * @param {*} tenantUuid
 * @param {*} account
 */
module.exports.addRpsAccount = async (tenantUuid, account) => {
  logger.info(`Adding RPS account for tenant: <${tenantUuid}>`)

  const newRpsAccount = new RpsAccount({ ...account, tenantUuid })

  await newRpsAccount.save()

  return newRpsAccount
}

/**
 * Get RPS account
 * @param {*} id
 */
module.exports.getRpsAccount = async id => {
  logger.info(`Getting RPS account: <${id}>`)

  const rpsAccount = await RpsAccount.findById(id)

  return rpsAccount
}

/**
 * Update RPS account
 * @param {*} id
 * @param {*} account
 */
module.exports.updateRpsAccount = async (id, account) => {
  logger.info(`Updating RPS account: <${id}>`)
  logger.debug(JSON.stringify(account))

  await RpsAccount.findByIdAndUpdate(id, account)

  return account
}

/**
 * Delete RPS account
 * @param {*} id
 */
module.exports.deleteRpsAccount = async id => {
  logger.info(`Deleting RPS account: <${id}>`)

  await RpsAccount.findByIdAndDelete(id)

  return true
}
