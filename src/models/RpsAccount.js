const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RpsAccountSchema = new Schema(
  {
    tenantUuid: {
      type: String,
      required: true
    },
    rpsType: {
      type: String,
      required: true
    },
    id: {
      type: String,
      default: null
    },
    serverName: {
      type: String,
      default: null
    },
    url: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('RpsAccount', RpsAccountSchema)
