controllers.controller('ShoppingCartCtrl', ['$scope', '$rootScope', '$state', '$http', '$cordovaGeolocation', '$window', '$location', 'localStorageService', 'auth', 'cart', 'SERVER',
	function($scope, $rootScope, $state, $http, $cordovaGeolocation, $window, $location, localStorageService, auth, cart, SERVER) {
		$scope.bringMeNote = 'testing';

		if ($location.absUrl().includes('code') && (!$window.localStorage['venmo-code'])) {
		  var result;
		  var access_code = $location.absUrl().split('?code=')[1].split('#')[0];
		  $http.post(SERVER.url + '/venmo_access', 
		    { url_string: 
		      { client_id: 3013,
		        client_secret: 'p6kugL49ZXYSWsWyMDVdqkSuPpwxs8YF',
		        code:access_code
		      }
		    })
		    .success(function(data) {
		        result = JSON.parse(data);
		        console.log(result);
		        $window.localStorage.setItem('venmo-token', result.access_token);
		        $window.localStorage.setItem('venmo-refresh-token', result.refresh_token);
		        $location.path('/#/tab/shopping-cart');
		      })
		      .error(function(err) {
		        console.log(err);
		    });
		}

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
		}

			$scope.pay = function(note, dollarAmount) {
			  var result;
			  $http.post(SERVER.url + '/makePayments',
			    { paymentDetails:
			      {
			        access_token: $window.localStorage['venmo-token'],
			        phone: '4153749921',
			        note: note,
			        amount: dollarAmount
			      }
			    })
			    .success(function(data){
			      result = JSON.parse(data);
			      console.log(result);
			    })
			    .error(function(err) {
			      console.log(err);
			    })
			};

			$scope.makeARequest = function(request){
				var venmoToken = $window.localStorage['venmo-token'];
				var venmoRefreshToken = $window.localStorage['venmo-refresh-token'];

				$scope.request.vendor = $window.localStorage['vendor'];

				if( ( venmoToken == 'undefined' ) && ( venmoRefreshToken == 'undefined' ) ){
					var ref = $window.open('https://api.venmo.com/v1/oauth/authorize?client_id=3013&scope=make_payments%20access_profile&response_type=code&redirect_uri=http://localhost:8100/#/callback');
				} else if ( (venmoRefreshToken) && (!venmoToken) ) {
						$http.post(SERVER.url + '/venmo_access', 
						  { url_string: 
						    { client_id: 3013,
						      client_secret: 'p6kugL49ZXYSWsWyMDVdqkSuPpwxs8YF',
						      refresh_token:$window.localStorage['venmo-refresh-token']
						    }
						  })
						  .success(function(venmoData) {
						      result = JSON.parse(venmoData);
						      console.log(result);
						      $window.localStorage.setItem('venmo-token', result.access_token);
						      $window.localStorage.setItem('venmo-refresh-token', result.refresh_token);
						      $http.post(SERVER.url + '/make-a-request', $scope.request, {
						      	headers: {Authorization: 'Bearer '+auth.getToken()}
						      }).success(function(paymentResult) {
						      	$scope.pay($scope.bringMeNote, '0.10');
						      	localStorageService.remove(shopping_cart);
						      	console.log(paymentResult);
						      	$window.localStorage.removeItem('venmo-token');
						      })
						      .error(function(err) {
						          console.log(err);
						          $window.localStorage.removeItem('venmo-token');
						      });
						    });
					} else if ($window.localStorage['venmo-token']) {
						$http.post(SERVER.url + '/make-a-request', $scope.request, {
							headers: {Authorization: 'Bearer '+auth.getToken()}
						}).success(function(paymentResult) {
							$scope.pay($scope.bringMeNote, '0.10');
							localStorageService.remove(shopping_cart);
							console.log(paymentResult);
							$window.localStorage.removeItem('venmo-token');
						})
						.error(function(err) {
						    console.log(err);
						    $window.localStorage.removeItem('venmo-token');
						});
					}
			};
				
}]);