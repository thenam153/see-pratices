const { User, Image }  = require('../models')
const response  = require('../utils/response')
const CODES     = require('../utils/codes').CODES
const config    = require('config')
const multer    = require('multer')
const path      = require('path')
const fs        = require('fs')
var storage     = multer.diskStorage({
    destination: function(req, file, cb) {
        let fileUrl = path.join("./data/", config.pathImage, req.decodeUser.username)
        if(!fs.existsSync(fileUrl)) {
            fs.mkdirSync(fileUrl);
        }
        cb(null, fileUrl)
    },
    filename: function(req, file, cb) {
        file.originalname = Date.now() + file.originalname
        cb(null, file.originalname)
    }
})
var upload = multer({ storage }).array('file')


function uploadImage(req, res) {
    upload(req, res, err => {
        if (err) {
            return res.send(response(CODES.INTERNAL_SERVER_ERROR, 'UPLOAD IMAGE GET ERROR', err))
        }
        newImage(req, res)  
    })
}

function newImage(req, res) {
    console.log(req.files)
    let idUser = req.decodeUser.idUser,
        file = {
            name: req.files[0].originalname,
            path: config.pathImage + req.decodeUser.username + '/' + req.files[0].originalname
        }
    
    User.findOne({
        where: {
            idUser
        }
    })
    .then(user => {
        if(!user) {
            return res.send(response(CODES.ERROR_USER_EXISTED, 'USER NOT EXISTED'))
        }
        // user.createImage(file)
        // .then(image => {
        //     return res.send(response(CODES.SUCCESS, 'UPLOAD IMAGE SUCCESS', image))
        // })
        file.idUser = user.idUser
        Image.findOrCreate({
            where: file,
            defaults: file
        })
        .spread((image, created) => {
            if(created) {
                return res.send(response(CODES.SUCCESS, 'UPLOAD IMAGE SUCCESS', image))
            }
            return res.send(response(CODES.INTERNAL_SERVER_ERROR, 'UPLOAD IMAGE ERROR', image))
        })
    })
    .catch(err => {
        return res.send(response(CODES.INTERNAL_SERVER_ERROR, 'CREATE IMAGE ERROR', err))
    })
}

function downloadImage(req, res) {
    Image.findOne({
        where: {
            idImage: req.body.idImage
        }
    })
    .then(image => {
        let imagePath = path.join(__dirname,'../../data/', image.path);
        console.log(imagePath)
        if(fs.existsSync(imagePath)) {
            res.sendFile(imagePath)
        }else {
            res.send(
                response(CODES.INTERNAL_SERVER_ERROR, `IMAGE NOT EXIST`, `CAN'T DOWNLOAD FILE`)
            )
        }
    })
}

function getImageById(req, res) {
    Image.findOne({
        where: {
            idImage: req.body.idImage
        }
    })
    .then(image => {
        res.send(response(CODES.SUCCESS, 'GET IMAGE SUCCESS', image))
    })
}

function getImageByName(req, res) {
    Image.findOne({
        where: {
            name: req.body.name
        }
    })
    .then(image => {
        res.send(response(CODES.SUCCESS, 'GET IMAGE SUCCESS', image))
    })
}

function deleteImage(req, res) {
    Image.findOne({
        where: {
            idImage: req.body.idImage
        }
    })
    .then(image => {
        if(image) {
            image.destroy()
            let imagePath = path.join(__dirname, '../../data', image.path)
            fs.unlinkSync(imagePath)
            res.send(
                response(CODES.SUCCESS, 'DELETE IMAGE SUCCESS', image.idImage)
            )
        }else {
            res.send(
                response(CODES.INTERNAL_SERVER_ERROR, 'IMAGE NODE EXIST', "CAN'T DELETE IMAGE")
            )
        }
    
    })
}

function listImage(req, res) {
    Image.findAll({
        attributes: ['idImage', 'name', 'path'],
        where: {
            idUser: req.decodeUser.idUser
        }
    })
    .then(images => {
        res.send(
            response(CODES.SUCCESS, 'GET LIST IMAGE SUCCESS', images)
        )
    })
}

module.exports = {
    uploadImage,
    downloadImage,
    getImageById,
    getImageByName,
    deleteImage,
    listImage
}