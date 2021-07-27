// Last Modification : 2021.07.27
// by HYOSITIVE
// based on WEB6 - MultiUserAuth - 3

module.exports = {
	HTML:function(title, list, body, control, authStatusUI=
				  '<a href="/auth/login">login</a> | <a href="/auth/register">register</a>') { // login을 외부에서 주입할 수 있도록 authStatusUI 파라미터 추가
		return `
		<!doctype html>
		<html>
		<head>
		  <title>WEB - ${title}</title>
		  <meta charset="utf-8">
		</head>
		<body>
			${authStatusUI}
			<h1><a href="/">WEB</a></h1>
			${list}
			${control}
			${body}
		</body>
		</html>
		`;
	},
	list:function(filelist) {
		// filelist를 활용해 list 자동 생성
		var list = '<ul>';
		var i = 0;
		while(i < filelist.length) {
			list = list + `<li><a
			href="/topic/${filelist[i]}">${filelist[i]}</a></li>`; // query string 방식에서 clean url 방식으로 변경
			i = i + 1;
		}
		list = list + '</ul>';
		return list;
	}
}

// module.exports = template;