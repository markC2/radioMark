//audioRoutes 
const express = require ('express')

const {audioControllerRawMp3,HLSstreamHandler} = require('../controllers/audioController')


const router = express.Router()

//for streaming raw mp3 not hls chunked
router.get('/audio', audioControllerRawMp3)

router.post('/stop-stream', HLSstreamHandler)

router.post('/start-stream', HLSstreamHandler)


module.exports = router