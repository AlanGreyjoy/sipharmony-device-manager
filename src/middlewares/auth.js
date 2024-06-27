module.exports = async (req, res, next) => {
  const token = req.headers['x-auth-token']

  if (!token) {
    return res.status(401).send('Unauthorized, missing token')
  }

  next()
}
