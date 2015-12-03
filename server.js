var http = require('http');
var url = require('url');
var querystring = require('querystring');

var cache = [];

http.createServer(function(req, res) {
  	var query = url.parse(req.url).query;
	var params = querystring.parse(query);
	
	if(params['json']) {
		//Sample URL:
		//http://localhost:1337/?json={}&redir=http://final.com/{jsonUrl}
		
		var key = Math.round(Math.random() * 100000000);
		cache[key] = params.json;
		
		var retrievalUrl = 'http://armportaluiredirector.azurewebsites.net/?retrieve=' + key;
		retrievalUrl = encodeURI(retrievalUrl);
		
		var redir = params.redir;
		redir = redir.replace('{jsonUrl}', retrievalUrl);
		
		res.statusCode = 302;
  		res.setHeader('Location', redir);
  		res.end();
	}
	if(params['retrieve']) {
		var key = params.retrieve;
		var json = cache[key];
		res.end(cache[key]);
		//delete cache[key]; //test this
	}
}).listen(process.env.PORT || 1337);