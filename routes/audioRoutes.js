//audioRoutes 
const express = require ('express')

const audioController = require('../controllers/audioController')
const router = express.Router()

router.get('/audio', audioController)


module.exports = router