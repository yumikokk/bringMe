controllers.controller('AddProductCtrl', ['$scope', '$state', '$http', 'SERVER',
	function($scope, $state, $http, SERVER) {
		$scope.product = {};


		$scope.addProduct = function(product){
			if(product.vendor){
				$http.get(SERVER.url + '/vendors/' + product.vendor)
				.then(function(vendor){
					console.log(vendor);
					product.vendor = vendor.data._id;
					product.unit_price = parseFloat(product.unit_price);
					$http.post(SERVER.url + '/vendors/' + vendor.data._id + '/products', product)
					.success(function(data) {
						console.log(data);
					})
				})
			}
		}

}]);