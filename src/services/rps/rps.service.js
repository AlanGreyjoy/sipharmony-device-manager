const logger = require('../../utils/logger')
const RpsAccount = require('../../models/RpsAccount')

/**
 * Get RPS accounts
 * @param {*} query
 * @returns
 */
module.exports.getRpsAccounts = async query => {
  logger.info('Getting RPS accounts')
  logger.debug(JSON.stringify(query))

  const searchParams = {}

  if (query.tenantUuid) {
    searchParams.tenantUuid = query.tenantUuid
  }

  if (query.rpsType) {
    searchParams.rpsType = query.rpsType
  }

  const rpsAccounts = await RpsAccount.find(searchParams)

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
