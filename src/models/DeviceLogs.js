const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeviceLogsSchema = new Schema(
  {
    deviceId: {
      type: String,
      required: true
    },
    event: {
      type: String,
      default: 'static'
    },
    entry: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('DeviceLogs', DeviceLogsSchema)
