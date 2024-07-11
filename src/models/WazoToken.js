const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WazoTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('WazoToken', WazoTokenSchema)
