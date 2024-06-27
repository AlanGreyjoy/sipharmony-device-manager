const router = require('express').Router({ mergeParams: true })
const auth = require('../../middlewares/auth')
const devicesController = require('../../controllers/devices.controllers')

router.get('/provisioning/:deviceKey/:fileName', devicesController.getFile)

module.exports = router
