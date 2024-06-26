const router = require('express').Router({ mergeParams: true })
const devicesController = require('../../controllers/devices.controllers')

router.get('/provisioning/:deviceKey', devicesController.getProvisioning)

module.exports = router
