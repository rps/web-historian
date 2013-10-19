var fs = require('fs');
var req = require('request');
var moment = require('moment');
var mysql = require('mysql');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sitearchives');

var db  = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('connected to MongoDB');
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'sites_db'
});

var schema = mongoose.Schema({url: String, directory: String, createdAt:Number});
var Snapshot = mongoose.model('Snapshot', schema);

connection.connect(function(err) {
  console.log('connected!');
  if(err){
    console.log(err);
  }
});


exports.readUrls = function(filePath, cb){
  var fileOutput = fs.readFileSync(filePath);
  cb(fileOutput.toString());
};

exports.downloadUrls = function(url, sitesdir){
  req('http://'+url, function (error, response, body) {
    if (!error && response.statusCode === 200) {

      var fileName = sitesdir+url+moment().format("_MMM_Do_h:mm_a");
      fs.writeFileSync(fileName,body);
      var snapshot = new Snapshot({url: url, directory: fileName, createdAt:Date.now()});
      snapshot.save();
      var query = connection.query("INSERT INTO sites_table SET ?",{url: url, directory : fileName}, function(err, result){
        if (err){
          console.log(err);
        } else{
          console.log(result);
        }
      });
    }
  });
};