module.exports = async (req, res, next) => {
  const apiKey = req.headers['x-auth-key']

  if (!apiKey) {
    return res.status(401).send('Unauthorized, missing token')
  }

  //todo: replace and implement your own token validation logic. This is NOT secure nor recommended.
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).send({
      message: 'Unauthorized, invalid api key'
    })
  }

  next()
}
