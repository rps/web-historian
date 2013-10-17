var fs = require('fs');
var req = require('request');
var moment = require('moment');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'sites_db'
});

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

      var fileName = sitesdir+url+moment().format("_MMM_Do_mm");
      fs.writeFileSync(fileName,body);
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