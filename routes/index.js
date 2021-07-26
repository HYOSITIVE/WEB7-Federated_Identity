// Last Modification : 2021.07.26
// by HYOSITIVE
// based on WEB5 - Passport_REWORK - 5.1

var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth.js');

// route, routing : path에 따라 적당한 응답
router.get('/', function(request, response) { // 결국 Express의 모든 것이 middleware이다.
// 애플리케이션이 구동될 때, 순서대로 등록되어 있는 작은 프로그램들(middleware)이 실행됨.
// app.get('/', (req, res) => {res.send('Hello World!')}) : arrow function
	console.log('/', request.user);
	var title = 'Welcome';
	var description = 'Hello, Node.js';
	var list = template.list(request.list);
	var html = template.HTML(title, list,
		`<h2>${title}</h2>${description}
		<img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;"></img>`,
		`<a href="/topic/create">create</a>`,
		auth.statusUI(request, response)
	);
	response.send(html);
});

module.exports = router;