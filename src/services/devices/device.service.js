const logger = require('../../utils/logger')
const Device = require('../../models/Device')

/**
 * Create a new device
 * @param {*} device
 */
module.exports.createDevice = async device => {
  return await Device.create(device)
}

/**
 * Get a device by ID
 * @param {*} id
 */
module.exports.getDevice = async id => {}

/**
 * Get a device by MAC address
 * @param {*} mac
 * @returns
 */
module.exports.getDeviceByMac = async mac => {
  return await Device.findOne({
    macAddress: mac
  })
}

/**
 * Get devices
 * @param {*} query
 */
module.exports.getDevices = async query => {
  return await Device.find(query)
}

/**
 * Update a device
 * @param {*} id
 * @param {*} device
 */
module.exports.updateDevice = async (id, device) => {
  return await Device.findByIdAndUpdate(id, device, {
    new: true
  })
}

/**
 * Assign a device to a user
 * @param {*} userUuid
 * @param {*} id
 * @returns
 */
module.exports.assignDevice = async (userUuid, id) => {
  return await Device.findByIdAndUpdate(
    id,
    {
      userUuid
    },
    {
      new: true
    }
  )
}

/**
 * Unassign a device from a user
 * @param {*} id
 */
module.exports.unassignDevice = async id => {
  return await Device.findByIdAndUpdate(
    id,
    {
      userUuid: null
    },
    {
      new: true
    }
  )
}

/**
 * Update a devices model and firmware
 * @param {*} id
 * @param {*} model
 * @param {*} firmware
 * @returns {Promise<*>}
 */
module.exports.updateDeviceModelAndFirmware = async (id, model, firmware) => {
  return await Device.findByIdAndUpdate(
    id,
    {
      model,
      firmware
    },
    {
      new: true
    }
  )
}

/**
 * Update a devices model
 * @param {*} id
 * @param {*} model
 * @returns
 */
module.exports.updateModel = async (id, model) => {
  return await Device.findByIdAndUpdate(
    id,
    {
      model
    },
    {
      new: true
    }
  )
}

/**
 * Update a devices firmware
 * @param {*} id
 * @param {*} firmware
 * @returns
 */
module.exports.updateFirmware = async (id, firmware) => {
  return await Device.findByIdAndUpdate(
    id,
    {
      firmware
    },
    {
      new: true
    }
  )
}

/**
 * Delete a device
 * @param {*} id
 */
module.exports.deleteDevice = async id => {}

/**
 * Get a device by endpoint
 * @param {*} endpoint
 * @returns
 */
module.exports.getDeviceByEndpoint = async endpoint => {
  return await Device.findOne({
    endpoint
  })
}

/**
 * Get a device by user UUID
 * @param {*} userUuid
 * @returns
 */
module.exports.getDeviceByUserUuid = async userUuid => {
  return await Device.findOne({
    userUuid
  })
}
