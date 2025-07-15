document.addEventListener('DOMContentLoaded', () => {
const stopStreamBtn = document.getElementById("stopStreamBtn")
const startStreamBtn = document.getElementById("startStreamBtn")


function setupAudioVisualiser(audio){
    console.log("🔊 Setting up visualizer"); 
    const canvas = document.getElementById("visualiser")
    const ctx = canvas.getContext('2d')
    
    const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    
    
    function drawVisualiser(){
        requestAnimationFrame(drawVisualiser);
    
        analyser.getByteFrequencyData(dataArray)
    
        ctx.fillStyle = '#234'
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        
        const barWidth = (WIDTH / bufferLength) * 2.5;
        let x = 0;
    
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i];
    
          ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
          ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
    
          x += barWidth + 1;
        }
      }
    
      drawVisualiser()

}




stopStreamBtn.addEventListener('click', () =>{
    fetch('/stop-stream', {
        method: 'POST'
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg)
        console.log(msg)
    })
    .catch(err =>{
        alert('failed to stop stream')
        console.error(err)
    })

})


startStreamBtn.addEventListener('click', () =>{
    fetch('/start-stream', {
        method: 'POST'
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg)
        console.log(msg)
    })
    .catch(err =>{
        alert('failed to start stream')
        console.error(err)
    })

})



  const streamAudio = document.getElementById("stream")
  const streamSrc = '/stream/stream.m3u8';

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(streamSrc);
    hls.attachMedia(streamAudio);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      streamAudio.play().then(() =>{
        setupAudioVisualiser(streamAudio)
      });
    });
  } else if (streamAudio.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari fallback
    streamAudio.src = streamSrc;
    streamAudio.addEventListener('loadedmetadata', () => {
      streamAudio.play();
    });
  } else {
    console.error(' HLS is not supported in this browser.');
  }
})