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
})