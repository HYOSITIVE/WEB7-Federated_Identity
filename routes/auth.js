// Last Modification : 2021.05.27
// by HYOSITIVE
// based on WEB4 - Express - Session & Auth - 6.1

var express = require('express');
var router = express.Router(); // Router 메소드 호출 시 router라는 객체 return, main.js에서 express라는 모듈 자체는 app이라는 객체를 return
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');


router.get('/login', function(request, response) {
	var title = 'WEB - login';
	var list = template.list(request.list);
	var html = template.HTML(title, list, `
		<form action="/auth/login_process" method="post">
			<p><input type ="text" name="email" placeholder="email"></p>
			<p><input type ="password" name="pwd" placeholder="password"></p>
			<p>
				<input type="submit" value="login">
			</p>
		</form>
	`, ''); // control이 존재하지 않기 때문에 argument에 공백 문자 입력
	response.send(html);
});

/*
router.get('/create', function(request, response) {
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

router.post('/create_process', function(request, response) {
	var post = request.body; // bodyParser가 내부적으로 작동. callback 함수의 request의 body property에 parsing한 내용을 저장
	console.log(post);
	var title = post.title;
	var description = post.description;
	fs.writeFile(`data/${title}`, description, 'utf-8', function(err) {
		response.redirect(`/topic/${title}`);
	});
});

router.get('/update/:pageId', function(request, response) {
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

router.post('/update_process', function(request, response) {
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

router.post('/delete_process', function(request, response) {
	var post = request.body;
	var id = post.id;
	var	filteredId = path.parse(id).base;
	fs.unlink(`data/${filteredId}`, function(error) {
		response.redirect('/');
	});
});

// 'topic'은 예약어로 사용되므로, /topic으로 접속했을 때에는 topic이라는 제목의 페이지를 탐색하지 않음
router.get('/:pageId', function(request, response, next) {
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
*/
module.exports = router;