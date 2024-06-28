const router = require('express').Router({ mergeParams: true })
const auth = require('../../middlewares/auth')
const deviceSettingsController = require('../../controllers/deviceSettings.controller')

router.get('/', auth, deviceSettingsController.getDeviceSettings)
router.put('/', auth, deviceSettingsController.updateDeviceSettings)

module.exports = router
