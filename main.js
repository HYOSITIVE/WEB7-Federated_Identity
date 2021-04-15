// Last Modification : 2021.04.15
// by HYOSITIVE
// based on WEB3 - Express - 14.1

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

app.use(express.static('public')); // public directory 안에서 static file을 찾겠다는 의미. public 폴더 안의 파일은 url을 통해 접근 가능

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
		`<h2>${title}</h2>${description}
		<img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;"></img>`,
		`<a href="/topic/create">create</a>`
	);
	response.send(html);
});

app.get('/topic/create', function(request, response) {
	var title = 'WEB - create';
	var list = template.list(request.list);
	var html = template.HTML(title, list, `
		<form action="/topic/create_process" method="post">
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

app.post('/topic/create_process', function(request, response) {
	var post = request.body; // bodyParser가 내부적으로 작동. callback 함수의 request의 body property에 parsing한 내용을 저장
	console.log(post);
	var title = post.title;
	var description = post.description;
	fs.writeFile(`data/${title}`, description, 'utf-8', function(err) {
		response.redirect(`/topic/${title}`);
	});
});

app.get('/topic/update/:pageId', function(request, response) {
	var	filteredId = path.parse(request.params.pageId).base;			
	fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
		var title = request.params.pageId;
		var list = template.list(request.list);
		var html = template.HTML(title, list,
			`
			<form action="/topic/update_process" method="post">
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
			`<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
		);
		response.send(html);
	});
});

app.post('/topic/update_process', function(request, response) {
	var post = request.body;
	var id = post.id;
	var title = post.title;
	var description = post.description;
	// 기존 파일명(id), 새 파일명(title)을 활용해 파일명 변경. 내용 변경을 위해 callback 함수 호출
	fs.rename(`data/${id}`, `data/${title}`, function(error) {
		fs.writeFile(`data/${title}`, description, 'utf-8', function(err) {
			response.redirect(`/topic/${title}`)
		});
	});
});

app.post('/topic/delete_process', function(request, response) {
	var post = request.body;
	var id = post.id;
	var	filteredId = path.parse(id).base;
	fs.unlink(`data/${filteredId}`, function(error) {
		response.redirect('/');
	});
});

// 'topic'은 예약어로 사용되므로, /topic으로 접속했을 때에는 topic이라는 제목의 페이지를 탐색하지 않음
app.get('/topic/:pageId', function(request, response, next) {
	var	filteredId = path.parse(request.params.pageId).base;
	fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
		if (err) {
			next(err);
		}
		else {
			var title = request.params.pageId;
			var sanitizedTitle = sanitizeHtml(title);
			var sanitizedDescription = sanitizeHtml(description, {
				allowedTags:['h1']
			});
			var list = template.list(request.list);
			var html = template.HTML(sanitizedTitle, list,
				`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
				` <a href="/topic/create">create</a>
			  	<a href="/topic/update/${sanitizedTitle}">update</a>
			  	<form action="/topic/delete_process" method="post">
				  <input type="hidden" name="id" value="${sanitizedTitle}">
				  <input type="submit" value="delete">			
				</form>`
			);
			response.send(html);	
		}
	});
});

app.use(function(req, res, next) { // 404 에러 처리 middleware
	res.status(404).send('Sorry cant find that!');	
});

app.use(function(err, req, res, next) { // 4개의 인자를 가진 함수는 Express에서 Error Handler middleware로 지정 
	console.error(err.stack);
	res.status(500).send('Something broke!');
})

app.listen(port, function() {console.log(`Example app listening at http://localhost:${port}`)});