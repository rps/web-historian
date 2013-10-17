var path = require('path');
var url = require('url');
var fs = require('fs');

module.exports.datadir = path.join(__dirname, "/../data/sites.txt"); // tests will need to override this.

var defaultHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var respond = function(statusCode,response,data,datatype){
  datatype = datatype || 'text/html';
  defaultHeaders['Content-Type'] = datatype;
  response.writeHead(statusCode, defaultHeaders);
  response.end(data);
};

module.exports.handleRequest = function (request, response) {
  var pathname = url.parse(request.url).pathname;

  var routes = {

    'GET': function(url){
      var isPublicFile = url === 'styles.css' || !url.length;
      url = url || 'index.html';
      var fileLoc = isPublicFile ? path.join(__dirname, "/public/",url) : path.join(__dirname, "../data/sites/", url);
      fs.exists(fileLoc, function(exists){
        if(exists){
          fs.readFile(fileLoc, 'utf8', function(err,fileData){
            if(err){
              console.log(err);
            } else if (url === 'styles.css'){
              respond(200,response,fileData,'text/css');
            } else {
              respond(200,response,fileData);
            }
          });
        } else {
          respond(404,response,'File Not Found');
        }
      });
    },

    'POST': function(url){
      var fullBody = '';
      request.on('data',function(data){
        fullBody += data;
      });
      request.on('end',function(){
        if (!fullBody.length){
          respond(400, response, 'No File To Append');
        } else {
          var toSave = fullBody.slice(4);
          fs.appendFileSync(module.exports.datadir, toSave + "\n");
          respond(201, response, toSave);
        }
      });
    },

    'OPTIONS': function(){
      respond(200,response,'""');
    }
  };

  if(routes[request.method]){
    routes[request.method](pathname.slice(1));
  } else {
    respond(405,response,'""');
  }
};
