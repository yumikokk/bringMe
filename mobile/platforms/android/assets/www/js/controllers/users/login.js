controllers.controller('LoginCtrl', ['$scope', '$state', 'auth', 
	function($scope, $state, auth) {
		
		$scope.user = {};
		$scope.login = function() {
			auth.logIn($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function() {
				$state.go('tab.dash');
			})
		}
}]);