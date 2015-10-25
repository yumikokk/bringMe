controllers.controller('VendorProductCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'localStorageService', 'SERVER',
	function($scope, $rootScope, $state, $stateParams, $http, localStorageService, SERVER) {
		var vendor_id;
		var product_list, shopping_cart;
		var temp_product_list;
		var temp_shopping_cart;
		var total_qty;

		var vendor_name = decodeURI($stateParams.vendor);
		console.log(vendor_name);
		
		$http.get(SERVER.url + '/vendors/' + vendor_name)
		.success(function(data){
			$http.get(SERVER.url + '/vendors/' + vendor_name + '/products')
			.success(function(products){
				$scope.products = products;
			});
		});

	$scope.shoppingCartPage = function(){
		$state.go('tab.dash-cart');
	}

	$scope.addProducts = function(product){
		var included = false;
		var index;
		temp_product_list = localStorageService.get(product_list); 
		temp_shopping_cart = localStorageService.get(product_list);
		if(temp_product_list === null){
			temp_product_list = [];
		}
		if(temp_shopping_cart === null){
			temp_shopping_cart = [];
		}
			
		var product_count = temp_product_list.length;

		for(var i=0; i < product_count; i++){
			if( temp_product_list[i]._id == product._id ) {
				included = true;
				temp_shopping_cart[i] = product;
				if(product.qty === 0){
					temp_product_list.splice(i, 1);
					temp_shopping_cart.splice(i,1);
				}
			}
		}
		if(!included){
			temp_product_list.push(product._id);
			temp_shopping_cart.push(product);
		}


		// update local storage shopping cart
		localStorageService.remove(product_list);
		localStorageService.set(product_list, temp_product_list);
		localStorageService.remove(shopping_cart);
		localStorageService.set(shopping_cart, temp_shopping_cart);

		console.log(localStorageService.get(shopping_cart));
		$scope.productsCount();
		var badge = document.getElementsByClassName('badge-bringme');
		badge[1].style.opacity = 1;

	};

	$scope.productsCount = function() {
		$scope.total_qty = 0;
		total_qty = 0;
		temp_shopping_cart = localStorageService.get(shopping_cart);
		var temp_count = temp_shopping_cart.length;
		for(var j=0; j < temp_count; j++){
			total_qty += temp_shopping_cart[j].qty; 
		}
		$scope.total_qty = total_qty;
		console.log($scope.total_qty);
	}
}]);