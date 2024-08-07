const logger = require('../../utils/logger')
const RpsAccount = require('../../models/RpsAccount')
const yealinkRps = require('../provisioning/yealinkRps/yealinkRps')

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

  logger.debug('Search params:')
  logger.debug(JSON.stringify(searchParams, null, 2))

  const rpsAccounts = await RpsAccount.find({
    ...searchParams
  })

  logger.debug(JSON.stringify(rpsAccounts, null, 2))

  return rpsAccounts
}

/**
 * Add RPS account
 * @param {*} tenantUuid
 * @param {*} account
 */
module.exports.addRpsAccount = async (tenantUuid, account) => {
  logger.info(`Adding RPS account for tenant: <${tenantUuid}>`)

  switch (account.rpsType) {
    case 'yealink':
      logger.info('Adding Yealink RPS account')

      const yealinkRpsServer = await yealinkRps.createServer(account.serverName, account.url)

      const newRpsAccount = new RpsAccount({
        tenantUuid,
        rpsType: account.rpsType,
        serverName: account.serverName,
        url: account.url,
        id: yealinkRpsServer.id
      })

      await newRpsAccount.save()

      return newRpsAccount

    default:
      throw new Error('Invalid rpsType')
  }
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

  const rpsAccount = await RpsAccount.findById(id)

  if (!rpsAccount) {
    throw new Error('RPS account not found')
  }

  await RpsAccount.findByIdAndDelete(id)

  await yealinkRps.deleteServer(rpsAccount.id)

  return true
}

/**
 * Add device to RPS
 * @param {*} args - { serverId }
 * @param {*} device
 */
module.exports.addDeviceToRps = async (args, device) => {
  const vendor = device.vendor

  switch (vendor) {
    case 'yealink':
      await yealinkRps.createDevice(args.serverId, device.macAddress)
      break
    default:
      throw new Error('Unsupported vendor. Cannot add device to an RPS server')
  }
}

/**
 * Delete device from RPS
 * @param {*} args
 * @param {*} device
 */
module.exports.deleteDeviceFromRps = async (args, device) => {}
