const Joi = require('joi')

module.exports = {
  body: Joi.object().keys({
    vendor: Joi.string().required(),
    tenantUuid: Joi.string().required(),
    setting: Joi.string().required(),
    value: Joi.string().required()
  })
}
