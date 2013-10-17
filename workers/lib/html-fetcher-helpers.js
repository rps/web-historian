var fs = require('fs');
var req = require('request');
var moment = require('moment');

exports.readUrls = function(filePath, cb){
  var fileOutput = fs.readFileSync(filePath);
  cb(fileOutput.toString());
};

exports.downloadUrls = function(url, sitesdir){
  req('http://'+url, function (error, response, body) {
    console.log(error)

    if (!error && response.statusCode === 200) {

      var fileName = sitesdir+url+moment().format("_MMM_Do_mm:ss");
      console.log('filename',fileName);
      fs.writeFileSync(fileName,body);
    }
  });
};
