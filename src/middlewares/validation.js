const Joi = require('joi')
const pick = require('../utils/pick.js')

const validate = schema => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body', 'files'])

  const object = pick(req, Object.keys(validSchema))

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object)

  if (error) {
    const errorMessage = error.details.map(details => details.message).join(', ')

    throw new Error(errorMessage)
  }

  Object.assign(req, value)
  return next()
}

module.exports = validate
