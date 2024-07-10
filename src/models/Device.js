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
    userUuid: {
      type: String,
      default: null
    },
    vendor: {
      type: String,
      required: true
    },
    model: {
      type: String,
      default: null
    },
    macAddress: {
      type: String,
      required: true
    },
    firmware: {
      type: String,
      default: null
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
    },
    transport: {
      type: String,
      default: 'tls'
    },
    port: {
      type: Number,
      default: '5061'
    },
    expires: {
      type: Number,
      default: '3600'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Device', DeviceSchema)
