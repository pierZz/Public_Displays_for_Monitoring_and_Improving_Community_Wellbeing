var health = undefined;
/*
 *  Health Class
 */
function Health(){
    this.my;
    this.ws;
    this.video;
    this.canvas;
    this.ctx;
    this.snap;
    this.startVideo;
    this.timer;
    this.interval;
    this.startMs;
    this.initialize();
}

/*
 * initialize function
 *
 * Initializes all variables
 */
Health.prototype.initialize = function() {
    this.ws = undefined;
    var that = this;
    this.timer = undefined;
    this.connectToWs = function(){
        that.ws = new WebSocket("ws://10.40.1.102:8082/");
        that.ws.onopen = function() {
            console.log("connected");
        }
        that.ws.onmessage = function(e) {
            reader = new FileReader();
            reader.onload = function(event) {
                that.my = JSON.parse(reader.result);
            }
            reader.readAsText(e.data);
        };
        that.ws.onclose = function(){
            that.ws.close();
            that.my = undefined;
        };
        that.timer = 5000;
        var d = new Date();
        that.startMs = d.getTime();
        that.interval = setInterval(that.sendSnap, 180);

    }

    /* ~~Cross Platforms Stuff~~ */
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    this.video = document.createElement("video");
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.img =document.querySelector("img");

    this.snap = function() {
        that.ctx.drawImage(that.video, -100, 0);
        if(that.my!=undefined) {
            that.ctx.beginPath();
            that.ctx.rect(that.my['square'][0], that.my['square'][1], that.my['square'][2], that.my['square'][3]);
            that.ctx.lineWidth="3";
            that.ctx.strokeStyle="#2989d8";
            that.ctx.stroke();
            that.ctx.drawImage(that.img,420,400,80,80);
            that.ctx.fillStyle = "#fff";
            that.ctx.font ="25pt Calibri";
            var string = (~~parseFloat(that.my['bpm']));
            that.ctx.fillText(string, 440, 445);
        }
    }
    this.sendSnap = function(){
        var d = new Date();

        if(d.getTime()-that.startMs< that.timer){
            var image = that.canvas.toDataURL("image/jpeg",1.0);
            that.ws.send(image);
        }else{
            clearInterval(that.interval);
            that.ws.close();
        }

    }

    this.startVideo = function() {
        setInterval(that.snap, 40);
        // Not showing vendor prefixes or code that works cross-browser.
        navigator.getUserMedia({video: true}, function(stream) {
            that.video.src = window.URL.createObjectURL(stream);
        }, function(e) {
            console.log("rejected", e);
        });
    }
}
document.onreadystatechange = function() {
    health = new Health();
    health.startVideo();

    var data = {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [
            {
                label: "Female",

                // The properties below allow an array to be specified to change the value of the item at the given index
                // String  or array - the bar color
                backgroundColor: "rgba(255,99,132,0.9)",

                // String or array - bar stroke color
                borderColor: "rgba(255,99,132,1)",

                // Number or array - bar border width
                borderWidth: 1,

                // String or array - fill color when hovered
                hoverBackgroundColor: "rgba(255,99,132,1)",

                // String or array - border color when hovered
                hoverBorderColor: "rgba(255,99,132,1)",

                // The actual data
                data: [65, 59, 80, 81, 56, 55, 40],

                // String - If specified, binds the dataset to a certain y-axis. If not specified, the first y-axis is used.
                yAxisID: "y-axis-0"
            },
            {
                label: "Male",
                backgroundColor: "rgba(54,162,235,0.9)",
                borderColor: "rgba(54,162,235,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(54,162,235,1)",
                hoverBorderColor: "rgba(54,162,235,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
    var chart = document.getElementById("myChart").getContext('2d');
    var options = {
        responsive: true,
        maintainAspectRatio: true
    }
    var myBarChart = new Chart(chart, {
        type: 'bar',
        data: data,
        options: options
    });

    var data2 = {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [
            {
                label: "Smokers",

                // The properties below allow an array to be specified to change the value of the item at the given index
                // String  or array - the bar color
                backgroundColor: "rgba(255,255,51,0.9)",

                // String or array - bar stroke color
                borderColor: "rgba(255,255,51,1)",

                // Number or array - bar border width
                borderWidth: 1,

                // String or array - fill color when hovered
                hoverBackgroundColor: "rgba(255,255,51,1)",

                // String or array - border color when hovered
                hoverBorderColor: "rgba(255,255,51,1)",

                // The actual data
                data: [65, 59, 80, 81, 56, 55, 40],

                // String - If specified, binds the dataset to a certain y-axis. If not specified, the first y-axis is used.
                yAxisID: "y-axis-0",
            },
            {
                label: "! Smokers",
                backgroundColor: "rgba(102,255,102,0.9)",
                borderColor: "rgba(102,255,102,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(102,255,102,1)",
                hoverBorderColor: "rgba(102,255,102,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
    var chart2 = document.getElementById("myChartS").getContext('2d');
    var options2 = {
        responsive: true,
        maintainAspectRatio: true
    }
    var myBarChart2 = new Chart(chart2, {
        type: 'bar',
        data: data2,
        options: options2
    });
};

//document.querySelector('#range').addEventListener('input', function() {
//    this.setAttribute('value', this.value);
//});