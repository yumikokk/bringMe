controllers.controller('LoginCtrl', ['$scope', '$state', '$window', 'auth', 
	function($scope, $state, $window, auth) {
		
		$scope.user = {};
		$scope.login = function() {
			auth.logIn($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function() {
				$scope.user.prefer_role = $window.localStorage['bring-me-role'];

				if($scope.user.prefer_role == 1) {
					$state.go('tab.bringer');
				} else {
					$state.go('tab.dash');
				}
			})
		}

		$scope.goRegister = function() {
			$state.go('register');
		}

		$scope.goHome = function() {
			$state.go('tab.dash');
		}
}]);