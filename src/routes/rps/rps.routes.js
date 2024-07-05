const router = require('express').Router({ mergeParams: true })
const rpsController = require('../../controllers/rps.controller')
const auth = require('../../middlewares/auth')

router.post('/', auth, rpsController.action)

module.exports = router
