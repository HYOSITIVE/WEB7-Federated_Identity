// Last Modification : 2021.08.02
// by HYOSITIVE
// based on WEB7 - Passport_Google - 6.2

var db = require('../lib/db');
const bcrypt = require('bcrypt');
var shortid = require('shortid');
const { request } = require('express');

module.exports = function(app) { // passport.js라는 모듈은 함수 자체
    var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    app.use(passport.initialize()); // express에 passport middleware 설치. express가 호출될 때마다 passport가 개입
    app.use(passport.session()); // passport 인증 시 session을 내부적으로 사용

    // 사용자가 로그인에 성공했을 때 1회만 호출되어 사용자 정보를 session store에 저장
    passport.serializeUser(function(user, done) {
        console.log('serializeUser', user);
        done(null, user.id); // done의 두 번째 인자로 사용자 식별자(id) 주입. 주입된 데이터는 세션 데이터에 저장
    });

    // 사용자가 페이지에 방문할 때마다 호출되어 사용자 정보 조회
    passport.deserializeUser(function(id, done) {
        // callback 함수의 첫 번째 인자로 세션 데이터로부터 식별자 주입(id)
        // 사용자 데이터가 저장된 곳(db.json)에서 실제 데이터 조회
        // 세션으로부터 받아 온 데이터(id)와 DB에 저장된 데이터를 비교, 사용자 유무 판별
        var user = db.get('users').find({id:id}).value();
        console.log('deserializeUser', id, user);
        done(null, user);
    });

    passport.use(new LocalStrategy( // Form 데이터 도착 지점
        { // Passport는 기본적으로(default) Form 형식으로 username, password 데이터를 받는다. 이를 변경하려면 callback 함수 이전에 객체를 생성해 명시적으로 지정해주어야 한다.
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function(email, password, done) { // done이 어떻게 호출되느냐에 따라 로그인 성공, 실패 여부를 판별
            console.log('LocalStrategy', email, password);
            var user = db.get('users').find({ // DB에서 유저 값 탐색
                email:email
            }).value();

            // 로그인 매커니즘 간소화(이메일, 패스워드 불일치 구현하지 않음)
            if (user) { // 유저가 존재할 경우 (이메일 일치)
                bcrypt.compare(password, user.password, function(err, result) {
                    if (result) { // DB에 저장된 해시된 비밀번호와 사용자가 입력한 비밀번호의 해시값이 일치할 경우 (로그인 성공)
                        return done(null, user); // user를 serializeUser의 callback 함수의 첫번째 인자로 주입
                    }
                    else { // DB에 저장된 해시된 비밀번호와 사용자가 입력한 비밀번호의 해시값이 일치하지 않을 경우 (로그인 실패)
                        return done(null, false, {message : 'Wrong password!'});
                    }
                });
            }
            else { // 유저가 존재하지 않을 경우 (이메일 불일치)
                return done(null, false, {message : "User doesn't exists!"});
            }
        }
    ));

    var googleCredentials = require('../config/google.json');
    passport.use(new GoogleStrategy({
        clientID: googleCredentials.web.client_id,
        clientSecret: googleCredentials.web.client_secret,
        callbackURL: googleCredentials.web.redirect_uris[0]
      },
    function(accessToken, refreshToken, profile, done) {
        console.log('GoogleStrategy', accessToken, refreshToken, profile);
        var email = profile.emails[0].value; // 구글 API로부터 받아 온 사용자 이메일
        var user = db.get('users').find({email:email}).value(); // 기존 사용자 중 같은 이메일 존재하는지 탐색
        if (user) {
            user.googleId = profile.id; // 사용자 정보에 구글ID 추가
            db.get('users').find({id:user.id}).assign(user).write(); // DB에 저장
        }
        else {
            user = {
                id:shortid.generate(),
                email:email,
                displayName:profile.displayName,
                googleId:profile.id
            }
            db.get('users').push(user).write();
            request.session.save(); // 세션 데이터 명시적 저장
        }
        done(null, user);
      }
    ));

    // 사용자가 리소스 서버로 인증을 하러 갈 때 필요한 주소를 만들어주는 코드
    app.get('/auth/google',
        passport.authenticate('google', {
            // scope : 우리가 사용자에게 요청 할 리소스 서버의 기능들. 따로 API 사용 설정을 해 주어야 한다.
            scope: ['https://www.googleapis.com/auth/plus.login', 'email']
        })
    );

    app.get('/auth/google/callback', 
        passport.authenticate('google', {
            failureRedirect: '/auth/login'
        }),
        function(req, res) {
            res.redirect('/');
        }
    );

    return passport;
}