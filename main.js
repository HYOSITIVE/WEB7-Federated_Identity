// Last Modification : 2021.01.18
// by HYOSITIVE
// based on WEB2 - Node.js - 34

var http = require('http');
var fs = require('fs');
var url = require('url'); // url이라는 모듈은 url이라는 변수를 통해 사용할 것이다.
// 'http', 'fs', 'url'은 모듈 (Node.js가 가지고 있는 수많은 기능들을 비슷한 것끼리 그룹핑한 것)이라고 한다.
var qs = require('querystring');

function templateHTML(title, list, body, control) { // update 기능을 위해 control이라는 parameter 추가
	return `
	<!doctype html>
	<html>
	<head>
	  <title>WEB1 - ${title}</title>
	  <meta charset="utf-8">
	</head>
	<body>
	  <h1><a href="/">WEB</a></h1>
	  ${list}
	  ${control}
	  ${body}
	</body>
	</html>
	`;
}

function templateList(filelist) {
	// filelist를 활용해 list 자동 생성
	var list = '<ul>';
	var i = 0;
	while(i < filelist.length) {
		list = list + `<li><a
		href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
		i = i + 1;
	}
	list = list + '</ul>';
	return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
	/*
	query string의 값이 request.url에 들어감
	console.log(_url); : 출력 시 /?id=HTML 과 같은 값 출력
	*/

	var queryData = url.parse(_url, true).query;
	/*
	url parsing을 통해 원하는 query string 데이터 획득. queryData에 들어있는 값은 객체 형태
	console.log(queryData.id); : 출력 시 queryData의 id값을 출력
	console.log(url.parse(_url, true)); : 위의 코드 실행 시 url에 대한 정보를 분석해 콘솔에 표시
	 - path : queryString 포함
	 - pathname : querySting을 제외한 path만을 포함
	*/

	var pathname = url.parse(_url, true).pathname;
	
	// root, 즉 path가 없는 경로로 접속했을 때 - 정상 접속
	if (pathname === '/') {
		if(queryData.id === undefined) { // 메인 페이지
			fs.readdir('./data', function(error, filelist) {
				var title = 'Welcome';
				var description = 'Hello, Node.js';
				var list = templateList(filelist);
				var template = templateHTML(title, list,
					`<h2>${title}</h2>${description}`,
					`<a href="/create">create</a>` // home에서는 update 기능 존재하지 않음
					);
				response.writeHead(200); // 200 : 파일을 정상적으로 전송했다.
				// console.log(__dirname + _url); : 디렉토리와 query string의 값 출력
				// response.end(fs.readFileSync(__dirname + _url)); : 사용자가 접근할 때마다 파일을 읽음
				response.end(template);
			});
			
		} else { // 메인 페이지 아닐 경우
			fs.readdir('./data', function(error, filelist) {			
				fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
					var title = queryData.id;
					var list = templateList(filelist);
					var template = templateHTML(title, list,
						`<h2>${title}</h2>${description}`,
						`<a href="/create">create</a> <a href="/update?id=${title}">update</a>` // home이 아닐 경우 update 기능 존재, 수정할 파일 명시 위해 id 제공
						);
					response.writeHead(200); // 200 : 파일을 정상적으로 전송했다.
					// console.log(__dirname + _url); : 디렉토리와 query string의 값 출력
					// response.end(fs.readFileSync(__dirname + _url)); : 사용자가 접근할 때마다 파일을 읽음
					response.end(template);
				});
			});
		}	

	}

	else if(pathname === '/create') {
		fs.readdir('./data', function(error, filelist) {
			var title = 'WEB - create';
			var list = templateList(filelist);
			var template = templateHTML(title, list, `
			<form action="http://localhost:3000/create_process" method="post">
				<p><input type ="text" name="title" placeholder="title"></p>
				<p>
					<textarea name="description" placeholder="description"></textarea>
				</p>
				<p>
					<input type="submit">
				</p>
			</form>
			`, ''); // control이 존재하지 않기 때문에 argument에 공백 문자 입력
			response.writeHead(200); 
			response.end(template);
		});
	}

	else if(pathname === '/create_process') {
		var body = '';
		// 데이터의 조각을 서버쪽에서 수신할 때마다, 서버는 callback 함수를 호출, data parameter를 통해 수신한 정보 제공
		request.on('data', function(data) {
			body = body + data; // callback이 실행될 때마다 데이터 추가
		});
		// 더 이상 들어올 정보가 없을 때, end에 해당되는 callback 함수 호출, 정보 수신이 끝났다는 뜻
		request.on('end', function() {
			var post = qs.parse(body); // post 데이터에 post 정보를 저장 (정보를 객체화)
			var title = post.title;
			var description = post.description;
			// 입력한 데이터로 파일 생성, callback 함수 호출
			fs.writeFile(`data/${title}`, description, 'utf-8', function(err) {
				response.writeHead(302, {Location: `/?id=${title}`}); // redirection
				response.end();
			});
		});
	}

	// 그 외의 경로로 접속했을 때 - 에러
	else {
		response.writeHead(404); // 404 : 파일을 찾을 수 없다.
		response.end('Not found');
	}
	
});
app.listen(3000);