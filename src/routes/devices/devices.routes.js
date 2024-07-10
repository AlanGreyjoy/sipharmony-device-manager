const router = require('express').Router({ mergeParams: true })
const devicesController = require('../../controllers/devices.controllers')
const auth = require('../../middlewares/auth')
const validation = require('../../middlewares/validation')
const deviceValidation = require('../../validations/device.validation')

/**
 * Get provisioning files for a device
 * @description Keeping the original route path from Wazo-Platform
 */
router.get(
  '/provisioning/:deviceKey/:fileName',
  validation(deviceValidation.provisioning),
  devicesController.getFile
)

router.post('/', auth, validation(deviceValidation.create), devicesController.createDevice)
router.post('/assign', auth, validation(deviceValidation.assign), devicesController.assignDevice)
router.delete(
  '/unassign/:mac',
  auth,
  validation(deviceValidation.unassign),
  devicesController.unassignDevice
)

router.get(
  '/:tenantUuid',
  auth,
  validation(deviceValidation.getDevices),
  devicesController.getDevices
)

router.get('/:id', auth, devicesController.getDevice)
router.put('/:id', auth, devicesController.updateDevice)
router.delete('/:id', auth, devicesController.deleteDevice)

module.exports = router
