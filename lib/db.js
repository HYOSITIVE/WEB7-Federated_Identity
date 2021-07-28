// Last Modification : 2021.07.28
// by HYOSITIVE
// based on WEB6 - MultiUserAuth - 5

var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);
db.defaults({users:[]}).write(); // 기본적으로 users에 데이터 저장
module.exports = db;