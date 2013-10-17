#!/opt/boxen/nodenv/shims/node
// autorun node. find loc via 'which node'

var path = require('path');

var helpers = require('./lib/html-fetcher-helpers.js');

var fetcher = function(siteList){
  var urlArray = [];
  var downloaddir = path.join(__dirname, "/../data/sites/"); // tests will need to override this.
  siteList = siteList || path.join(__dirname, "/../data/sites.txt");

  helpers.readUrls(siteList,function(site){
    urlArray = site.split('\n');
  });

  for(var i = 0; i<urlArray.length-1; i++){
    helpers.downloadUrls(urlArray[i], downloaddir);
  }
}();

/*
open crontab editor: crontab -e
see current crontabs: crontab -l
end current crontab: crontab -r

open crontab editor in vi: VISUAL=vi crontab -e
  hit i to go into edit mode
  enter the cron info * * * * * [optional: path to executing program] fullpath
  hit esc
  type :wq (return)
*/