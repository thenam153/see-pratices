const { Project }     = require('../models')
const { CODES } = require('../utils/codes')
const response = require('../utils/response')

function createProject(req, res) {
    const data = {
        idUser: req.decodeUser.idUser,
        projectName: req.body.projectName,
        projectInfo: req.body.projectInfo
    }

    Project.findOne({
        where: {
            projectName: data.projectName,
            idUser: data.idUser
        }
    })
    .then(project => {
        if(!project) {
            Project.create(data)
            .then(_project => {
                res.send(
                    response(CODES.SUCCESS, 'CREATE PROJECT SUCCESS', _project)
                )
            })
        }else {
            res.send(
                response(CODES.INTERNAL_SERVER_ERROR, 'PROJECT EXISTED')
            )
        }
    })
}

function editProject(req, res) {
    const data = {
        idUser: req.decodeUser.idUser,
        idProject: req.body.idProject,
        projectInfo: req.body.projectInfo,
        projectName:  req.body.projectName
    }

    Project.findOne({
        where: {
            idProject: data.idProject
        }
    })
    .then(project => {
        if(project) {
            project.update(data)
            .then(_project => {
                res.send(
                    response(CODES.SUCCESS, 'EDIT PROJECT SUCCESS', _project)
                )
            })
            .catch(_error => {
                res.send(
                    response(CODES.INTERNAL_SERVER_ERROR, 'EDIT PROJECT FAILED')
                )
            })
        }else {
            res.send(
                response(CODES.INTERNAL_SERVER_ERROR, 'PROJECT NOT EXISTED')
            )
        }
    })
}

function deleteProject(req, res) {
    const data = {
        idUser: req.decodeUser.idUser,
        idProject: req.body.idProject
    }

    Project.findOne({
        where: data
    })
    .then(project => {
        if(project) {
            project.destroy()
            .then(_result => {
                res.send(
                    response(CODES.SUCCESS, 'DELETE PROJECT SUCCESS', _result)
                )
            })
            .catch(_error => {
                res.send(
                    response(CODES.INTERNAL_SERVER_ERROR, _error)
                )
            })
        }else {
            res.send(
                response(CODES.INTERNAL_SERVER_ERROR, 'PROJECT NOT EXISTED')
            )
        }
    })
}

function getInfoProject(req, res) {
    const data = {
        idProject: req.body.idProject,
        idUser: req.decodeUser.idUser
    }

    Project.findOne({
        where: data
    })
    .then(project => {
        if(project) {
            res.send(
                response(CODES.SUCCESS, 'GET INFO PROJECT SUCCESS', project)
            )
        }else {
            res.send(
                response(CODES.INTERNAL_SERVER_ERROR, 'PROJECT NOT EXISTED')
            )
        }
    })
    .catch(error => {
        res.send(
            response(CODES.INTERNAL_SERVER_ERROR, error)
        )
    })
}

function getListProject(req, res) {
    Project.findAll({
        where: {
            idUser: req.decodeUser.idUser
        }
    })
    .then(projects => {
        res.send(
            response(CODES.SUCCESS, 'GET LIST PROJECT SUCCESS', projects)
        )
    })
    .catch(error => {
        res.send(CODES.INTERNAL_SERVER_ERROR, error)
    })
}

module.exports = {
    createProject,
    editProject,
    deleteProject,
    getInfoProject,
    getListProject
}