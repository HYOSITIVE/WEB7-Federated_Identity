// Last Modification : 2021.04.03
// by HYOSITIVE
// based on WEB3 - Express - 5.2

var express = require('express')
var app = express()
var fs = require('fs');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
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

// page/ 뒤의 입력값이 pageId에 할당
app.get('/page/:pageId', function(request, response) {
	fs.readdir('./data', function(error, filelist) {
		var	filteredId = path.parse(request.params.pageId).base;
		fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
			var title = request.params.pageId;
			var sanitizedTitle = sanitizeHtml(title);
			var sanitizedDescription = sanitizeHtml(description, {
				allowedTags:['h1']
			});
			var list = template.list(filelist);
			var html = template.HTML(sanitizedTitle, list,
				`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
				` <a href="/create">create</a>
				  <a href="/update?id=${sanitizedTitle}">update</a>
				  <form action="delete_process" method="post">
					  <input type="hidden" name="id" value="${sanitizedTitle}">
					  <input type="submit" value="delete">			
				  </form>`
			);
			response.send(html);
		});
	});
});

app.listen(port, function() {console.log(`Example app listening at http://localhost:${port}`)});