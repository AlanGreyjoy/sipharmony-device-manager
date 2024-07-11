const axios = require('axios')
const logger = require('../../utils/logger')
const WazoToken = require('../../models/WazoToken')
const fs = require('fs')
const path = require('path')

const version = '0.1'

const isDev = process.env.NODE_ENV === 'development'

const baseUrl = `https://${process.env.WAZO_HOST}/api`

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'User-Agent': `sipharmonyos-device-manager`
}

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers
})

axiosInstance.interceptors.request.use(async config => {
  logger.debug(`Making Wazo ApiProxy.js request to ${baseUrl}${config.url}`)

  const token = await getWazoToken()

  if (token) {
    config.headers['X-Auth-Token'] = token
  }

  logger.debug('Request headers', config.headers)

  return config
})

axiosInstance.interceptors.response.use(
  response => {
    return response
  },

  async error => {
    if (error.response.status === 401) {
      logger.info('Wazo token expired, creating new token...')

      const originalRequest = error.config
      const token = await createToken()

      originalRequest.headers['X-Auth-Token'] = token

      return axiosInstance(originalRequest)
    }

    return Promise.reject(error)
  }
)

async function getWazoToken() {
  logger.info('Getting Wazo token...')

  const token = await WazoToken.findOne()

  if (token) {
    logger.info('Wazo token found in database', token.token)

    return token.token
  }

  return createToken()
}

async function createToken() {
  logger.info('Creating Wazo token...')

  const response = await axios
    .post(
      `${baseUrl}/auth/${version}/token`,
      {},
      {
        auth: {
          username: process.env.WAZO_API_CLIENT_NAME,
          password: process.env.WAZO_API_CLIENT_PASSWORD
        }
      }
    )
    .catch(err => {
      console.log('Error creating token')

      throw err
    })

  logger.info('Wazo token created', response.data.data.token)

  // Create or update token in database
  const token = await WazoToken.findOne()

  if (token) {
    token.token = response.data.data.token
    await token.save()

    return token.token
  }

  const newToken = new WazoToken({
    token: response.data.data.token
  })

  await newToken.save()

  return response.data.data.token
}
/**
 * Get request
 * @param {*} url
 * @param {*} options
 * @returns
 */
module.exports.get = async (url, options) => {
  try {
    const response = await axiosInstance.get(url, options)
    return response.data
  } catch (error) {
    logger.error(error)
    throw error
  }
}

/**
 * Post request
 * @param {*} url
 * @param {*} data
 * @param {*} options
 * @returns
 */
module.exports.post = async (url, data, options) => {
  try {
    const response = await axiosInstance.post(url, data, options)
    return response.data
  } catch (error) {
    logger.error(error.response.data)
    throw error.response.data
  }
}

/**
 * Put request
 * @param {*} url
 * @param {*} data
 * @param {*} options
 * @returns
 */
module.exports.put = async (url, data, options) => {
  try {
    const response = await axiosInstance.put(url, data, options)
    return response.data
  } catch (error) {
    logger.error(error.response.data)
    throw error
  }
}

/**
 * Delete request
 * @param {*} url
 * @param {*} options
 * @returns
 */
module.exports.delete = async (url, options) => {
  try {
    const response = await axiosInstance.delete(url, options)
    return response.data
  } catch (error) {
    logger.error(error.response.data)
    throw error
  }
}
