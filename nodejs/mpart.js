// Last Modification : 2021.01.23
// by HYOSITIVE
// based on WEB2 - Node.js - 44

var M = {
    v:'v',
    f:function() {
        console.log(this.v);
    }
}

// M이 가르키는 객체를 외부에서 사용할 수 있도록 export
module.exports = M;