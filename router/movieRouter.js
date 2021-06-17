const express = require('express')
const { movieController } = require('../controller')
const router = express.Router()
router.get('/get/all', movieController.getAll)
router.get('/get', movieController.getMovie)
router.post('/add', movieController.add)
module.exports= router