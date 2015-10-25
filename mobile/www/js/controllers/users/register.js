controllers.controller('RegisterCtrl', ['$scope', '$state', 'auth', 
	function($scope, $state, auth) {
		$scope.user = {};

		$scope.register = function() {
			auth.register($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function() {
				if($scope.user.prefer_role === 1) {
					$state.go('tab.bringer');
				} else {
					$state.go('tab.dash');
				}
			});
		}

		$scope.goLogin = function() {
			$state.go('login');
		}

		$scope.goHome = function() {
			$state.go('tab.dash');
		}
}]);