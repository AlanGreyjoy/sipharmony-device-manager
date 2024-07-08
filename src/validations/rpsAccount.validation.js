const Joi = require('joi')

const rpsWhitelist = ['yealink']

module.exports = {
  body: Joi.object().keys({
    tenantUuid: Joi.string().required(),
    rpsType: Joi.string()
      .valid(...rpsWhitelist)
      .required(),
    id: Joi.string().allow(null),
    serverName: Joi.string().allow(null),
    url: Joi.string().required()
  })
}
