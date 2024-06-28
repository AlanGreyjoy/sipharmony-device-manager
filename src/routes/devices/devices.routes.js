const router = require('express').Router({ mergeParams: true })
const devicesController = require('../../controllers/devices.controllers')

/**
 * Get provisioning files for a device
 * @description Keeping the original route path from Wazo-Platform
 */
router.get('/provisioning/:deviceKey/:fileName', devicesController.getFile)

module.exports = router
