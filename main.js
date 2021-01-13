var http = require('http');
var fs = require('fs');
var url = require('url');
// 'http', 'fs', 'url'은 모듈 (Node.js가 가지고 있는 수많은 기능들을 비슷한 것끼리 그룹핑한 것)이라고 한다.

var app = http.createServer(function(request,response){
    var _url = request.url;
	// query string의 값이 request.url에 들어감
	// console.log(_url); : 출력 시 ?id=HTML 과 같은 값 출력
	var queryData = url.parse(_url, true).query;
	// url parsing을 통해 원하는 query string 데이터 획득. queryData에 들어있는 값은 객체 형태
	// console.log(queryData.id); : 출력 시 queryData의 id값을 출력
	/*
	console.log(url.parse(_url, true));
	위의 코드 실행 시 url에 대한 정보를 분석해 콘솔에 표시
	 - path : queryString 포함
	 - pathname : querySting을 제외한 path만을 포함
	*/
	var pathname = url.parse(_url, true).pathname;
	
	// root, 즉 path가 없는 경로로 접속했을 때 - 정상 접속
	if (pathname === '/') {
		if(queryData.id === undefined) {
			fs.readdir('./data', function(error, filelist) {
				var title = 'Welcome';
				var description = 'Hello, Node.js';
				var list = '<ul>';
				var i = 0;
				while(i < filelist.length) {
					list = list + `<li><a
					href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
					i = i + 1;
				}
				list = list + '</ul>';
				var template = `
				<!doctype html>
				<html>
				<head>
				  <title>WEB1 - ${title}</title>
				  <meta charset="utf-8">
				</head>
				<body>
				  <h1><a href="/">WEB</a></h1>
				  ${list}
				  <h2>${title}</h2>
				  <p>${description}</p>
				</body>
				</html>
				`;
				response.writeHead(200); // 200 : 파일을 정상적으로 전송했다.
				// console.log(__dirname + _url); : 디렉토리와 query string의 값 출력
				// response.end(fs.readFileSync(__dirname + _url)); : 사용자가 접근할 때마다 파일을 읽음
				response.end(template);
			});
			
		} else {
			fs.readdir('./data', function(error, filelist) {
				var title = 'Welcome';
				var description = 'Hello, Node.js';
				var list = '<ul>';
				var i = 0;
				while(i < filelist.length) {
					list = list + `<li><a
					href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
					i = i + 1;
				}
				list = list + '</ul>';
				fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
					var title = queryData.id;
					var template = `
					<!doctype html>
					<html>
					<head>
					  <title>WEB1 - ${title}</title>
					  <meta charset="utf-8">
					</head>
					<body>
					  <h1><a href="/">WEB</a></h1>
					  ${list}
					  <h2>${title}</h2>
					  <p>${description}</p>
					</body>
					</html>
					`;
					response.writeHead(200); // 200 : 파일을 정상적으로 전송했다.
					// console.log(__dirname + _url); : 디렉토리와 query string의 값 출력
					// response.end(fs.readFileSync(__dirname + _url)); : 사용자가 접근할 때마다 파일을 읽음
					response.end(template);
				});
			});
		}	
	// 그 외의 경로로 접속했을 때 - 에러
	} else {
		response.writeHead(404); // 404 : 파일을 찾을 수 없다.
		response.end('Not found');
	}
	
});
app.listen(3000);