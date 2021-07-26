// Last Modification : 2021.07.26
// by HYOSITIVE
// based on WEB5 - Passport_REWORK - 10

var express = require('express');
var router = express.Router(); // Router 메소드 호출 시 router라는 객체 return, main.js에서 express라는 모듈 자체는 app이라는 객체를 return
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

module.exports = function(passport) {
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
	
	// 사용자가 로그인을 전송했을 때, passport가 그 로그인 데이터를 처리하기 위한 코드
	// 세션 저장 전 리다이렉션을 방지하기 위해 로그인 성공 시 callback 함수를 호출해 명시적으로 세션 저장 후 리다이렉션
	// PM2, nodemon 등의 툴에서 watch 기능을 사용할 경우, 세션 파일 변경으로 서버가 재시작 될 수 있으므로, 명시적으로 sessions 디렉토리를 watch-ignore 해 준다.
	// function(param) {} === (param) => {}
	router.post('/login_process', // 인증 정보를 받는 경로
		passport.authenticate('local', {
			failureRedirect : '/auth/login',
			failureFlash: true	
		}) , (req, res) => {
			req.session.save( () => {
				res.redirect('/')
			})
	});
	
	router.get('/logout', function(request, response) {
		request.logout();
		// request.session.destroy(function(err) { // 안전한 로그아웃을 위해 세션 삭제
		// 	response.redirect('/');
		// });
		request.session.save(function(err) { // Egoing님도 살짝 헷갈리는 부분. 세션의 현재 상태 저장
			response.redirect('/');
		});
	});

	return router;
}