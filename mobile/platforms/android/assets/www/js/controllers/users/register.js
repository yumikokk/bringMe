controllers.controller('RegisterCtrl', ['$scope', '$state', 'auth', 
	function($scope, $state, auth) {
		$scope.user = {};

		$scope.register = function() {
			console.log($scope.user);
			auth.register($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function() {
				$state.go('tab.dash');
			})
		}
}]);