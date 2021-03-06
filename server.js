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
		
		var json = '';
		
		if(req.method === 'POST') {
			req.on('data', function (chunk) {
				json += chunk;
			});
			
			req.on('end', function() {
				console.log('Received JSON via POST: ' +  json);
				var retrievalUrl = handleStoreRequest(json);
				//res.statusCode = 200;
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
				res.end(retrievalUrl);
			});
		} else if(req.method === 'OPTIONS') {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
			res.end();
		} else {
			json = params.json;
			
			console.log('Received JSON via GET: ' +  json);
			var retrievalUrl = handleStoreRequest(json);
			
			var redir = params.redir;
			redir = redir.replace('{jsonUrl}', retrievalUrl);
	
			res.statusCode = 302;
			res.setHeader('Location', redir);
			res.end();
		}
	} else if(params['retrieve']) {
		var key = params.retrieve;
		var json = cache[key];
		res.end(cache[key]);
		delete cache[key];
	}
}).listen(process.env.PORT || 1337);

function handleStoreRequest(json) {
	var key = Math.round(Math.random() * 100000000);
	cache[key] = json;
	
	var retrievalUrl = 'http://armportaluiredirector.azurewebsites.net/?retrieve=' + key;
	retrievalUrl = encodeURIComponent(retrievalUrl);
	
	return retrievalUrl;
}