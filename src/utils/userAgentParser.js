const formatters = require('./formatters')

/**
 * Parses the user agent string to extract the device model, firmware version, and mac address
 * @param {*} userAgent
 * @returns
 */
module.exports.parse = userAgent => {
  // yealink example: <Yealink SIP-T46S 66.86.0.160 00:15:65:bd:56:d4>
  // regex to extract the device model, firmware version, and mac address
  const yealinkRegex = /Yealink\s(.+)\s(.+)\s(.+)/i
  const yealinkMatch = userAgent.match(yealinkRegex)

  if (yealinkMatch) {
    return {
      deviceModel: yealinkMatch[1],
      firmwareVersion: yealinkMatch[2],
      macAddress: formatters.formatMacAddress(yealinkMatch[3])
    }
  }

  //todo: add more device parsers here

  return null
}
