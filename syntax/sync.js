// Last Modification : 2021.01.17
// by HYOSITIVE
// based on WEB2 - Node.js - 28.2

var fs = require('fs');

// readFileSync (Synchronous)
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf-8');
console.log(result);
console.log('C');

// readFile (Asynchronous)
console.log('A');
// readFile은 파일을 읽은 뒤 세 번째 파라미터의 함수를 실행한다.
fs.readFile('syntax/sample.txt', 'utf-8', function(err, result) {
    console.log(result);
});
console.log('C');

/*
함수는 기본적으로 비동기이다. 즉, Nodejs는 비동기를 선호한다.
Nodejs를 이용해 프로그램의 성능을 끌어내기 위해서는 반드시 비동기로 작업해야 한다.
하지만 필요에 의해서 동기로 작업할 수도 있다.
*/