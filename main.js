// Last Modification : 2021.07.26
// by HYOSITIVE
// based on WEB5 - Passport_REWORK - 4.2

const port = 3000
var express = require('express')
var app = express()
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
app.use(helmet());
var session = require('express-session')
var FileStore = require('session-file-store')(session) // 실제로는 데이터베이스에 저장하는 것이 바람직함

app.use(express.static('public')); // public directory 안에서 static file을 찾겠다는 의미. public 폴더 안의 파일은 url을 통해 접근 가능

// 애플리케이션은 요청이 들어올 때마다 bodyparser, compression middleware를 실행

// bodyparser : 전송한 정보를 자동으로 분석해주는 middleware
// app.use()안의 내용은 bodyParser가 만들어내는 middleware를 표현하는 표현식
app.use(bodyParser.urlencoded({ extended: false}));

// compression : 웹 서버에서 정보를 압축해 전송해주는 middleware
// compression()함수가 middleware를 return
app.use(compression());

app.use(session({ // session middleware
  secret: 'keyboard cat', // 타인에게 유출하면 안됨. 실제 구현 시 변수처리하거나 외부에서 지정
  resave: false, // 세션 데이터가 바뀌기 전까지는 세션 저장소에 값을 저장하지 않는다
  saveUninitialized: true, // 세션이 필요하기 전까지는 세션을 구동시키지 않는다
	store:new FileStore()
}))

var authData = {
	email:'hyositive_test@gmail.com',
	password:'111111',
	nickname:'hyositive'
}

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy( // Form 데이터 도착지점
	{ // Passport는 기본적으로(default) Form 형식으로 username, password 데이터를 받는다. 이를 변경하려면 callback 함수 이전에 객체를 생성해 명시적으로 지정해주어야 한다.
		usernameField: 'email',
		passwordField: 'pwd'

	},
  function(username, password, done) { // done이 어떻게 호출되느냐에 따라 로그인 성공, 실패 여부를 판별
	  console.log('LocalStrategy', username, password);
	  if(username === authData.email) {
		  console.log(1);
		  if (password === authData.password) { // 로그인 성공 : done 함수에 사용자 정보
			console.log(2);
			return done(null, user);
		  }
		  else { // 로그인 실패(이메일 일치, 패스워드 불일치) : done 함수에 false, 에러 메세지
			console.log(3);
			return done(null, false, { message: 'Incorrect password.' });
		  }
	  }
	  else { // 로그인 실패(이메일 불일치) : done 함수의 두 번째 인자에 false, 에러 메세지
		console.log(4);
		return done(null, false, { message: 'Incorrect username.' });
	  }
  }
));

app.post('/auth/login_process', // 인증 정보를 받는 경로
passport.authenticate('local', { // Passport에서 제공하는 API. passport.authenticate가 callback 함수 역할
	// 로그인 성공/실패에 따라 리다이렉션. 로그인 후 추가적인 기능이 필요하다면 passport에서 제공하는 다른 API 사용할 수 있다.
	successRedirect: '/',
    failureRedirect: '/auth/login'
}));

// my middleware
// middleware의 함수는 request, response, next를 인자로 가짐
app.get('*', function(request, response, next){ // get 방식으로 들어오는 모든 요청에 대해
	fs.readdir('./data', function(error, filelist) {
		request.list = filelist; // 모든 route 안에서 request 객체의 list property를 통해 목록에 접근
		next(); // next에는 그 다음에 호출되어야 할 middleware 담김
	});
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/topic', topicRouter); // /topic으로 시작하는 주소들에게 topicRouter라는 middleware를 적용
// 이렇게 사용할 경우, topicRouter middleware에서 'topic' 경로를 다시 알려줄 필요 없음
app.use('/auth', authRouter);

app.use(function(req, res, next) { // 404 에러 처리 middleware
	res.status(404).send('Sorry cant find that!');	
});

app.use(function(err, req, res, next) { // 4개의 인자를 가진 함수는 Express에서 Error Handler middleware로 지정 
	console.error(err.stack);
	res.status(500).send('Something broke!');
})

app.listen(port, function() {console.log(`Example app listening at http://localhost:${port}`)});