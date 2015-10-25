var controllers = angular.module('bringme.controllers', [])

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $state, $http, $location, $window, auth, SERVER) {
  if(auth.isLoggedIn()) {
    $scope.isLoggedIn = true;
  } else {
    $scope.isLoggedIn = false;
  }
  $scope.login = function() {
    $state.go('login');
    $scope.isLoggedIn = true;
  }
  $scope.register = function() {
    $state.go('register');
    $scope.isLoggedIn = true;
  }
  $scope.logout = function() {
    auth.logOut();
    $scope.isLoggedIn = false;
  }

  if ( auth.getPreferRole() == 1 ){
    document.getElementById("user_prefer_role").checked = false;
  }else{
    document.getElementById("user_prefer_role").checked = true;
  }

  $scope.updateRole = function() {
    if(document.getElementById("user_prefer_role").checked){
      auth.updatePreferRole(0);
    }else{
      auth.updatePreferRole(1);
    }
  }

  $scope.venmo = function() {
    var ref = $window.open('https://api.venmo.com/v1/oauth/authorize?client_id=3013&scope=make_payments%20access_profile&response_type=code&redirect_uri=http://localhost:8100/#/callback');
  }

  if($location.absUrl().includes('code')){
    var result;
    var access_code = $location.absUrl().split('?code=')[1].split('#')[0];
    $window.localStorage.setItem('venmo-code', access_code);
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
        })
        .error(function(err) {
          console.log(err);
      });

  }

});
