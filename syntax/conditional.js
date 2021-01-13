var args = process.argv;
console.log(args[2]);
console.log('A');
console.log('B');
if (args[2] === '1') {
	console.log('C1');
} else {
	console.log('C2');
}
console.log('D');

/*
args 배열에는 무엇이 저장되는가?
index 0 : Node.js 런타임의 정보
1 : 실행시킨 파일의 경로
2 ~ : 입력값
*/