const router = require('express').Router({ mergeParams: true })

const auth = require('../../middlewares/auth')
const deviceKeysController = require('../../controllers/deviceKeys.controller')

router.post('/', auth, deviceKeysController.createDeviceKey)
router.get('/:tenantUuid', auth, deviceKeysController.getDeviceKey)
router.delete('/:tenantUuid', auth, deviceKeysController.deleteDeviceKey)
router.put('/', auth, deviceKeysController.updateDeviceKey)

module.exports = router
