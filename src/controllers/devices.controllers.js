const handlebars = require('handlebars')
const deviceService = require('../services/devices/deviceKey.service')
const userAgentParser = require('../utils/userAgentParser')
const path = require('path')
const fs = require('fs')
const logger = require('../utils/logger')
const wazoService = require('../services/wazo/wazo.service')
const formatters = require('../utils/formatters')

/**
 * Get device files
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.getFile = async (req, res) => {
  const { deviceKey, fileName } = req.params

  if (!deviceKey) {
    logger.error('Device key was not provided!')
    return res.status(400).send({ message: 'Device key is required!' })
  }

  const getDeviceKey = await deviceService.getDeviceKeyByDeviceKey(deviceKey)

  if (!getDeviceKey) {
    logger.error(`Invalid device key: <${deviceKey}> Device key does not exist in the database.`)
    return res.status(403).send({ message: 'Invalid device key!' })
  }

  if (!fileName) {
    logger.error('File name was not provided!')
    return res.status(400).send({ message: 'File name is required!' })
  }

  // Get user agent
  const userAgent = userAgentParser.parse(req.headers['user-agent'])

  if (!userAgent) {
    logger.error('User agent was not provided by the calling device!')
    return res.status(400).send({ message: 'User agent is required!' })
  }

  const file = fileName.split('.')[0]
  const extension = fileName.split('.')[1]

  const commonConfig = await fs.readFileSync(
    path.resolve(__dirname, `../services/templates/yealink/commonConfig.hbs`),
    'utf8'
  )
  const macConfig = await fs.readFileSync(
    path.resolve(__dirname, `../services/templates/yealink/macConfig.hbs`),
    'utf8'
  )

  const commonTemplate = handlebars.compile(commonConfig)
  const macTemplate = handlebars.compile(macConfig)

  // ** MAC CONFIGURATION FILE **
  if (fileName === formatters.formatMacAddress(userAgent.macAddress) + '.cfg') {
    logger.info(`Generating ${fileName} for device with MAC address: ${userAgent.macAddress}`)

    const devices = await wazoService.confd.devices.getDevices(getDeviceKey.tenantUuid)

    if (devices.items.length === 0) {
      logger.error('No devices found in Wazo-Platform!')
      return res
        .status(404)
        .send({ message: 'There were no devices added to your Wazo-Platform instance!' })
    }

    const device = devices.items.find(device => device.mac === userAgent.macAddress)

    if (!device) {
      logger.error('Device not found in Wazo-Platform!')
      return res.status(404).send({ message: 'Device not found in Wazo-Platform!' })
    }

    const lines = await wazoService.confd.lines.getLines(getDeviceKey.tenantUuid)

    if (lines.items.length === 0) {
      logger.error('No lines found in Wazo-Platform!')
      return res
        .status(404)
        .send({ message: 'There were no lines added to your Wazo-Platform instance!' })
    }

    const userOptions = {}

    /**
     * HUGE TODO: Refactor and code split. This is just a quick and dirty implementation to get the POC completed.
     */

    if (lines.items.length > 0) {
      for (const line of lines.items) {
        if (line.users.length === 0) continue

        if (line.device_id) {
          const getDevice = await wazoService.confd.devices.getDevice(
            getDeviceKey.tenantUuid,
            line.device_id
          )

          if (getDevice.mac !== userAgent.macAddress) {
            continue
          }

          const mainEndpoint = await wazoService.confd.endpoints.getSipEndpoint(
            getDeviceKey.tenantUuid,
            line.endpoint_sip.uuid
          )

          console.log('mainEndpoint', mainEndpoint)

          const transport = await wazoService.confd.transports.getTransport(
            getDeviceKey.tenantUuid,
            mainEndpoint.transport.uuid
          )

          const getTransport = () => {
            for (const option of transport.options) {
              if (option[0] === 'protocol') {
                return option[1]
              }
            }
            return null
          }

          const getSipUsername = () => {
            for (const option of mainEndpoint.auth_section_options) {
              if (option[0] === 'username') {
                return option[1]
              }
            }

            return null
          }

          const getSipPassword = () => {
            for (const option of mainEndpoint.auth_section_options) {
              if (option[0] === 'password') {
                return option[1]
              }
            }

            return null
          }

          const getSipServerPort = userOptions => {
            const transport = userOptions.sipTransport

            if (transport === 'tls') return 5061
            if (transport === 'tcp') return 5061

            return 5060
          }

          const user = await wazoService.confd.users.getUser(
            getDeviceKey.tenantUuid,
            line.users[0].uuid
          )

          userOptions.enable = true
          userOptions.sipUserName = getSipUsername()
          userOptions.sipPassword = getSipPassword()
          userOptions.sipTransport = getTransport()
          userOptions.sipServer = process.env.SIP_SERVER_HOST
          userOptions.sipServerPort = getSipServerPort(userOptions)

          const macConfig = macTemplate({
            accounts: [
              {
                id: 1,
                enable: 1,
                label: `${user.firstname} ${user.lastname || ''}`,
                display_name: `${user.firstname} ${user.lastname || ''}`,
                auth_name: userOptions.sipUserName,
                user_name: userOptions.sipUserName,
                password: userOptions.sipPassword,
                server_address: userOptions.sipServer,
                sip_port: userOptions.sipServerPort,
                sip_transport:
                  userOptions.sipTransport === 'tls'
                    ? '2'
                    : userOptions.sipTransport === 'tcp'
                      ? '1'
                      : '0',
                register_expires: userOptions.sipTransport === 'tls' ? 120 : 60,
                retry_counts: 5,
                yealink_srtp_encryption: userOptions.sipTransport === 'tls' ? '1' : '0'
              }
            ]
          })

          const buffer = Buffer.from(macConfig, 'utf8')

          res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file}.${extension}"`,
            'Content-Length': buffer.length
          })

          // Send the buffer
          return res.send(buffer)
        }
      }
    }
  }

  // ** COMMON CONFIGURATION FILE **
  if (fileName === 'y000000000066.cfg') {
    logger.info(`Generating ${fileName} for device with MAC address: ${userAgent.macAddress}`)

    const commonConfig = commonTemplate({
      yealink_dhcp_time: 1,
      yealink_time_format: 0,
      yealink_date_format: 4,
      yealink_summer_time: 1,
      yealink_time_zone: -6
    })

    const buffer = Buffer.from(commonConfig, 'utf8')

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file}.${extension}"`,
      'Content-Length': buffer.length
    })

    // Send the buffer
    return res.send(buffer)
  }

  return res.status(404).send({ message: '' })
}
