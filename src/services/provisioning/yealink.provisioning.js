const fs = require('fs')
const path = require('path')
const formatters = require('../../utils/formatters')
const logger = require('../../utils/logger')
const wazoService = require('../wazo/wazo.service')
const handlebars = require('handlebars')

/**
 * Provision Yealink device
 * @param {*} device
 * @param {*} requestedFile
 * @param {*} tenantUuid
 * @returns
 */
module.exports = async (device, requestedFile, tenantUuid) => {
  if (requestedFile === 'y000000000066.cfg') {
    return generateCommonConfig(requestedFile, device)
  }

  if (requestedFile === formatters.formatMacAddress(device.macAddress) + '.cfg') {
    return generateMacConfig(requestedFile, device, tenantUuid)
  }

  if (requestedFile === 'y000000000000.cfg') {
    return generateCommonBoot(formatters.formatMacAddress(device.macAddress))
  }

  if (requestedFile === formatters.formatMacAddress(device.macAddress) + '.boot') {
    return generateMacBoot(formatters.formatMacAddress(device.macAddress))
  }

  return null
}

/**
 *
 * @param {*} mac
 * @returns
 */
async function generateCommonBoot(mac) {
  logger.info(`Generating common boot file for Yealink devices`)

  const commonBoot = await fs.readFileSync(
    path.resolve(__dirname, `../../services/templates/yealink/commonBoot.hbs`),
    'utf8'
  )

  const commonTemplate = handlebars.compile(commonBoot)

  const generatedBoot = commonTemplate({
    mac: mac
  })

  const buffer = Buffer.from(generatedBoot, 'utf8')

  return buffer
}

/**
 * Generate MAC boot file for Yealink devices
 * @param {*} mac
 * @returns
 */
async function generateMacBoot(mac) {
  logger.info(`Generating MAC boot file for Yealink devices`)

  const macBoot = await fs.readFileSync(
    path.resolve(__dirname, `../../services/templates/yealink/macBoot.hbs`),
    'utf8'
  )

  const macTemplate = handlebars.compile(macBoot)

  const generatedBoot = macTemplate({
    mac: mac
  })

  const buffer = Buffer.from(generatedBoot, 'utf8')

  return buffer
}

/**
 * Generate common configuration file for Yealink devices
 * @param {*} requestedFile
 * @param {*} device
 * @returns
 */
async function generateCommonConfig(requestedFile, device) {
  logger.info(`Generating ${requestedFile} for device with MAC address: ${device.macAddress}`)

  const commonConfig = await fs.readFileSync(
    path.resolve(__dirname, `../../services/templates/yealink/commonConfig.hbs`),
    'utf8'
  )

  const commonTemplate = handlebars.compile(commonConfig)

  const generatedConfig = commonTemplate({
    yealink_dhcp_time: 1,
    yealink_time_format: 0,
    yealink_date_format: 4,
    yealink_summer_time: 1,
    yealink_time_zone: -6
  })

  const buffer = Buffer.from(generatedConfig, 'utf8')

  return buffer
}

/**
 * Generate MAC configuration file for Yealink devices
 * @param {*} requestedFile
 * @param {*} device
 * @param {*} tenantUuid
 * @returns
 */
async function generateMacConfig(requestedFile, device, tenantUuid) {
  logger.info(`Generating ${requestedFile} for device with MAC address: ${device.macAddress}`)

  const macConfig = await fs.readFileSync(
    path.resolve(__dirname, `../../services/templates/yealink/macConfig.hbs`),
    'utf8'
  )

  const macTemplate = handlebars.compile(macConfig)

  const devices = await wazoService.confd.devices.getDevices(tenantUuid)

  if (devices.items.length === 0) {
    logger.error('No devices found in Wazo-Platform!')
    throw new Error('No devices found in Wazo-Platform!')
  }

  const wazoDevice = devices.items.find(d => d.mac === device.macAddress)

  if (!wazoDevice) {
    logger.error('Device not found in Wazo-Platform!')
    throw new Error('Device not found in Wazo-Platform!')
  }

  const lines = await wazoService.confd.lines.getLines(tenantUuid)

  if (lines.items.length === 0) {
    logger.error('No lines found in Wazo-Platform!')
    throw new Error('No lines found in Wazo-Platform!')
  }

  const userOptions = {}

  /**
   * HUGE TODO: Refactor and code split. This is just a quick and dirty implementation to get the POC completed.
   */

  if (lines.items.length > 0) {
    for (const line of lines.items) {
      if (line.users.length === 0) continue

      if (line.device_id) {
        const getDevice = await wazoService.confd.devices.getDevice(tenantUuid, line.device_id)

        if (getDevice.mac !== device.macAddress) {
          continue
        }

        const mainEndpoint = await wazoService.confd.endpoints.getSipEndpoint(
          tenantUuid,
          line.endpoint_sip.uuid
        )

        console.log('mainEndpoint', mainEndpoint)

        const transport = await wazoService.confd.transports.getTransport(
          tenantUuid,
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

        const user = await wazoService.confd.users.getUser(tenantUuid, line.users[0].uuid)

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

        return buffer
      }
    }
  }
}
