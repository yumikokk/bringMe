controllers.controller('ShoppingCartCtrl', ['$scope', '$rootScope', '$state', '$http', '$cordovaGeolocation', '$window', 'localStorageService', 'auth', 'cart', 'SERVER',
	function($scope, $rootScope, $state, $http, $cordovaGeolocation, $window, localStorageService, auth, cart, SERVER) {
		var shopping_cart;
		$scope.request = {}; 
		$scope.request.products = localStorageService.get(shopping_cart);
		var products = $scope.request.products;
		$scope.estimate_total = 0;

		$scope.goShopping = function() {
			$state.go('tab.dash');
		}

		if(products !== null){
			for(var i=0; i < products.length; i++){
				$scope.estimate_total += products[i].qty * parseFloat(products[i].unit_price);
			}

			$scope.taxes = $scope.estimate_total * 0.09;
			$scope.estimate_total += $scope.taxes;

			$scope.addUp = function(){
				$scope.estimate_total += parseFloat($scope.request.tips);
			}

			var options = {timeout: 10000, enableHighAccuracy: true};
			// Get user's current location address; & Center the map;
			$cordovaGeolocation.getCurrentPosition(options).then(function(position){
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				var geocoder = new google.maps.Geocoder();
				var latLng = new google.maps.LatLng(lat, lng);
				geocoder.geocode( { 'latLng': latLng}, function(results, status) {
				        console.log(results);
				        if (status == google.maps.GeocoderStatus.OK) {
				        	$scope.request.meet_location = results[0].formatted_address;
				        }else{
				          alert("Geocode was not successful for the following reason: " + status);
				        }
				    });
			});

			$scope.makeARequest = function(request){
				$scope.request.vendor = $window.localStorage['vendor'];
				console.log($scope.request);
				$http.post(SERVER.url + '/make-a-request', $scope.request, {
					headers: {Authorization: 'Bearer '+auth.getToken()}
				}).success(function(data) {
					localStorageService.remove(shopping_cart);
					console.log(data);
				});
			};
		}
}]);