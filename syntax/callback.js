// Last Modification : 2021.01.17
// by HYOSITIVE
// based on WEB2 - Node.js - 28.3

/*
function a() {
    console.log('A');
}
*/

// 익명 함수. 변수의 값으로 함수를 정의함 (* 자바스크립트에서는 함수가 값이다.)
var a = function(){
    console.log('A');
}


function slowfunc(callback) {
    callback();
}

slowfunc(a);