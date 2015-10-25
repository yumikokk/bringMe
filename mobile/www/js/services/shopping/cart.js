services.factory('cart', ['$http', '$window', 'SERVER', function($http, $window, SERVER) {
	var cart = {};

	cart.loadProducts = function(){
		return $window.localStorage['shopping_cart'];
	}
	
	return cart;
}]);