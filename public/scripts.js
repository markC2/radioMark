document.addEventListener('DOMContentLoaded', () => {
const stopStreamBtn = document.getElementById("stopStreamBtn")
const startStreamBtn = document.getElementById("startStreamBtn")
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


const audio = document.getElementById('stream');
  const streamSrc = '/stream/stream.m3u8';

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(streamSrc);
    hls.attachMedia(audio);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      audio.play();
    });
  } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari fallback
    audio.src = streamSrc;
    audio.addEventListener('loadedmetadata', () => {
      audio.play();
    });
  } else {
    console.error('❌ HLS is not supported in this browser.');
  }
})