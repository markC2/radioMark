//audioController
const { addClient } = require('../services/FFMPEGService');



const audioController = (req, res) => {
    res.setHeader('Content-type', 'audio/mpeg');
    res.setHeader('Transfer-encoding', 'chunked');
    res.setHeader('Connection', 'keep-alive');

    addClient(res);


};


module.exports = audioController