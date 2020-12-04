const { User, Image } = require('../models')
const response = require('../utils/response')
const CODES = require('../utils/codes').CODES
function changePassword(req, res) {
    let oldPassword = req.body.oldPassword,
        newPassword = req.body.newPassword,
        reNewPassword = req.body.reNewPassword
    let username = req.decodeUser.username
    if (newPassword != reNewPassword) {
        return res.send(response(CODES.ERROR_BAD_REQUEST, 'PASSWORD NOT MATCH'))
    }
    User.findOne({
        where: {
            username
        }
    })
    .then(user => {
        if(!user) {
            return res.send(response(CODES.ERROR_USER_EXISTED, 'USER NOT EXISTED'))
        }
        if(user.password != oldPassword) {
            return res.send(response(CODES.ERROR_BAD_REQUEST, 'PASSWORD IS WRONG'))
        }
        user.update({
            password: newPassword
        })
        .then(() => {
            return res.send(response(CODES.SUCCESS, 'CHANGE PASSWORD SUCCESS'))
        })
    })
    .catch(err => {
        return res.send(response(CODES.INTERNAL_SERVER_ERROR, 'CHANGE PASSWORD ERROR', err))
    })
} 

function getInfoUser(req, res) {
    let username = req.decodeUser.username,
        idUser = req.decodeUser.idUser

    User.findOne({
        attributes: ['idUser', 'username', 'email', 'avatar'],
        where: {
            username,
            idUser
        }
    })
    .then(user => {
        if(!user) {
            return res.send(response(CODES.ERROR_USER_EXISTED, 'USER NOT EXISTED'))
        }
        return res.send(response(CODES.SUCCESS, 'GET INFO SUCCESS', user))
    })
    .catch(err => {
        return res.send(response(CODES.INTERNAL_SERVER_ERROR, 'GET INFO ERROR', err))
    })
}

function getImages(req, res) {
    let username = req.decodeUser.username

    User.findOne({   
        where: {
            username
        }
    })
    .then(user => {
        if(!user) {
            return res.send(response(CODES.ERROR_USER_EXISTED, 'USER NOT EXISTED'))
        }
        user.getImages({
            attributes: ['idImage', 'name', 'path']
        })
        .then(images => {
            return res.send(response(CODES.SUCCESS, 'GET IMAGES SUCCESS', images))
        })
    })
    .catch(err => {
        return res.send(response(CODES.INTERNAL_SERVER_ERROR, 'GET IMAGES ERROR', err))
    })
}

module.exports = {
    changePassword,
    getInfoUser,
    getImages
}