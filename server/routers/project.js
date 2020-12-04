const express   = require('express')
const router    = express.Router()
const ctrl      = require('../controllers/project')

router.post('/project/create', ctrl.createProject)

router.post('/project/edit', ctrl.editProject)

router.post('/project/delete', ctrl.deleteProject)

router.post('/project/get-info', ctrl.getInfoProject)

router.post('/project/get-list', ctrl.getListProject)

module.exports = router