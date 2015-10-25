controllers.controller('AuthCtrl', ['$scope', '$state', 'auth', 
	function($scope, $state, auth) {
		
		$scope.user = {};

		$scope.login = function() {
			auth.logIn($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function() {
				$state.go('tab.dash');
			})
		};

		$scope.register = function() {
			auth.register($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function() {
				$state.go('tab.dash');
			})
		};
}]);