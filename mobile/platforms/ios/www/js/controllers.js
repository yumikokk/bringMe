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

.controller('AccountCtrl', function($scope, $state, $http, $window, auth) {
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
    var ref = $window.open('https://api.venmo.com/v1/oauth/authorize?client_id=3013&redirect_uri=http://localhost/callback&scope=make_payments%20access_profile&response_type=code','_blank', 'location=no');
    ref.addEventListener('loadstart', function(event) {
      if ((event.url).startsWith("http://localhost/callback")) {
        requestToken = (event.url).split("?code=")[1];
        console.log("Request Token = " + requestToken);
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $http({
            method: "post",
            url: "https://api.venmo.com/v1/oauth/access_token",
            data: "client_id=3013&client_secret=" + 'p6kugL49ZXYSWsWyMDVdqkSuPpwxs8YF' + "&code=" + requestToken
          })
          .success(function(data) {
            accessToken = data.access_token;
            $location.path("/make-bet");
          })
          .error(function(data, status) {
            alert("ERROR: " + data);
          });
        ref.close();
      }
    });
  }

});
