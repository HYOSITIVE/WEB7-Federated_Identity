// Last Modification : 2021.07.28
// by HYOSITIVE
// based on WEB6 - MultiUserAuth - 10

const bcrypt = require('bcrypt');
const saltRounds = 10; // rounds값을 올릴수록 해킹에 걸리는 소요가 늘어남
const myPlaintextPassword = '111111';
const someOtherPlaintextPassword = '111112';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) { // myPlaintextPassword로 해시값 생성
    // Store hash in your password DB.
    console.log(hash);

    bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        console.log('my password', result);
    });

    bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
        console.log('other password', result);
    });
});