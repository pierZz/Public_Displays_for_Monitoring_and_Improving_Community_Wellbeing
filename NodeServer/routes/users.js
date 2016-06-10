var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  port     : "3307",
  user     : 'root',
  password : 'root',
  database : 'people'
});
connection.connect();

/* GET users listing. */
router.get('/:days', function(req, res, next) {
  console.log("Banana");
  res.setHeader('Access-Control-Allow-Origin', '*');

  var date = new Date();
  date.setDate(date.getDate()-req.params.days);
  var year =date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var strDate = year+"-"+month+"-"+day;
  console.log(strDate);
  var query ="SELECT AVG(bpm) AS BPM, date FROM Users GROUP BY date HAVING date > \""+strDate+"\";";
  console.log(query);
  var response ={};
  response.bpm =[];
  response.days = [];
  var sqlRes = [];
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  connection.query(query, function(err, rows, fields) {
    if (!err){
      rows.forEach(function(item){
        response.bpm.push(item.BPM);
        response.days.push(item.date.getDate()+" "+months[item.date.getMonth()]);

      });
      console.log(response);
    }
    res.send(response);
  });


});

router.get('/male/:days', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  var date = new Date();
  date.setDate(date.getDate()-req.params.days);
  var year =date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var strDate = year+"-"+month+"-"+day;
  console.log(strDate);
  var query ="SELECT AVG(bpm) AS BPM, date FROM Users WHERE gender = 0 GROUP BY date HAVING date > \""+strDate+"\";";
  console.log(query);
  var response ={};
  response.bpm =[];
  response.days = [];
  var sqlRes = [];
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  connection.query(query, function(err, rows, fields) {
    if (!err){
      rows.forEach(function(item){
        response.bpm.push(item.BPM);
        response.days.push(item.date.getDate()+" "+months[item.date.getMonth()]);

      });
      console.log(response);
    }
    res.send(response);
  });


});

router.get('/female/:days', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  var date = new Date();
  date.setDate(date.getDate()-req.params.days);
  var year =date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var strDate = year+"-"+month+"-"+day;
  console.log(strDate);
  var query ="SELECT AVG(bpm) AS BPM, date FROM Users WHERE gender = 1 GROUP BY date HAVING date > \""+strDate+"\";";
  console.log(query);
  var response ={};
  response.bpm =[];
  response.days = [];
  var sqlRes = [];
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  connection.query(query, function(err, rows, fields) {
    if (!err){
      rows.forEach(function(item){
        response.bpm.push(item.BPM);
        response.days.push(item.date.getDate()+" "+months[item.date.getMonth()]);

      });
      console.log(response);
    }
    res.send(response);
  });


});

router.get('/notsmoker/:days', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  var date = new Date();
  date.setDate(date.getDate()-req.params.days);
  var year =date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var strDate = year+"-"+month+"-"+day;
  console.log(strDate);
  var query ="SELECT AVG(bpm) AS BPM, date FROM Users WHERE smoker = 1 GROUP BY date HAVING date > \""+strDate+"\";";
  console.log(query);
  var response ={};
  response.bpm =[];
  response.days = [];
  var sqlRes = [];
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  connection.query(query, function(err, rows, fields) {
    if (!err){
      rows.forEach(function(item){
        response.bpm.push(item.BPM);
        response.days.push(item.date.getDate()+" "+months[item.date.getMonth()]);

      });
      console.log(response);
    }
    res.send(response);
  });


});

router.get('/smoker/:days', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  var date = new Date();
  date.setDate(date.getDate()-req.params.days);
  var year =date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var strDate = year+"-"+month+"-"+day;
  console.log(strDate);
  var query ="SELECT AVG(bpm) AS BPM, date FROM Users WHERE smoker = 0 GROUP BY date HAVING date > \""+strDate+"\";";
  console.log(query);
  var response ={};
  response.bpm =[];
  response.days = [];
  var sqlRes = [];
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  connection.query(query, function(err, rows, fields) {
    if (!err){
      rows.forEach(function(item){
        response.bpm.push(item.BPM);
        response.days.push(item.date.getDate()+" "+months[item.date.getMonth()]);

      });
      console.log(response);
    }
    res.send(response);
  });


});

router.post('/', function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log(req.body);
  if(req.body.sex==-1){
    req.body.sex=null;
  }
  if(req.body.smoker==-1){
    req.body.smoker=null;
  }
  var query="INSERT INTO Users (bpm,stress,gender,smoker,date) VALUES ("+req.body.bpm+","+req.body.stress+","+ req.body.sex+","+ req.body.smoker+",CURDATE());"

  connection.query(query, function(err, rows, fields) {
  });
  res.send("Hola");
});
module.exports = router;
