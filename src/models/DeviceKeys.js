const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeviceKeysSchema = new Schema(
  {
    tenantUuid: {
      type: String,
      required: true
    },
    deviceKey: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('DeviceKeys', DeviceKeysSchema)
