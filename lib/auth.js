// Last Modification : 2021.06.02
// by HYOSITIVE
// based on WEB4 - Express - Session & Auth - 6.5

module.exports = {
	isOwner:function(request, response) {
		if (request.session.is_logined) { // 로그인 성공
			return true;
		}
		else { // 로그인 실패
			return false;
		}
	},
	statusUI:function(request, response) {
		var statusUI = '<a href="/auth/login">login</a>' // 로그인 되지 않았을 때
		if (this.isOwner(request, response)) { // 로그인 되었을 때
			statusUI = `${request.session.nickname} | <a href="/auth/logout">logout</a>`; 
		}
		return statusUI;
	}
}
