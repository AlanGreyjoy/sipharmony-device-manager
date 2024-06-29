const router = require('express').Router({ mergeParams: true })
const auth = require('../../middlewares/auth')
const validation = require('../../middlewares/validation')
const deviceSettings = require('../../validations/deviceSetting.validation')
const deviceSettingsController = require('../../controllers/deviceSettings.controller')

router.get('/', auth, deviceSettingsController.getDeviceSettings)
router.put('/', auth, validation(deviceSettings), deviceSettingsController.updateDeviceSettings)

module.exports = router
