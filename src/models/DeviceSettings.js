const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeviceSettingsSchema = new Schema(
  {
    tenantUuid: {
      type: String,
      required: true
    },
    vendor: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      default: null
    },
    deviceId: {
      type: String,
      default: null
    },
    setting: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('DeviceSettings', DeviceSettingsSchema)
