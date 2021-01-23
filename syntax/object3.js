// Last Modification : 2021.01.23
// by HYOSITIVE
// based on WEB2 - Node.js - 42

// 서로 연관된 값들을 하나의 객체 안에 정리정돈
var o = {
    v1:'v1',
    v2:'v2',
    f1:function() {
        console.log(this.v1);
    },
    f2:function() {
        console.log(this.v2);
    }
}

o.f1();
o.f2();