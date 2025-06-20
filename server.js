const express = require('express');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

let clients = [];

app.get("/stream", (req, res) =>{
    res.setHeader('Content-type', 'audio/mpeg');
    res.setHeader('Transfer-encoding', 'chunked');
    res.setHeader('Connection', 'keep-alive');
    clients.push(res);



    req.on('close', () => {
        clients = clients.filter(c => c !== res);
    });


});


const ffmpeg = spawn('ffmpeg', [
    '-f', 'avFoundation',
    '-i', ':2',
    '-acodec', 'libmp3lame',
    '-b:a', '128k',
    '-f', 'mp3',
    '-'
]);


ffmpeg.stdout.on('data', chunk => {
    clients.forEach(res=> res.write(chunk));

});


ffmpeg.stderr.on('data', data => {
    console.error('FFmpeg:', data.toString());
  });
  
ffmpeg.on('exit', () => {
    console.log('FFmpeg exited');
});
  
app.listen(PORT, () => {
    console.log(`🎧 Server running at http://localhost:${PORT}/stream`);
});