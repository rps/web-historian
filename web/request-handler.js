var path = require('path');
var url = require('url');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var defaultHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "Content-Type":"application/json",
  "access-control-max-age": 10 // Seconds.
};


var respond = function(statusCode,response){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, defaultHeaders);
  response.end(response);
};

module.exports.handleRequest = function (req, res) {
  console.log(exports.datadir);

  var routes = {
    '/': function(req){
      var pathname = url.parse(request.url).pathname;

      switch(req.method) {
        case 'GET':
          respond(200,JSON.stringify('GETx'));
          break;
        case 'POST':
          respond(200,JSON.stringify('POSTx'));
          break;
        case 'OPTIONS':
          respond(200,JSON.stringify('OPTIONSx'));
          break;
        default:
          respond(405,JSON.stringify("''"));
      }
    }
  };

  if(true){
    routes['/'];
  } else {
    respond(400,JSON.stringify("''"));
  }

};
