// Last Modification : 2021.01.16
// by HYOSITIVE
// based on WEB2 - Node.js - 22

var number = [1, 400, 12, 34];
var i = 0;
var total = 0;
while(i < number.length) {
	total = total + number[i];
	i = i + 1;
}
console.log(`total : ${total}`);