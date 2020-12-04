const express = require('express')
const router = express.Router()
const codes = require('../utils/codes').CODES
const response = require('../utils/response')
const ctrl = require('../controllers/user')

router.post('/user/change-password', ctrl.changePassword)

router.post('/user/get-info', ctrl.getInfoUser)

router.post('/user/get-images', ctrl.getImages)

module.exports = router