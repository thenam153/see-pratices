const passport      = require('passport')
const jwt           = require('jsonwebtoken')
const LocalStrategy = require('passport-local').Strategy
const model         = require('../models')
const User          = model.User
const fs            = require('fs')
const config        = require('config')

passport.serializeUser((user, done) => { done(null, user) })

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use('register', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
}, function(req, username, password, done) {
    User.findOrCreate({ where: {username}, defaults: {
        username,
        password,
        email: req.body.email,
        avatar: req.body.avatar || ''
    }})
    .spread((user, created) => {
        if(created) {
            let path = `${config.pathImage + user.get().username}`
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            done(null, user.get())
        }else {
            done('User existed')
        }
    }) 
}))

passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
}, function(req, username, password, done) { 
    console.log(username, password)
    User.findOne({
        where: {
            username,
            password
        }
    })
    .then((user) => {
        if(!user) {
            done('CANNOT FIND USER')
        }else {
            done(null, user.get())
        }
    })
}))


passport.use('forgetpassword', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
}, function(req, username, password, done) { 
    console.log(username, password)
    User.findOne({
        where: {
            username,
            password
        }
    })
    .then((user) => {
        if(!user) {
            done('CANNOT FIND USER')
        }else {
            done(null, user.get())
        }
    })
}))