services.factory('vendorMarkers', ['$http', 'SERVER', 
	function($http, SERVER){
		var markers = [];

		return {
			getMarkers: function() {
				return $http.get(SERVER.url + '/').then(function(response){
				    markers = response;
				    return markers;
				});
			},

			getMarker: function(id) {

			}
		}
}])