const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/authentication')

router.post('/login', ctrl.login)

router.post('/logout', ctrl.logout)

router.post('/register', ctrl.register)

router.post('/authenticate', ctrl.authenticate)

module.exports = router