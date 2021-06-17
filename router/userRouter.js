const express = require('express')
const router = express.Router()
const {readToken} = require('../config')

const {userController} = require('../controller')

router.get('/get', userController.getUsers)
router.post('/register', userController.addUsers)
router.post('/login',readToken, userController.login)


module.exports= router