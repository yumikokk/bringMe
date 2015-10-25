controllers.controller('ListRequestCtrl', ['$scope', '$rootScope', '$state', '$http', '$window', '$ionicSideMenuDelegate', 'auth', 'SERVER',
	function($scope, $rootScope, $state, $http, $window, $ionicSideMenuDelegate, auth, SERVER) {

		$scope.toggleLeft = function() {
		  $ionicSideMenuDelegate.toggleLeft();
		};

		$http.get(SERVER.url + '/open_requests')
		.success(function(response){
			$scope.open_requests = [];
			for(var i=0; i < response.length; i++){
				response[i].taken = false;
				$scope.open_requests.push(response[i]);
			}
			
			console.log($scope.open_requests);
		});

		$scope.takeRequest = function(request) {
			if(request.taken){
				request.taken = false;
			}else {
				request.taken = true;
			}
		}

		$scope.currentRequest = function(index){
			$rootScope.thisRequest = $scope.open_requests[index];
			$state.go('tab.bringer-details', {id: $rootScope.thisRequest._id});
			console.log($scope.thisRequest);
		}
}]);