const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Vendor - The vendor of the device
 * Model - The model of the device, auto decided by mac address
 */

const DeviceSchema = new Schema(
  {
    tenantUuid: {
      type: String,
      required: true
    },
    vendor: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    mac: {
      type: String,
      required: true
    },
    rpsBound: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: null
    },
    location: {
      type: String,
      default: null
    },
    room: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Device', DeviceSchema)
