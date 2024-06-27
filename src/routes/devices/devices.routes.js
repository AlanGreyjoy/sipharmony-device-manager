const router = require('express').Router({ mergeParams: true })
const devicesController = require('../../controllers/devices.controllers')

router.get('/provisioning/:deviceKey/:fileName', devicesController.getFile)

module.exports = router
