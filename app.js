const express   = require('express')
const app       = express()
const config    = require('config')
const path      = require('path')
const bodyParse = require('body-parser')
const cors      = require('cors')
const passport  = require('passport')
const jwt       = require('jsonwebtoken')
const response  = require('./server/utils/response')

app.use(cors())
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({ extended: true }))
// add session app
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'client/dist')))
app.use(express.static(path.join(__dirname, 'data')))

const userRouter            = require('./server/routers/user')
const projectRouter         = require('./server/routers/project')
const imageRouter           = require('./server/routers/image')
const authenticateRouter    = require('./server/routers/authentication')

const models                = require('./server/models')

require('./server/passport')

app.use('/', authenticateRouter)
app.use(function(req, res, next) {
    let token = req.body.token || req.headers.token
    if(!token) {
        return res.send('unauthenticated')
    }
    jwt.verify(token, config.secret, function(err, user) {
        if(err) {
            return res.send(response(400, err.message || "CANNOT DECODE"))
        }
        req.decodeUser = user
        next()
    })
})

app.use('/api', userRouter)
app.use('/api', imageRouter)
app.use('/api', projectRouter)

app.listen(config.application.port, () => {
    console.log("Listen . . . " + config.application.port)
})