const fs = require('fs')
const path = require('path')
const formatters = require('../../utils/formatters')
const logger = require('../../utils/logger')
const wazoService = require('../wazo/wazo.service')
const handlebars = require('handlebars')
const deviceService = require('../devices/device.service')
const rpsService = require('../rps/rps.service')
const deviceSettingsService = require('../devices/deviceSettings.service')

/**
 * Provision Yealink device
 * @param {*} device
 * @param {*} requestedFile
 * @param {*} tenantUuid
 * @returns
 */
module.exports = async (device, requestedFile, tenantUuid) => {
  logger.info(`Provisioning Yealink device with MAC address: ${device.macAddress}`)

  if (requestedFile === 'y000000000066.cfg') {
    return generateCommonConfig(requestedFile, device)
  }

  console.log(device)
  console.log(requestedFile)

  if (
    requestedFile.toLowerCase() ===
    formatters.formatMacAddress(device.macAddress).toLowerCase() + '.cfg'
  ) {
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

  console.log('device', device)

  const commonConfig = await fs.readFileSync(
    path.resolve(__dirname, `../../services/templates/yealink/commonConfig.hbs`),
    'utf8'
  )

  const commonTemplate = handlebars.compile(commonConfig)

  const getDevice = await deviceService.getDeviceByMac(device.macAddress)

  const templateOptions = {
    yealink_dhcp_time: 1,
    yealink_time_format: 0,
    yealink_date_format: 4,
    yealink_summer_time: 1,
    yealink_time_zone: -6
  }

  if (getDevice) {
    if (getDevice.rpsBound) {
      const rpsAccounts = await rpsService.getRpsAccounts({
        tenantUuid: getDevice.tenantUuid,
        rpsType: 'yealink'
      })

      console.log('rpsAccounts', rpsAccounts)

      if (rpsAccounts.length > 0) {
        const rpsAccount = rpsAccounts[0]
        templateOptions.yealink_provision_url = rpsAccount.url
      }
    }

    const deviceSettings = await deviceSettingsService.getDeviceSettings(
      'yealink',
      getDevice.tenantUuid
    )

    console.log('deviceSettings', deviceSettings)

    for (const setting of deviceSettings) {
      if (setting.deviceId) continue
      if (setting.userId) continue

      templateOptions[setting.setting] = setting.value
    }
  }

  const generatedConfig = commonTemplate({
    ...templateOptions
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
  console.log('device', device)

  const macConfig = await fs.readFileSync(
    path.resolve(__dirname, `../../services/templates/yealink/macConfig.hbs`),
    'utf8'
  )

  const macTemplate = handlebars.compile(macConfig)

  const getDevice = await deviceService.getDeviceByMac(device.macAddress)

  console.log('getDevice', getDevice)

  if (!getDevice) {
    logger.error(`Device with MAC address: ${device.macAddress} not found!`)

    throw new Error(`Device with MAC address: ${device.macAddress} not found!`)
  }

  if (!getDevice.tenantUuid) {
    logger.error(`Tenant UUID not found for device with MAC address: ${device.macAddress}`)

    throw new Error(`Tenant UUID not found for device with MAC address: ${device.macAddress}`)
  }

  if (!getDevice.userUuid) {
    logger.error(`User UUID not found for device with MAC address: ${device.macAddress}`)

    throw new Error(`User UUID not found for device with MAC address: ${device.macAddress}`)
  }

  const lines = await wazoService.confd.lines.getLines(tenantUuid)

  if (lines.items.length === 0) {
    logger.error('No lines found in Wazo-Platform!')

    throw new Error('No lines found in Wazo-Platform!')
  }

  const userOptions = {}

  if (lines.items.length > 0) {
    for (const line of lines.items) {
      if (line.users.length === 0) continue
      if (!line.users.find(user => user.uuid === getDevice.userUuid)) continue

      const user = line.users.find(user => user.uuid === getDevice.userUuid)

      console.log('user', user)

      if (!user) continue

      const sipEndpoint = await wazoService.confd.lines.getSipEndpointOfMainLineForAUser(
        tenantUuid,
        user.uuid
      )

      if (!sipEndpoint) continue

      console.log('sipEndpoint', sipEndpoint)

      const sipUser = sipEndpoint.auth_section_options[0][1]
      const sipPassword = sipEndpoint.auth_section_options[1][1]

      if (!sipUser || !sipPassword) continue

      userOptions.user = { ...user }
      userOptions.callerId = sipEndpoint.endpoint_section_options[0][1]
      userOptions.sipUser = sipUser
      userOptions.sipPassword = sipPassword
    }
  }

  const generatedConfig = macTemplate({
    accounts: [
      {
        id: 1,
        enable: true,
        label: `${userOptions.user.firstname} ${userOptions.user.lastname || ''}`, // Label is the LCD screen
        display_name: userOptions.callerId, // Display name is the caller ID
        auth_name: userOptions.sipUser,
        user_name: userOptions.sipUser,
        password: userOptions.sipPassword,
        server_address: `devices.sipharmony.com`,
        sip_port: getDevice.port,
        sip_transport: getDevice.transport === 'udp' ? 0 : device.transport === 'tcp' ? 1 : 2,
        register_expires: getDevice.transport === 'udp' ? 60 : 120,
        retry_counts: 3,
        yealink_srtp_encryption: 2
      }
    ]
  })

  const buffer = Buffer.from(generatedConfig, 'utf8')

  //Update device with model information
  await deviceService.updateDeviceModelAndFirmware(
    getDevice._id,
    device.deviceModel,
    device.firmwareVersion
  )

  return buffer
}
