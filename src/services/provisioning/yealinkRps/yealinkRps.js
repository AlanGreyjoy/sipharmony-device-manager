const accessKey = process.env.YEALINK_YMCS_ACCESS_KEY
const accessKeySecret = process.env.YEALINK_YMCS_ACCESS_KEY_SECRET

const moment = require('moment')
const crypto = require('crypto')
const CryptoJS = require('crypto-js')
const axios = require('axios')
const logger = require('../../../utils/logger')

const baseUrl = 'https://api-dm.yealink.com:8443'
const client = axios.create({
  baseURL: baseUrl
})

/**
 * Create a server in Yealink RPS
 * @param {*} name
 * @param {*} url
 */
module.exports.createServer = async (name, url) => {
  logger.debug(`[Yealink-RPS] Creating server: ${name} with URL: ${url}`)

  const body = {
    serverName: name,
    url: url
  }

  const bodyMD5 = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(JSON.stringify(body)))

  generateHeadersAndReturnSigString('POST', 'api/open/v1/server/add', bodyMD5)

  return await client
    .post('/api/open/v1/server/add', body)
    .then(res => {
      if (res.data.error) {
        console.log(res.data.error)
        logger.error(`[Yealink-RPS] Failed to create server: ${name}`)

        throw new Error('Failed to create server')
      }

      console.log(res.data)

      return res.data.data
    })
    .catch(err => {
      logger.error(`[Yealink-RPS] Failed to create server: ${name}`)
      console.error(err)

      throw new Error('Failed to create server')
    })
}

/**
 * Delete a server in Yealink RPS
 * @param {*} id
 * @returns
 */
module.exports.deleteServer = async id => {
  logger.debug(`[Yealink-RPS] Deleting server: ${id}`)

  const body = { ids: [id] }
  const bodyMD5 = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(JSON.stringify(body)))

  generateHeadersAndReturnSigString('POST', 'api/open/v1/server/delete', bodyMD5)

  return await client
    .post('/api/open/v1/server/delete', body)
    .then(res => {
      if (res.data.error) {
        console.log(res.data.error)
        logger.error(`[Yealink-RPS] Failed to delete server: ${id}`)

        throw new Error('Failed to delete server')
      }

      console.log(res.data)

      return res.data.data
    })
    .catch(err => {
      logger.error(`[Yealink-RPS] Failed to delete server: ${id}`)
      console.error(err)

      throw new Error('Failed to delete server')
    })
}

/**
 * Create a device in Yealink RPS
 * @param {*} serverId
 * @param {*} mac
 */
module.exports.createDevice = async (serverId, mac) => {
  logger.debug(`[Yealink-RPS] Creating device: ${mac} on server: ${serverId}`)

  const body = {
    macs: [mac],
    serverId: serverId
  }
  const bodyMD5 = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(JSON.stringify(body)))

  generateHeadersAndReturnSigString('POST', 'api/open/v1/device/add', bodyMD5)

  return await client
    .post('/api/open/v1/device/add', body)
    .then(res => {
      if (res.data.error) {
        console.log(res.data.error)
        return { success: false, reason: 'Device was not added. See server logs...' }
      }

      console.log(res.data)
      return true
    })
    .catch(err => {
      console.error(err)

      throw new Error('Failed to add device to Yealink RPS')
    })
}

/**
 * Delete a device in Yealink RPS
 * @param {*} id
 * @returns
 */
module.exports.deleteDevice = async mac => {
  logger.debug(`[Yealink-RPS] Deleting device: ${mac}`)

  //Generate Content MD5
  const body = { macs: [mac] }
  const bodyMD5 = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(JSON.stringify(body)))

  generateHeadersAndReturnSigString('POST', 'api/open/v1/device/delete', bodyMD5)

  return await client.post('/api/open/v1/device/delete', { macs: [mac] }).then(res => {
    if (res.data.error) {
      console.log(res.data.error)

      throw new Error('Failed to delete device')
    }

    logger.debug(`[Yealink-RPS] Device deleted: ${mac}`)
    logger.debug(JSON.stringify(res.data, null, 2))

    return true
  })
}

/**
 * Check if a MAC address is already added to Yealink RPS
 * @param {*} mac
 * @returns
 */
module.exports.checkMac = async mac => {
  logger.debug(`[Yealink-RPS] Checking MAC address: ${mac}`)

  const uuid = crypto.randomUUID().replace(/g-/, '')
  const timestamp = moment.unix(moment.now()).unix()

  let sigString =
    'GET\n' +
    'X-Ca-Key:' +
    accessKey +
    '\n' +
    'X-Ca-Nonce:' +
    uuid +
    '\n' +
    'X-Ca-Timestamp:' +
    timestamp +
    '\n' +
    'api/open/v1/device/checkMac' +
    '\n' +
    `mac=${mac}`

  const hash = CryptoJS.HmacSHA256(sigString, accessKeySecret)
  const hashInB64 = CryptoJS.enc.Base64.stringify(hash)

  client.defaults.headers['X-Ca-Key'] = accessKey
  client.defaults.headers['X-Ca-Nonce'] = uuid
  client.defaults.headers['X-Ca-Timestamp'] = timestamp
  client.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
  client.defaults.headers['X-CA-Signature'] = hashInB64

  return await client
    .get('/api/open/v1/device/checkMac?mac=' + mac)
    .then(res => {
      if (res.data.error) {
        console.log(res.data.error)
        throw new Error('Failed to check MAC address')
      }

      return res.data.data.existed
    })
    .catch(err => {
      console.log(err)
      console.log(err.response.data)
    })
}

module.exports.listDevices = async () => {
  const body = { limit: 5000 }
  const bodyMD5 = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(JSON.stringify(body)))

  generateHeadersAndReturnSigString('POST', '/api/open/v1/device/list', bodyMD5)

  return await client
    .post('/api/open/v1/device/list', { limit: 5000 })
    .then(res => {
      if (res.data.error) {
        console.log(res.data.error)
        return
      }

      return res.data
    })
    .catch(err => {
      console.error(err)
    })
}

/**
 * Generate headers and return signature string
 * @param {*} verb
 * @param {*} url
 * @param {*} bodyMD5
 * @param {*} getParameters
 * @returns
 */
function generateHeadersAndReturnSigString(verb, url, bodyMD5 = null, getParameters = null) {
  const uuid = crypto.randomUUID().replace(/[^\w\s]/gi, '')
  const timestamp = moment.unix(moment.now()).unix()

  client.defaults.headers['X-Ca-Key'] = accessKey
  client.defaults.headers['X-Ca-Nonce'] = uuid
  client.defaults.headers['X-Ca-Timestamp'] = timestamp
  client.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'

  let sigString = ''

  if (verb === 'GET') {
    sigString =
      'GET\n' +
      'X-Ca-Key:' +
      accessKey +
      '\n' +
      'X-Ca-Nonce:' +
      uuid +
      '\n' +
      'X-Ca-Timestamp:' +
      timestamp +
      '\n' +
      `${url}` +
      '\n' +
      `mac=${mac}`
  }

  if (verb === 'POST') {
    sigString =
      'POST\n' +
      'Content-MD5:' +
      bodyMD5 +
      '\n' +
      'X-Ca-Key:' +
      accessKey +
      '\n' +
      'X-Ca-Nonce:' +
      uuid +
      '\n' +
      'X-Ca-Timestamp:' +
      timestamp +
      '\n' +
      `${url}`

    client.defaults.headers['Content-MD5'] = bodyMD5
  }

  const hash = CryptoJS.HmacSHA256(sigString, accessKeySecret)
  client.defaults.headers['X-CA-Signature'] = CryptoJS.enc.Base64.stringify(hash)

  return sigString
}
