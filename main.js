// Last Modification : 2021.04.03
// by HYOSITIVE
// based on WEB3 - Express - 8

var express = require('express')
var app = express()
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
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
				  <a href="/update/${sanitizedTitle}">update</a>
				  <form action="/delete_process" method="post">
					  <input type="hidden" name="id" value="${sanitizedTitle}">
					  <input type="submit" value="delete">			
				  </form>`
			);
			response.send(html);
		});
	});
});

app.get('/create', function(request, response) {
	fs.readdir('./data', function(error, filelist) {
		var title = 'WEB - create';
		var list = template.list(filelist);
		var html = template.HTML(title, list, `
			<form action="/create_process" method="post">
				<p><input type ="text" name="title" placeholder="title"></p>
				<p>
					<textarea name="description" placeholder="description"></textarea>
				</p>
				<p>
					<input type="submit">
				</p>
			</form>
		`, ''); // control이 존재하지 않기 때문에 argument에 공백 문자 입력
		response.send(html);
	});
});


app.post('/create_process', function(request, response) {
	var body = '';
	request.on('data', function(data) {
		body = body + data;
	});
		
	request.on('end', function() {
		var post = qs.parse(body);
		var title = post.title;
		var description = post.description;
		fs.writeFile(`data/${title}`, description, 'utf-8', function(err) {
			response.writeHead(302, {Location: `/page/${title}`}); // redirection
			response.end();
		});
	});
});

app.get('/update/:pageId', function(request, response) {
	fs.readdir('./data', function(error, filelist) {
		var	filteredId = path.parse(request.params.pageId).base;			
		fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
			var title = request.params.pageId;
			var list = template.list(filelist);
			var html = template.HTML(title, list,
				`
				<form action="/update_process" method="post">
					<input type="hidden" name="id" value="${title}">
					<p><input type ="text" name="title" placeholder="title" value="${title}"></p>
					<p>
						<textarea name="description" placeholder="description">${description}</textarea>
					</p>
					<p>
						<input type="submit">
					</p>
				</form>
				`,
				`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
			);
			response.send(html);
		});
	});
});


app.post('/update_process', function(request, response) {
	var body = '';
	request.on('data', function(data) {
		body = body + data;
	});
	request.on('end', function() {
		var post = qs.parse(body);
		var id = post.id;
		var title = post.title;
		var description = post.description;
		// 기존 파일명(id), 새 파일명(title)을 활용해 파일명 변경. 내용 변경을 위해 callback 함수 호출
		fs.rename(`data/${id}`, `data/${title}`, function(error) {
			fs.writeFile(`data/${title}`, description, 'utf-8', function(err) {
				response.redirect(`/?id=${title}`)
			});
		});
	});
});

app.post('delete_process', function(request, response) {
	var body = '';
	request.on('data', function(data) {
		body = body + data;
	});
	request.on('end', function() {
		var post = qs.parse(body);
		var id = post.id;
		var	filteredId = path.parse(id).base;
		fs.unlink(`data/${filteredId}`, function(error) {
			response.redirect('/');
		})
	});
});

app.listen(port, function() {console.log(`Example app listening at http://localhost:${port}`)});