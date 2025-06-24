const express = require('express');
const { spawn } = require('child_process');
const { axios } = require('axios');
const { qs } = require('qs');
const { env } = require('process');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

let audioClients = [];


async function getSpotifyAcessToken(){
    const clientID = 'e2b7cb130ccd4792a238477a4a9f4703'
    const clientSecret = process.env.clientSecret
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token',
        qs.stringify({ grant_type: 'client_credentials' }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
          },
        }
      );
      return tokenResponse.data.access_token;
}

app.get("/audio", (req, res) =>{
    res.setHeader('Content-type', 'audio/mpeg');
    res.setHeader('Transfer-encoding', 'chunked');
    res.setHeader('Connection', 'keep-alive');
    audioClients.push(res);



    req.on('close', () => {
        audioClients = audioClients.filter(c => c !== res);
    });


});


app.get("/album-art", async (req,res) =>{
    const { track, artist } = req.query

    if (!track || !artist ){
        return res.status(400).send({error: 'please provide track and artist '})
    }

    try{

        const accessToken = await getSpotifyAcessToken();
        const searchResponse = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: {
                'Authorizaiton': 'Bearer ${accessToken}'
        },
        params: {
            q: '${track} ${artist}',
            type: 'track',
            limit: 1,

        },
    });

    const AlbumArtUrl = searchResponse.data.tracks.items[0]?.album.images[0]?.url;
    
    res.json({AlbumArtUrl});
    }
    catch (error){
    res.status(500).send({error: 'Error retrieving album art'});
    }

});

const ffmpeg = spawn('ffmpeg', [
    '-f', 'avFoundation',
    '-i', ':0',
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
});




  
app.listen(PORT, () => {
    console.log(`🎧 Server running at http://localhost:${PORT}/audio`);
    
});