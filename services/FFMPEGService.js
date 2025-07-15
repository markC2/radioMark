//ffmpegService
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let ffmpegProcess = null;
let audioClients = [];
const outputDir = path.resolve(__dirname, '../public/stream')

function  spawnFFMPEGMP3StreamRaw(device){

    //singleton
    if(ffmpegProcess) return;

    const ffmpeg = spawn('ffmpeg', [
        '-f', 'avFoundation',
       `-i`, `:${device}`,  //input device passed via command
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


function  spawnFFMPEGMP3StreamHLS(device){

    //singleton
    if(ffmpegProcess) return;

   

    ffmpegProcess = spawn('ffmpeg', [
        '-f', 'avfoundation', // macOS only — change if on Linux/Windows
        '-i', `:${device}`,
        '-c:a', 'aac',
        '-b:a', '128k',
        '-f', 'hls',
        '-hls_time', '5',
        '-hls_list_size', '6',
        '-hls_flags', 'delete_segments',
        `${outputDir}/stream.m3u8`
      ]);

      ffmpegProcess.stderr.on('data', data => {
        console.error('FFmpeg:', data.toString());
      });
    
      ffmpegProcess.on('exit', () => {
        console.log(' FFmpeg stopped streaming');
        ffmpegProcess = null;
        cleanUpStreamFiles()
      });
    
      console.log(' Started HLS stream to /public/stream');


}


function cleanUpStreamFiles(){
    fs.readdir(outputDir, (err, files)=>{
        if (err) return console.error("failed to read stream dir:", err)

        files.forEach(file => {
            if (file.endsWith(".ts") || file.endsWith(".m3u8")){
                fs.unlink(path.join(outputDir, file), err => {
                    if(err) console.error("failed to delete", file, err)

                })
            }
        })

        console.log('cleaned up old stream files')
    })
}
    
    
 function killStream(res){
    if (ffmpegProcess){
        ffmpegProcess.kill('SIGINT');
        res.send("Stream Stopped")
    }
    else{
        res.send("Stream not running")
    }
 }   


function addClient(res){
    audioClients.push(res);
    res.on('close', ()=>{
        audioClients = audioClients.filter(client => client !== res);
    });

}

function startStream(res){
    spawnFFMPEGMP3StreamHLS(process.argv[2])
}
   



module.exports = {spawnFFMPEGMP3StreamRaw,spawnFFMPEGMP3StreamHLS, addClient, killStream, startStream}