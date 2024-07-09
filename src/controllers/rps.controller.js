const rpsService = require('../services/rps/rps.service')

module.exports.action = async (req, res) => {}

/**
 * Get RPS accounts
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.getRpsAccounts = async (req, res) => {
  const rpsAccounts = await rpsService.getRpsAccounts(req.query)

  if (!rpsAccounts) {
    return res.status(404).send({ message: 'No RPS accounts found!' })
  }

  return res.status(200).json(rpsAccounts)
}

/**
 * Add RPS account
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.addRpsAccount = async (req, res) => {
  const account = req.body

  const newRpsAccount = await rpsService.addRpsAccount(account.tenantUuid, account)

  return res.status(201).json(newRpsAccount)
}

/**
 * Get RPS account
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.getRpsAccount = async (req, res) => {
  const { id } = req.params

  const rpsAccount = await rpsService.getRpsAccount(id)

  if (!rpsAccount) {
    return res.status(404).send({ message: 'RPS account not found!' })
  }

  return res.status(200).json(rpsAccount)
}

/**
 * Update RPS account
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.updateRpsAccount = async (req, res) => {
  const { id } = req.params
  const { account } = req.body

  const updatedRpsAccount = await rpsService.updateRpsAccount(id, account)

  return res.status(200).json(updatedRpsAccount)
}

/**
 * Delete RPS account
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.deleteRpsAccount = async (req, res) => {
  const { id } = req.params

  await rpsService.deleteRpsAccount(id)

  return res.status(204).send()
}
