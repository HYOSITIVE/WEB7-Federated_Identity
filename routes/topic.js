// Last Modification : 2021.07.28
// by HYOSITIVE
// based on WEB6 - MultiUserAuth - 9

var express = require('express');
var router = express.Router(); // Router 메소드 호출 시 router라는 객체 return, main.js에서 express라는 모듈 자체는 app이라는 객체를 return
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var auth = require('../lib/auth.js');
var db = require('../lib/db');
var shortid = require('shortid');

router.get('/create', function(request, response) {
	if(!auth.isOwner(request, response)) {
		response.redirect('/'); // 홈으로 튕기기
		return false;
	}
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
	`, '', auth.statusUI(request, response)); // control이 존재하지 않기 때문에 argument에 공백 문자 입력
	response.send(html);
});

router.post('/create_process', function(request, response) {
	if(!auth.isOwner(request, response)) {
		response.redirect('/'); // 홈으로 튕기기
		return false;
	}
	var post = request.body; // bodyParser가 내부적으로 작동. callback 함수의 request의 body property에 parsing한 내용을 저장
	var title = post.title;
	var description = post.description;
	var id = shortid.generate();
	db.get('topics').push({ // 데이터를 DB에 저장
		id:id,
		title:title,
		description:description,
		user_id:request.user.id
	}).write();
	response.redirect(`/topic/${id}`);
});

router.get('/update/:pageId', function(request, response) {
	if(!auth.isOwner(request, response)) {
		response.redirect('/'); // 홈으로 튕기기
		return false;
	}
	var topic = db.get('topics').find({id:request.params.pageId}).value(); // 해당 topic의 상세정보를 DB에서 받아옴
	if (topic.user_id !== request.user.id) { // 작성자가 아닌 사람이 수정을 시도할 경우
		// 에러 메세지
		return response.redirect('/'); // 홈으로 튕기기
	}
	var title = topic.title;
	var description = topic.description;
	var list = template.list(request.list);
	var html = template.HTML(title, list,
		`
		<form action="/topic/update_process" method="post">
			<input type="hidden" name="id" value="${topic.id}">
			<p><input type ="text" name="title" placeholder="title" value="${title}"></p>
			<p>
				<textarea name="description" placeholder="description">${description}</textarea>
			</p>
			<p>
				<input type="submit">
			</p>
		</form>
		`,
		`<a href="/topic/create">create</a> <a href="/topic/update/${topic.id}">update</a>`,
		auth.statusUI(request, response)
	);
	response.send(html);
});

router.post('/update_process', function(request, response) {
	if(!auth.isOwner(request, response)) {
		response.redirect('/'); // 홈으로 튕기기
		return false;
	}
	var post = request.body;
	var id = post.id;
	var title = post.title;
	var description = post.description;
	var topic = db.get('topics').find({id:id}).value();
	if (topic.user_id !== request.user.id) { // 작성자가 아닌 사람이 수정을 시도할 경우
		// 에러 메세지
		return response.redirect('/'); // 홈으로 튕기기
	}
	// 접근 제어 상에 문제가 없을 경우
	db.get('topics').find({id:id}).assign({
		title:title, description:description
	}).write();
	response.redirect(`/topic/${topic.id}`);

	// 기존 파일명(id), 새 파일명(title)을 활용해 파일명 변경. 내용 변경을 위해 callback 함수 호출
	// fs.rename(`data/${id}`, `data/${title}`, function(error) {
	// 	fs.writeFile(`data/${title}`, description, 'utf-8', function(err) {
	// 		response.redirect(`/topic/${title}`)
	// 	});
	// });
});

router.post('/delete_process', function(request, response) {
	if(!auth.isOwner(request, response)) {
		response.redirect('/'); // 홈으로 튕기기
		return false;
	}
	var post = request.body;
	var id = post.id;
	var	filteredId = path.parse(id).base;
	fs.unlink(`data/${filteredId}`, function(error) {
		response.redirect('/');
	});
});

router.get('/:pageId', function(request, response, next) {
	var topic = db.get('topics').find({id:request.params.pageId}).value();
	var user = db.get('users').find({id:topic.user_id}).value();
	var sanitizedTitle = sanitizeHtml(topic.title);
	var sanitizedDescription = sanitizeHtml(topic.description, {
		allowedTags:['h1']
	});
	var list = template.list(request.list);
	var html = template.HTML(sanitizedTitle, list,
		`
		<h2>${sanitizedTitle}</h2>
		${sanitizedDescription}
		<p>by ${user.displayName}</p>`,
		` <a href="/topic/create">create</a>
			<a href="/topic/update/${topic.id}">update</a>
			<form action="/topic/delete_process" method="post">
			<input type="hidden" name="id" value="${sanitizedTitle}">
			<input type="submit" value="delete">			
			</form>`,
			auth.statusUI(request, response)
	);
	response.send(html)
});

module.exports = router;