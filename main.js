// Last Modification : 2021.04.03
// by HYOSITIVE
// based on WEB3 - Express - 4

var express = require('express')
var app = express()
var fs = require('fs');
var template = require('./lib/template.js');
const port = 3000

// route, routing : path에 따라 적당한 응답
// app.get('/', (req, res) => {res.send('Hello World!')})
app.get('/', function(request, response) {
	fs.readdir('./data', function(error, filelist) {
		var title = 'Welcome';
		var description = 'Hello, Node.js';
		var list = template.list(filelist);
		var html = template.HTML(title, list,
			`<h2>${title}</h2>${description}`,
			`<a href="/create">create</a>`
		);
		response.send(html);
	});
});

app.get('/page', function(req, res) {
	return res.send('/page')
});

app.listen(port, function() {console.log(`Example app listening at http://localhost:${port}`)});