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

.controller('AccountCtrl', function($rootScope, $scope, $state, $http, $location, $window, auth) {
  if(auth.isLoggedIn()) {
    $rootScope.isLoggedIn = true;
  } else {
    $rootScope.isLoggedIn = false;
  }
  $scope.login = function() {
    $state.go('login');
    $window.location.reload();
  }
  $scope.register = function() {
    $state.go('register');
    $window.location.reload();
  }
  $scope.logout = function() {
    auth.logOut();
    $rootScope.isLoggedIn = false;
  }

});
