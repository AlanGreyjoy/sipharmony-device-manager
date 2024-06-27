const mongoose = require('mongoose')

module.exports.connect = async () => {
  return main()
}

async function main() {
  await mongoose.connect(process.env.MONGO_SRV)
}
