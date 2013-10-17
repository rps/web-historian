var handler = require("../web/request-handler");
var path = require('path');
handler.datadir = path.join(__dirname, "/testdata/sites.txt");
var stubs = require("./helpers/stubs");
var fs = require('fs');
var res;

// allows us to run tests async
function async(cb){
  waits(200);
  runs(cb);
}

beforeEach(function(){
  res = new stubs.Response();
});

describe("Node Server Request Listener Function", function() {

  // GET / -- serve up the HTML
  it("Should answer GET requests for /", function() {
    var req = new stubs.Request("/", "GET");
    handler.handleRequest(req, res);
    async(function(){
      expect(res._responseCode).toEqual(200);
      expect(res._data).toMatch(/<input/); // the resulting html should have an input tag
      expect(res._ended).toEqual(true);
    });
  });

  // GET /website -- respond with the website HTML
  it("Should answer GET requests for archived websites", function() {
    var fixtureName = "www.google.com";
    var req = new stubs.Request("/" + fixtureName, "GET");
    handler.handleRequest(req, res);
    async(function(){
      expect(res._responseCode).toEqual(200);
      expect(res._data).toMatch(/google/); // the resulting html should have the text "google"
      expect(res._ended).toEqual(true);
    });
  });

  // POST /website -- save the site
  it("Should accept posts to /", function() {
    fs.writeFileSync(handler.datadir, ""); // reset the test file

    var url = "www.example.com";
    var req = new stubs.Request("/", "POST", {url: url});

    handler.handleRequest(req, res);
    console.log('datadir', handler.datadir);

    var fileContents = fs.readFileSync(handler.datadir);

    expect(fileContents.toString()).toEqual(url + "\n");
    expect(res._responseCode).toEqual(201);
    expect(res._ended).toEqual(true);

  });

  // GET /website nofile -- 404
  it("Should 404 when asked for a nonexistent file", function() {
    var req = new stubs.Request("/arglebargle", "GET");
    handler.handleRequest(req, res);
    async(function() {
      expect(res._responseCode).toEqual(404);
      expect(res._ended).toEqual(true);
    });
  });

});
