const passport  = require('passport')
const jwt       = require('jsonwebtoken')
const config    = require('config')
const response  = require('../utils/response')
const { CODES }  = require('../utils/codes')
function makeJwt(obj, expiresIn = '24h') {
    return jwt.sign(obj, config.secret, {expiresIn})
}
module.exports.makeJwt = makeJwt

module.exports.register = function(req, res) {
    passport.authenticate('register', function(err, user, info) {
        if(err) {
            return res.send(
                response(CODES.ERROR_BAD_REQUEST, err)
            )
        }else {
            res.send(
                response(CODES.SUCCESS,"REGISTER SUCCESS", { token: makeJwt(user) })
                )
        }
    })(req, res)
}

module.exports.login = function(req, res) {
    passport.authenticate('login', function(err, user, info) {
        console.log(err, user)
        if(err) {
            return res.send(
                response(CODES.INTERNAL_SERVER_ERROR, err)
            )
        }
        if(!user) {
            return res.send(
                response(CODES.ERROR_BAD_REQUEST, "USER NOT EXISTED")
            )
        }
        req.login(user, function(err) {
            if(err) {
                return res.send(
                    response(CODES.INTERNAL_SERVER_ERROR, err)
                )
            }
            res.send(                
                response(CODES.SUCCESS,"LOGIN SUCCESS", { token: makeJwt(user) })
            )
        })
    })(req, res)
}

module.exports.logout = function(req, res) {
    req.logout()
}

module.exports.authenticate = function(req, res) {

}