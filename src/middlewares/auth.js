module.exports = async (req, res, next) => {
  const token = req.headers['x-auth-token']

  if (!token) {
    return res.status(401).send('Unauthorized, missing token')
  }

  //todo: replace and implement your own token validation logic. This is NOT secure nor recommended.
  if (token !== process.env.API_TOKEN) {
    return res.status(401).send({
      message: 'Unauthorized, invalid token'
    })
  }

  next()
}
