//Node Express Error Handler

const errorHandler = (err, req, res, next) => {
  //Return error response with status code and message
  console.error(err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
}

module.exports = errorHandler
