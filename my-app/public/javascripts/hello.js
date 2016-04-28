/**
 * Created by SniPierZz on 22/04/16.
 */
var my;
function setupWebSocket() {
    var ws = new WebSocket("ws://localhost:8082/");

    ws.onopen = function() {
        console.log("connected");
    }
    ws.onmessage = function(e) {
//    document.getElementById("streamed").src = e.data;
        reader = new FileReader();
        reader.onload = function(event) {
            my = JSON.parse(reader.result);
            var c = document.querySelector('canvas');
        }
        reader.readAsText(e.data);
    }
    return ws;
}
var ws = setupWebSocket();

// cross-platform stuff.
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia || navigator.msGetUserMedia;
// Note: The file system has been prefixed as of Google Chrome 12:
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

var video = document.querySelector('video');
var canvas = document.querySelector('canvas');

var ctx = canvas.getContext('2d');
var localMediaStream = true;

function snapshot() {
    canvas.width =canvas.width;
    if (localMediaStream) {
        ctx.drawImage(video, -100, 0);
        var image = canvas.toDataURL('image/jpeg');
        ws.send(image);
        //document.querySelector('img').src = image
        if(my!=undefined){
            ctx.rect(my['square'][0],my['square'][1],my['square'][2],my['square'][3]);
            ctx.stroke();
            var string = "bpm"
            string = (~~parseFloat(my['bpm']))+string;
            ctx.fillText(string,10,50);

        }
        //tryToSaveIt(image);

    }
}

function startVideo() {
    video.addEventListener('click', snapshot, false);
    setInterval(snapshot, 160);
    // Not showing vendor prefixes or code that works cross-browser.
    navigator.getUserMedia({video: true}, function(stream) {
        video.src = window.URL.createObjectURL(stream);
        localMediaStream = stream;
    }, function(e) {
        console.log("rejected", e);
    });
}