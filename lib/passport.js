// Last Modification : 2021.07.26
// by HYOSITIVE
// based on WEB5 - Passport_REWORK - 10

module.exports = function(app) { // passport.js라는 모듈은 함수 자체

    var authData = {
        email:'hyositive_test@gmail.com',
        password:'111111',
        nickname:'hyositive'
    }

    var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize()); // express에 passport middleware 설치. express가 호출될 때마다 passport가 개입
    app.use(passport.session()); // passport 인증 시 session을 내부적으로 사용

    // 사용자가 로그인에 성공했을 때 1회만 호출되어 사용자 정보를 session store에 저장
    passport.serializeUser(function(user, done) {
        done(null, user.email); // done의 두 번째 인자로 사용자 식별자(이메일) 주입. 주입된 데이터는 세션 데이터에 저장
    });

    // 사용자가 페이지에 방문할 때마다 호출되어 사용자 정보 조회
    passport.deserializeUser(function(id, done) {
        // callback 함수의 첫 번째 인자로 세션 데이터로부터 식별자 주입(id)
        // 사용자 데이터가 저장된 곳(DB 또는 로컬)에서 실제 데이터 조회(authData)
        // 세션으로부터 받아 온 데이터(id)와 DB에 저장된 데이터(authData)를 비교, 사용자 유무 판별
        // 이 예제에서는 비교 과정 생략하고(사용자 존재한다고 가정), 바로 done의 두 번째 인자에 사용자 정보(authData) 주입
        done(null, authData);
    });

    passport.use(new LocalStrategy( // Form 데이터 도착 지점
        { // Passport는 기본적으로(default) Form 형식으로 username, password 데이터를 받는다. 이를 변경하려면 callback 함수 이전에 객체를 생성해 명시적으로 지정해주어야 한다.
            usernameField: 'email',
            passwordField: 'pwd'

        },
    function(username, password, done) { // done이 어떻게 호출되느냐에 따라 로그인 성공, 실패 여부를 판별
        if(username === authData.email) {
            if (password === authData.password) { // 로그인 성공 : done 함수에 사용자 정보
                return done(null, authData); // authData를 serializeUser의 callback 함수의 첫번째 인자로 주입
            }
            else { // 로그인 실패(이메일 일치, 패스워드 불일치) : done 함수에 false, 에러 메세지
                return done(null, false, { message: 'Incorrect password.' });
            }
        }
        else { // 로그인 실패(이메일 불일치) : done 함수의 두 번째 인자에 false, 에러 메세지
            return done(null, false, { message: 'Incorrect username.' });
        }
    }
    ));
    return passport;
}