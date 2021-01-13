var fs = require('fs');
fs.readFile('sample.txt', 'utf-8', function(err, data) {
	console.log(data);
});

// 코드 실행 전에 cd를 통해 txt 파일이 있는 파일 경로로 이동해야 함