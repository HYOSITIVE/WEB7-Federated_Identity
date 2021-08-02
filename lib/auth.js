// Last Modification : 2021.08.02
// by HYOSITIVE
// based on WEB7 - Passport_Facebook - 4

module.exports = {
	isOwner:function(request, response) {
		if (request.user) { // 로그인 성공. Passport에서는 request.user 객체로 로그인 여부 판별
			return true;
		}
		else { // 로그인 실패
			return false;
		}
	},
	statusUI:function(request, response) {
		var statusUI = `<a href="/auth/login">login</a> | 
		<a href="/auth/register">register</a> |
		<a href="/auth/google">Login with Google</a> |
		<a href="/auth/facebook">Login with Facebook</a>
		`
		if (this.isOwner(request, response)) { // 로그인 되었을 때
			statusUI = `${request.user.displayName} | <a href="/auth/logout">logout</a>`; 
		}
		return statusUI;
	}
}
