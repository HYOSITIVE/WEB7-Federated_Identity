// Last Modification : 2021.04.14
// by HYOSITIVE
// based on WEB3 - Express - 10

var express = require('express')
var app = express()
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');
var compression = require('compression')
var template = require('./lib/template.js');
const port = 3000


// 애플리케이션은 요청이 들어올 때마다 bodyparser, compression middleware를 실행

// bodyparser : 전송한 정보를 자동으로 분석해주는 middleware
// app.use()안의 내용은 bodyParser가 만들어내는 middleware를 표현하는 표현식
app.use(bodyParser.urlencoded({ extended: false}));

// compression : 웹 서버에서 정보를 압축해 전송해주는 middleware
// compression()함수가 middleware를 return
app.use(compression());

// my middleware
// middleware의 함수는 request, response, next를 인자로 가짐
app.get('*', function(request, response, next){ // get 방식으로 들어오는 모든 요청에 대해
	fs.readdir('./data', function(error, filelist) {
		request.list = filelist; // 모든 route 안에서 request 객체의 list property를 통해 목록에 접근
		next(); // next에는 그 다음에 호출되어야 할 middleware 담김
	});
});

// route, routing : path에 따라 적당한 응답
app.get('/', function(request, response) { // 결국 Express의 모든 것이 middleware이다.
// 애플리케이션이 구동될 때, 순서대로 등록되어 있는 작은 프로그램들(middleware)이 실행됨.
	
// app.get('/', (req, res) => {res.send('Hello World!')}) : arrow function
	var title = 'Welcome';
	var description = 'Hello, Node.js';
	var list = template.list(request.list);
	var html = template.HTML(title, list,
		`<h2>${title}</h2>${description}`,
		`<a href="/create">create</a>`
	);
	response.send(html);
});

// page/ 뒤의 입력값이 pageId에 할당
app.get('/page/:pageId', function(request, response) {
	
	var	filteredId = path.parse(request.params.pageId).base;
	fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
		var title = request.params.pageId;
		var sanitizedTitle = sanitizeHtml(title);
		var sanitizedDescription = sanitizeHtml(description, {
			allowedTags:['h1']
		});
		var list = template.list(request.list);
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

app.get('/create', function(request, response) {
	var title = 'WEB - create';
	var list = template.list(request.list);
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


app.post('/create_process', function(request, response) {
	var post = request.body; // bodyParser가 내부적으로 작동. callback 함수의 request의 body property에 parsing한 내용을 저장
	console.log(post);
	var title = post.title;
	var description = post.description;
	fs.writeFile(`data/${title}`, description, 'utf-8', function(err) {
		response.writeHead(302, {Location: `/page/${title}`}); // redirection
		response.end();
	});
});

app.get('/update/:pageId', function(request, response) {
	var	filteredId = path.parse(request.params.pageId).base;			
	fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
		var title = request.params.pageId;
		var list = template.list(request.list);
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
			`<a href="/create">create</a> <a href="/update/${title}">update</a>`
		);
		response.send(html);
	});
});


app.post('/update_process', function(request, response) {
	var post = request.body;
	var id = post.id;
	var title = post.title;
	var description = post.description;
	// 기존 파일명(id), 새 파일명(title)을 활용해 파일명 변경. 내용 변경을 위해 callback 함수 호출
	fs.rename(`data/${id}`, `data/${title}`, function(error) {
		fs.writeFile(`data/${title}`, description, 'utf-8', function(err) {
			response.redirect(`page/${title}`)
		});
	});
});

app.post('/delete_process', function(request, response) {
	var post = request.body;
	var id = post.id;
	var	filteredId = path.parse(id).base;
	fs.unlink(`data/${filteredId}`, function(error) {
		response.redirect('/');
	});
});

app.listen(port, function() {console.log(`Example app listening at http://localhost:${port}`)});