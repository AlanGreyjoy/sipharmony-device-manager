class ApiError extends Error {
  constructor(status, message, isOp) {
    super(message)
    this.status = status
    this.isOp = isOp
  }
}

module.exports = ApiError
