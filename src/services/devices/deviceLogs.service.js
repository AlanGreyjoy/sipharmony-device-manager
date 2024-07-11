const DeviceLogs = require('../../models/DeviceLogs')

/**
 * Add event to device logs
 * @param {*} event { deviceId, event, entry }
 */
module.exports.addEvent = async event => {
  const deviceLogs = new DeviceLogs(event)
  await deviceLogs.save()
}
