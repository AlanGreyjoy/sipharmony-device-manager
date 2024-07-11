const Joi = require('joi')

module.exports.create = {
  body: Joi.object().keys({
    _id: Joi.string().allow(null),
    tenantUuid: Joi.string().required(),
    macAddress: Joi.string().required(),
    vendor: Joi.string().required(),
    nickname: Joi.string().allow(null),
    description: Joi.string().allow(null),
    location: Joi.string().allow(null),
    room: Joi.string().allow(null),
    firmware: Joi.string().allow(null)
  })
}

module.exports.getDevices = {
  params: Joi.object().keys({
    tenantUuid: Joi.string().required()
  })
}

module.exports.provisioning = {
  params: Joi.object().keys({
    deviceKey: Joi.string().required(),
    fileName: Joi.string().required()
  })
}

module.exports.assign = {
  body: Joi.object().keys({
    tenantUuid: Joi.string().required(),
    userUuid: Joi.string().required(),
    transport: Joi.string().optional().allow(null),
    port: Joi.number().optional().allow(null),
    expires: Joi.number().optional().allow(null),
    _id: Joi.string().required(),
    vendor: Joi.string().required(),
    model: Joi.string().optional().allow(null),
    macAddress: Joi.string().required(),
    rpsBound: Joi.boolean().required(),
    description: Joi.string().optional().allow(null),
    location: Joi.string().optional().allow(null),
    room: Joi.string().optional().allow(null),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
    __v: Joi.number().required(),
    firmware: Joi.string().optional().allow(null),
    endpoint: Joi.string().optional().allow(null),
    status: Joi.string().optional().allow(null),
    lastSeen: Joi.date().optional().allow(null),
    rtt: Joi.number().optional().allow(null)
  })
}

module.exports.unassign = {
  params: Joi.object().keys({
    mac: Joi.string().required()
  })
}
