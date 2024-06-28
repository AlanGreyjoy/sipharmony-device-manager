const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeviceSettingsSchema = new Schema(
  {
    tenantUuid: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: false,
      default: null
    },
    deviceId: {
      type: String,
      required: true
    },
    key: {
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
