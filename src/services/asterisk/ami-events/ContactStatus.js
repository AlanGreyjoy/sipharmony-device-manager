const logger = require('../../../utils/logger')
const AmiCommands = require('../../asterisk/commands/AmiCommands')
const deviceLogsService = require('../../devices/deviceLogs.service')
const deviceService = require('../../devices/device.service')

module.exports = async (ami, event) => {
  logger.info('ContactStatus event received')
  logger.info(JSON.stringify(event, null, 2))

  const uri = event.uri
  const contactStatus = event.contactstatus
  const device = event.endpointname
  const rtt = event.roundtripusec

  const parameters = await AmiCommands.pjSip.showEndpoint(ami, device)

  const registration = await AmiCommands.database.showEndpointRegistration(ami, event.endpointname)

  const tenantUuid = parameters['__WAZO_TENANT_UUID']
  const userUuid = parameters['XIVO_USERUUID']
  const userId = parameters['XIVO_USERID']
  const transport = parameters['transport']

  if (!tenantUuid || !userUuid || !userId || !transport) {
    logger.error('Missing parameters to save device status')
    logger.error(
      `Parameter missing: ${!tenantUuid ? 'tenantUuid' : ''} ${!userUuid ? 'userUuid' : ''} ${!userId ? 'userId' : ''} ${!transport ? 'transport' : ''}`
    )
    return
  }

  const deviceInfo = {
    uri,
    contactStatus,
    device,
    rtt,
    userUuid,
    userId,
    transport
  }

  const getDevice = await deviceService.getDeviceByUserUuid(userUuid)

  if (!getDevice) return

  if (transport === 'transport-wss') return

  deviceLogsService.addEvent({
    deviceId: getDevice._id,
    event: 'registration.status',
    entry: deviceInfo
  })

  if (contactStatus === 'Reachable') {
    deviceService.updateDevice(getDevice._id, { status: 'online', lastSeen: new Date(), rtt })
  }
}
