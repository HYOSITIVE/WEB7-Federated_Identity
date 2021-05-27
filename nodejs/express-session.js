// Last Modification : 2021.05.27
// by HYOSITIVE
// based on WEB4 - Express - Session & Auth - 3

var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')

var app = express()

app.use(session({
  secret: 'keyboard cat', // 타인에게 유출하면 안됨. 실제 구현 시 변수처리하거나 외부에서 지정
  resave: false, // 세션 데이터가 바뀌기 전까지는 세션 저장소에 값을 저장하지 않는다
  saveUninitialized: true // 세션이 필요하기 전까지는 세션을 구동시키지 않는다
}))

app.get('/', function (req, res, next) {
  res.send('Hello session');
})

app.listen(3000, function() {
	console.log('3000!')
});