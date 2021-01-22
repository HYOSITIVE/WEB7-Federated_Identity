// Last Modification : 2021.01.22
// by HYOSITIVE
// based on WEB2 - Node.js - 41

// JavaScript에서 함수는 구문(Statement)임과 동시에 값(Value)이다.
var f = function() {
    console.log(1+1);
    console.log(1+2);
}
console.log(f);
f();

// 함수는 배열의 원소가 될 수 있다.
var a = [f];
a[0]();

// 함수는 객체의 property가 될 수 있다.
var o = {
    func:f
}
o.func();