// Last Modification : 2021.01.16
// by HYOSITIVE
// based on WEB2 - Node.js - 23

// 파일 목록을 알아내는 함수 readdir 사용

var testFolder = './data';
/*
파일 경로는 현재 프로그램이 실행되는 위치 기준
main.js와 data 폴더 모두 최상위 경로에 위치
./는 현재 경로라는 뜻
*/
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist) {
	console.log(filelist);
})
// readdir 함수는 filelist를 배열화함