// Last Modification : 2021.05.30
// by HYOSITIVE
// based on WEB4 - Express - Session & Auth - 6.4

var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');

function authIsOwner(request, response) {
	if (request.session.is_logined) { // 로그인 성공
		return true;
	}
	else { // 로그인 실패
		return false;
	}
}

function authStatusUI(request, response) {
	var authStatusUI = '<a href="/auth/login">login</a>' // 로그인 되지 않았을 때
	if (authIsOwner(request, response)) { // 로그인 되었을 때
		authStatusUI = `${request.session.nickname} | <a href="/auth/logout">logout</a>`; 
	}
	return authStatusUI;
}

// route, routing : path에 따라 적당한 응답
router.get('/', function(request, response) { // 결국 Express의 모든 것이 middleware이다.
// 애플리케이션이 구동될 때, 순서대로 등록되어 있는 작은 프로그램들(middleware)이 실행됨.
// app.get('/', (req, res) => {res.send('Hello World!')}) : arrow function
	var title = 'Welcome';
	var description = 'Hello, Node.js';
	var list = template.list(request.list);
	var html = template.HTML(title, list,
		`<h2>${title}</h2>${description}
		<img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;"></img>`,
		`<a href="/topic/create">create</a>`,
		authStatusUI(request, response)
	);
	response.send(html);
});

module.exports = router;