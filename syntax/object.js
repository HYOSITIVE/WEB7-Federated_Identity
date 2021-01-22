// Last Modification : 2021.01.22
// by HYOSITIVE
// based on WEB2 - Node.js - 39, 40

var members = ['egoing', 'k8805', 'hoya'];
console.log(members[1]);
var i = 0;
while (i < members.length) {
    console.log('array loop', members[i]);
    i = i + 1;
}

// 배열 literal은 대괄호, 객체는 중괄호
var roles = {
    'programmer':'egoing', // key : value
    'designer':'k8805',
    'manager':'hoya'
};
console.log(roles.designer);
console.log(roles['designer']);

for (var name in roles) {
    console.log('object => ', name, 'value => ', roles[name]);
}