var name = 'hyositive';
var letter = 'Dear ' + name + '\nThis is a test for string literal. ' + name;
console.log(letter);

/*
`는 '백틱(grave accent)'라고 불린다.
백틱을 이용하면 multi-line string을 선언할 수 있으며, string literal 중간에 변수를 사용하기에도 용이하다.
*/

var letter = `Dear ${name}
This is a test for string literal 2. ${name}`;
console.log(letter);