var fs = require('fs');
var req = require('request');
var moment = require('moment');

exports.readUrls = function(filePath, cb){
  var fileOutput = fs.readFileSync(filePath);
  cb(fileOutput.toString());
};

exports.downloadUrls = function(url, sitesdir){
  req('http://'+url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var fileName = sitesdir+url+moment().format("_MMM_Do_mm");
      fs.writeFileSync(fileName,body);
    }
  });
};
