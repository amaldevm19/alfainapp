
$(document).ready(function () {  
    console.log("Document ready")
    if ('serviceWorker' in navigator) {
        console.log("Service worker available")
        navigator.serviceWorker.register('/sw.js',{scope: '/'}).then( () => {
        console.log('Service Worker Registered')

        })
    }
})