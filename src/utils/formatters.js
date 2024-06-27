/**
 * Remove all non-alphanumeric characters from a MAC address.
 * @param {*} macAddress
 * @returns
 */
module.exports.formatMacAddress = macAddress => {
  return macAddress.replace(/[^a-zA-Z0-9]/g, '')
}
