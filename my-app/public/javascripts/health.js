var health = undefined;
var canvasDrawOnTop = undefined;

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
    this.bpm;
    this.timeoutID;
    this.square;
    this.form;
    this.continueUpdates;
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
    this.continueUpdates = true;
    this.bpms =[];
    this.form ='<h3>Do you feel stressed?</h3>'+
    '<input name="stress" type="range" value="50" min="0" max="100" id="range" />'+
    '<input type="number" value="78" name="bpm" id="hearthRate" hidden="true"/>'+
    '<input type="number" value="-1" name="sex" id="sex" hidden="true"/>'+
    '<input type="number" value="-1" name="smoker" id="smoker" hidden="true"/>'+

    '<h4 id="notmuch">Not much...</h4><h4 id="alot">A lot!</h4>'+
    '<div style="text-align: center;">'+
    '<label class="button" onclick="health.sex(0);">'+
    '<input type="radio" name="radiosex" />'+
    '<span class="outer"><span class="inner"></span></span>'+
    'Male'+
    '</label>'+
    '<label class="button" onclick="health.sex(1);">'+
    '<input type="radio" name="radiosex" />'+
    '<span class="outer"><span class="inner"></span></span>'+
    'Female'+
    '</label>'+
    '</div>'+
    '<div style="text-align: center;">'+
    '<label class="button" onclick="health.smoker(0);">'+
    '<input type="radio" name="radiosmoke" />'+
    '<span class="outer"><span class="inner"></span></span>'+
    'I smoke'+
    '</label>'+
    '<label class="button" onclick="health.smoker(1);">'+
    '<input type="radio" name="radiosmoke"  />'+
    '<span class="outer"><span class="inner"></span></span>'+
    'I don\'t smoke'+
    '</label>'+
    '</div>'+
    '<a id="startButtton" class="myButton" onclick="health.sendData()">Submit!</a>';

    this.sex = function(value){
        document.getElementById("sex").setAttribute("value", value);

    }
    this.smoker =function(value){
        document.getElementById("smoker").setAttribute("value", value);

    }

    this.connectToWs = function(){
        clearTimeout(that.timeoutID);
        canvasDrawOnTop.initialize();
        that.continueUpdates = true;
        canvasDrawOnTop.text = "Stand still for 5 seconds";
        clearInterval(that.interval);
        $( "#myForm" ).fadeOut(500);
        $( "#devSignature" ).fadeIn(500);
        document.getElementById("myForm").innerHTML =that.form;
        that.bpm = undefined;
        that.bpms =[];
        that.ws = new WebSocket("ws://10.40.1.102:8082/");
        //that.ws = new WebSocket("ws://127.0.0.1:8082/");
        that.ws.onopen = function() {}
        that.ws.onmessage = function(e) {
            reader = new FileReader();
            reader.onload = function(event) {
                that.my = JSON.parse(reader.result);
                if(that.continueUpdates){
                    canvasDrawOnTop.x = that.my.square[0];
                    canvasDrawOnTop.y = that.my.square[1];
                    canvasDrawOnTop.w = that.my.square[2];
                    canvasDrawOnTop.h = that.my.square[3];
                    if(that.my.bpm>=52){
                        that.bpms.push(that.my.bpm);
                    }
                }
                canvasDrawOnTop.bpm = Math.ceil(that.bpms.average());
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

    this.sendData = function () {

        var bpm = document.getElementById("hearthRate").value;;
        var sex = document.getElementById("sex").value;
        var smoker =document.getElementById("smoker").value;
        var stress = document.getElementById("range").value;
        var data = new FormData();
        data.append('bpm', bpm);
        data.append('sex', sex);
        data.append('smoker', smoker);
        data.append('stress', stress);

        createCORSRequest('POST', 'http://127.0.0.1:3000/users', data);
        that.bpm = undefined;
        that.bpms =[];
        canvasDrawOnTop.initialize();
        $( "#myForm" ).fadeOut( 500);
        $( "#devSignature" ).fadeIn( 500);
        clearInterval(that.interval);
        document.getElementById("myForm").innerHTML =that.form;
        clearTimeout(that.timeoutID);
        getGrapshDataAndFill(10);
    };

    /* ~~Cross Platforms Stuff~~ */
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    this.video = document.createElement("video");
    this.canvas = document.getElementById('face');
    this.ctx = this.canvas.getContext('2d');

    this.img =document.querySelector("img");

    this.snap = function() {
        that.canvas =document.getElementById('face');
        that.ctx = that.canvas.getContext('2d');
        that.canvas.width  = 500;
        that.canvas.height =480;
        that.ctx.drawImage(that.video, -100, 0);
        canvasDrawOnTop.drawOnTop(that.ctx, that.img);
    }
    this.sendSnap = function(){
        var d = new Date();

        if(d.getTime()-that.startMs< that.timer){
            var image = that.canvas.toDataURL("image/jpeg",1.0);
            that.ws.send(image);
        }else{
            document.getElementById("myForm").innerHTML =that.form;
            $( "#myForm" ).fadeIn( 500);
            $( "#devSignature" ).fadeOut( 500);
            canvasDrawOnTop.initialize();
            canvasDrawOnTop.bpm = Math.ceil(that.bpms.average());
            canvasDrawOnTop.text = "Your Heart rate is:";
            that.continueUpdates = false;
            that.timeoutID = setTimeout(function() {
                that.sendData();
            },15000);
            clearInterval(that.interval);
            that.ws.close();
        }

    }

    this.startVideo = function() {
        that.bpms =[];
        setInterval(that.snap, 40);
        // Not showing vendor prefixes or code that works cross-browser.
        navigator.getUserMedia({video: true}, function(stream) {
            that.video.src = window.URL.createObjectURL(stream);
        }, function(e) {
        });
    }
}

document.onreadystatechange = function() {
    health = new Health();
    canvasDrawOnTop = new CanvasDrawOnTop();
    health.startVideo();
    $( "#myForm" ).fadeOut(500);
    $( "#devSignature" ).fadeIn(500);
    getGrapshDataAndFill(10);

};

Array.prototype.average=function(){
    var sum=0;
    var j=0;
    for(var i=0;i<this.length;i++){
        if(isFinite(this[i])){
            sum=sum+parseFloat(this[i]);
            j++;
        }
    }
    if(j===0){
        return 0;
    }else{
        return sum/j;
    }

}


function set_graph (array, color, name, label){
    var data = {
        labels: label,
        onClick:function(){},
        datasets:[
            {
            label: name,
            fill: false,
            lineTension: 0.2,
            backgroundColor: color,
            borderColor:color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: color,
            pointBackgroundColor: color,
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: color,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,

            data: array
            }
        ]
    }
    document.getElementById("myChart").remove();

    document.getElementById("canvasGraph").appendChild('<canvas id="myChart" width="1200" height="850"></canvas>');
    var chart = document.getElementById("myChart").getContext('2d');
    var options = {
        responsive: false,
        maintainAspectRatio: false
    }
    var myBarChart = new Chart(chart, {
        type: 'line',
        data: data,
        fullWidth:true,
        options: options
    });
}

function set_graphs(arrays, colors, names, label){
    var c=0;
    var ds =[];
    arrays.forEach(function(array) {
        ds.push({
            label: names[c],
            fill: false,
            lineTension: 0.2,
            backgroundColor: colors[c],
            borderColor:colors[c],
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: colors[c],
            pointBackgroundColor: colors[c],
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: colors[c],
            pointHoverBorderColor: colors[c],
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,

            data: array
        });
        c++;
    })


    var data = {
        labels: label,
        datasets: ds
    }
    document.getElementById("myChart").remove();

    document.getElementById("canvasGraph").innerHTML += '<canvas id="myChart" width="1200" height="850"></canvas>';
    var chart = document.getElementById("myChart").getContext('2d');
    var options = {
        responsive: false,
        maintainAspectRatio: false
    }
    var myBarChart = new Chart(chart, {
        type: 'line',
        data: data,
        fullWidth:true,
        options: options
    });
}



function createCORSRequest(method, url, data) {
    jQuery.support.cors = true;
    $.ajax({
        method: method,
        url: url,
        dataType: 'json',
        crossDomain: true,
        data: $("#myForm").serialize()
    }).done(function( msg ) {
        alert( "Done! msg =: " + msg );
    });
}


function getGrapshDataAndFill(days){
    var graphData = [];
    var graphDays = [];
    var graphLable =[];
    var graphColors = [];
    jQuery.support.cors = true;
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:3000/users/"+days,
        dataType: 'json',
        crossDomain: true
    }).done(function( msg ) {
        graphData.push(msg.bpm);
        graphLable.push("Average Hearth Rate");
        graphColors.push("rgba(75,192,192,1)");
        graphDays = msg.days;
        $.ajax({
            method: "GET",
            url: "http://127.0.0.1:3000/users/male/"+days,
            dataType: 'json',
            crossDomain: true
        }).done(function( msg ) {
            graphData.push(msg.bpm);
            graphLable.push("Average Hearth Rate For Male");
            graphColors.push("rgba(0,0,255,1)");

            $.ajax({
                method: "GET",
                url: "http://127.0.0.1:3000/users/female/"+days,
                dataType: 'json',
                crossDomain: true
            }).done(function( msg ) {
                graphData.push(msg.bpm);
                graphColors.push("rgba(255,0,0,1)");
                graphLable.push("Average Hearth Rate For Female");
                $.ajax({
                    method: "GET",
                    url: "http://127.0.0.1:3000/users/smoker/"+days,
                    dataType: 'json',
                    crossDomain: true
                }).done(function( msg ) {
                    graphData.push(msg.bpm);
                    graphColors.push("rgba(255,255,0,1)");
                    graphLable.push("Average Hearth Rate For Smokers");
                    $.ajax({
                        method: "GET",
                        url: "http://127.0.0.1:3000/users/notsmoker/"+days,
                        dataType: 'json',
                        crossDomain: true
                    }).done(function( msg ) {
                        graphData.push(msg.bpm);
                        graphColors.push("rgba(0,255,0,1)");

                        graphLable.push("Average Hearth Rate Not Smokers");
                        set_graphs(graphData,graphColors,graphLable,graphDays);
                    });
                });
            });
        });
    });

}
/*
 *  CanvasDrawOnTop Class
 */
function CanvasDrawOnTop(){
    this.x;
    this.y;
    this.w;
    this.h;
    this.drawOnTop;
    this.text;
    this.bpm;
    this.initialize();
}


CanvasDrawOnTop.prototype.initialize = function() {
    var that = this;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.bpm = 0;
    this.text = "Press Start to get your HR";
    this.drawOnTop = function (ctx, img) {
        ctx.beginPath();
        ctx.rect(that.x, that.y, that.w, that.h);
        ctx.lineWidth="3";
        ctx.strokeStyle="#2989d8";
        ctx.stroke();
        ctx.drawImage(img,420,400,80,80);
        ctx.fillStyle = "#fff";
        ctx.font ="25pt Calibri";
        var string = (~~parseFloat(that.bpm));
        var bpm = parseInt(string);
        if(bpm!=0){
            ctx.fillText(that.bpm, 440, 445);
            document.getElementById("hearthRate").setAttribute("value", Math.ceil(that.bpm));
        }
        ctx.fillText(that.text, 20, 445);
    }
}