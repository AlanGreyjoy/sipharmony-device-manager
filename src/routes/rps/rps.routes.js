const router = require('express').Router({ mergeParams: true })
const rpsController = require('../../controllers/rps.controller')
const auth = require('../../middlewares/auth')

const validation = require('../../middlewares/validation')
const rpsAccountValidation = require('../../validations/rpsAccount.validation')

router.post('/', auth, rpsController.action)

router.get('/accounts', auth, rpsController.getRpsAccounts)
router.post('/accounts', auth, validation(rpsAccountValidation), rpsController.addRpsAccount)
router.get('/accounts/:id', auth, rpsController.getRpsAccount)
router.put('/accounts/:id', auth, validation(rpsAccountValidation), rpsController.updateRpsAccount)
router.delete('/accounts/:id', auth, rpsController.deleteRpsAccount)

module.exports = router
