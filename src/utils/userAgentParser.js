const formatters = require('./formatters')

/**
 * Parses the user agent string to extract the vendor, device model, firmware version, and mac address
 * @param {*} userAgent
 * @returns
 */
module.exports.parse = userAgent => {
  // yealink example: Yealink SIP-T46S 66.86.0.160 00:15:65:bd:56:d4
  // regex to extract the vendor, device model, firmware version, and mac address
  const yealinkRegex =
    /^(Yealink)\s(.+?)\s(\d+\.\d+\.\d+\.\d+)\s((?:[0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2})$/i
  const yealinkMatch = userAgent.match(yealinkRegex)

  if (yealinkMatch) {
    return {
      vendor: yealinkMatch[1],
      deviceModel: yealinkMatch[2],
      firmwareVersion: yealinkMatch[3],
      macAddress: yealinkMatch[4]?.toUpperCase()
    }
  }

  //todo: add more device parsers here

  return null
}
