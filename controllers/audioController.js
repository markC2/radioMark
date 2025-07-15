//audioController
const { addClient, killStream, startStream } = require('../services/FFMPEGService');



const audioControllerRawMp3 = (req, res) => {
    res.setHeader('Content-type', 'audio/mpeg');
    res.setHeader('Transfer-encoding', 'chunked');
    res.setHeader('Connection', 'keep-alive');

    addClient(res);


};

const HLSstreamHandler = (req,res) =>{
    const route = req.path

    if (route === '/stop-stream'){
        killStream(res)
    }
    else if(route === '/start-stream'){
        startStream(res)

    }
   
}


module.exports = {audioControllerRawMp3, HLSstreamHandler}