// Last Modification : 2021.05.27
// by HYOSITIVE
// based on WEB4 - Express - Session & Auth - 5

var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var app = express()

app.use(session({
  secret: 'keyboard cat', // 타인에게 유출하면 안됨. 실제 구현 시 변수처리하거나 외부에서 지정
  resave: false, // 세션 데이터가 바뀌기 전까지는 세션 저장소에 값을 저장하지 않는다
  saveUninitialized: true, // 세션이 필요하기 전까지는 세션을 구동시키지 않는다
	store:new FileStore()
}))

app.get('/', function (req, res, next) {
	console.log(req.session);  // 세션은 내부적으로 request 객체의 property로 session이라는 객체를 추가
	if (req.session.num === undefined) {
		req.session.num = 1;
	} else {
		req.session.num = req.session.num + 1;
	}
  res.send(`Views : ${req.session.num}`); // session middleware는 내부적으로 session store(세션 저장소)에 num이라는 변수 저장. 세션은 메모리에 저장되어 휘발성이 있음
})

app.listen(3000, function() {
	console.log('3000!')
});