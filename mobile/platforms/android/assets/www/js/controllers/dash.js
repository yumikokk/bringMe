controllers.controller('DashCtrl', ['$scope', '$state', '$http', 'SERVER',
	function($scope, $state, $http, SERVER) {
		$scope.request = {};

		$scope.makeARequest = function(request){
			$http.post(SERVER.url + '/make-a-request', request)
				.success(function(data) {
					console.log(data);
				})
		};

}]);