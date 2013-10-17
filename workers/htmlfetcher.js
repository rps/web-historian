// eventually, you'll have some code here that uses the tested helpers
// to actually download the urls you want to download.

var path = require('path');

var helpers = require('./lib/html-fetcher-helpers.js');

var fetcher = function(siteList){
  var urlArray = [];
  var downloaddir = path.join(__dirname, "/../data/sites/"); // tests will need to override this.
  siteList = siteList || path.join(__dirname, "/../data/sites.txt");

  helpers.readUrls(siteList,function(site){
    // console.log(site.split('\n'));
    urlArray = site.split('\n');
  });
  // console.log(urlArray);


  for(var i = 0; i<urlArray.length-1; i++){
    helpers.downloadUrls(urlArray[i], downloaddir);
  }
}();