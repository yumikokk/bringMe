controllers.controller('DashCtrl', ['$scope', '$rootScope', '$state', '$http', '$window', '$ionicSideMenuDelegate', 'auth', 'SERVER',
	function($scope, $rootScope, $state, $http, $window, $ionicSideMenuDelegate, auth, SERVER) {

		$scope.user_role = $window.localStorage['bring-me-role'];
		$scope.toggleLeft = function() {
		  $ionicSideMenuDelegate.toggleLeft();
		};

		$scope.request = {}

		$scope.shoppingCartPage = function(){
			$state.go('tab.dash-cart');
		}
				
		$scope.goPickProducts = function(){
			$window.localStorage.removeItem('vendor');
			var vendor = $scope.request.vendor;
			$window.localStorage['vendor'] = vendor;
			if(vendor){
				$state.go('tab.dash-shopping', { vendor: vendor });
			} 
		}

}]);