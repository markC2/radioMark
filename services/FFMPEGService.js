//ffmpegService
const { spawn } = require('child_process');


let ffmpegProcess = null;
let audioClients = [];

function  spawnFFMPEGMP3Stream(device){

    //singleton
    if(ffmpegProcess) return;

    const ffmpeg = spawn('ffmpeg', [
        '-f', 'avFoundation',
       `-i`, `:${device}`, //input device
        '-acodec', 'libmp3lame',
        '-b:a', '128k',
        '-f', 'mp3',
        '-'
    ]);


    ffmpeg.stdout.on('data', chunk => {
        audioClients.forEach(res=> res.write(chunk));

    });


    ffmpeg.stderr.on('data', data => {
        console.error('FFmpeg:', data.toString());
    });
    
    ffmpeg.on('exit', () => {
        console.log('FFmpeg exited');
        ffmpegProcess = null;
    });
}

    
    
    


function addClient(res){
    audioClients.push(res);
    res.on('close', ()=>{
        audioClients = audioClients.filter(client => client !== res);
    });

}
   



module.exports = {spawnFFMPEGMP3Stream, addClient}