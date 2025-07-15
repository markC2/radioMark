//server.js 
const {app} = require('./app');
const { spawnFFMPEGMP3StreamRaw , spawnFFMPEGMP3StreamHLS} = require('./services/FFMPEGService')

const PORT = 3000;



app.listen(PORT, () => {
    console.log(`🎧 Server running at http://localhost:${PORT}/audio`);
    spawnFFMPEGMP3StreamHLS(process.argv[2]);
    console.log("spawning ffmpeg with device ", process.argv[2])
})



