/**
 * Get device provisioning
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.getProvisioning = async (req, res) => {
  const { deviceKey } = req.params

  if (!deviceKey) {
    return res.status(400).send({ message: 'Device key is required!' })
  }

  return res.status(200).send({ message: 'GET /provisioning' })
}
