const router = require('express').Router({ mergeParams: true })
const rpsController = require('../../controllers/rps.controller')
const auth = require('../../middlewares/auth')

const validation = require('../../middlewares/validation')
const rpsAccountValidation = require('../../validations/rpsAccount.validation')

router.post('/', auth, rpsController.action)

router.get('/accounts', auth, rpsController.getRpsAccounts)
router.post('/accounts', auth, validation(rpsAccountValidation), rpsController.addRpsAccount)

module.exports = router
