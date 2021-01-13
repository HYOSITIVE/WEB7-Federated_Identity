var testFolder = './data';
// 파일 경로는 현재 프로그램이 실행되는 위치 기준
// ./는 현재 경로라는 뜻
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist) {
	console.log(filelist);
})