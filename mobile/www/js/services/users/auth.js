services.factory('auth', ['$http', '$window', 'SERVER', function($http, $window, SERVER) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['bring-me-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['bring-me-token'];
	};

	auth.savePreferRole = function(role) {
		$window.localStorage['bring-me-role'] = role;
	};

	auth.getPreferRole = function(role) {
		return $window.localStorage['bring-me-role'];
	};

	auth.updatePreferRole = function(role) {
		$window.localStorage.removeItem('bring-me-role');
		$window.localStorage['bring-me-role'] = role;
	};

	auth.isLoggedIn = function(){
		var token = auth.getToken();

		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function() {
		if(auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};

	auth.register = function(user){
	  return $http.post( SERVER.url + '/register', user).success(function(data){
	    auth.saveToken(data.token);
	    console.log(data);
	    auth.savePreferRole(data.prefer_role);
	  });
	};

	auth.logIn = function(user){
	  return $http.post( SERVER.url + '/login', user).success(function(data){
	    auth.saveToken(data.token);
	    console.log(data);
	    auth.savePreferRole(data.prefer_role);
	  });
	};

	auth.logOut = function(){
	  $window.localStorage.removeItem('bring-me-role');
	  $window.localStorage.removeItem('bring-me-token');
	};

	return auth;
}]);