const express   = require('express')
const router    = express.Router()
const ctrl      = require('../controllers/image')


router.post('/image/upload', ctrl.uploadImage)

router.post('/image/download', ctrl.downloadImage)

router.post('/image/get-info-id', ctrl.getImageById)

router.post('/image/get-info-name', ctrl.getImageByName)

router.post('/image/delete', ctrl.deleteImage)

module.exports = router