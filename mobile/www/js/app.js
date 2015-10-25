// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'bringme' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'bringme.services' is found in services.js
// 'bringme.controllers' is found in controllers.js
angular.module('bringme', 
  ['ionic', 
   'bringme.controllers', 
   'bringme.services',
   'ngCordova',
   'LocalStorageModule'])

.run(function($ionicPlatform, GoogleMaps) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    GoogleMaps.init();
  });
})

// .constant('SERVER', { url: 'https://bring-me-api.herokuapp.com' })
.constant('SERVER', { url: 'http://localhost:8081' })

.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('bringme')
    .setStorageType('sessionStorage')
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
      url: '/login',
      templateUrl: 'templates/users/login.html',
      controller:'LoginCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('tab.dash');
        }
      }]
  })

  .state('register', {
      url: '/register',
      templateUrl: 'templates/users/register.html',
      controller: 'RegisterCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('tab.dash');
        }
      }]
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.bringer', {
      url: '/bringer/list-requests',
      views: {
        'tab-dash': {
          templateUrl: 'templates/bringer/list-requests.html',
          controller: 'ListRequestCtrl'
        }
      },
      onEnter: ['$state', '$window', function($state, $window){
        if( $window.localStorage['bring-me-role'] == 0){
          $state.go('tab.dash');
        }
      }]
    })
    .state('tab.bringer-details', {
      url: '/request/:id',
      views: {
        'tab-dash': {
          templateUrl: 'templates/bringer/request-details.html',
          controller: 'ListRequestCtrl'
        }
      }
    })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      },
      onEnter: ['$state', '$window', function($state, $window){
        if( $window.localStorage['bring-me-role'] == 1){
          $state.go('tab.bringer');
        }
      }]
    })
    .state('tab.dash-shopping', {
        url: '/dash/:vendor',
        views: {
          'tab-dash': {
              templateUrl: 'templates/shopping/list-products.html',
              controller: 'VendorProductCtrl'
          }
        }
    })
    .state('tab.dash-cart', {
        url: '/shopping-cart',
        views: {
          'tab-dash': {
            templateUrl: 'templates/shopping/cart.html',
            controller: 'ShoppingCartCtrl'
          }
        }
    })
    
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  // admin access URLs
  .state('product', {
    url: '/add-product',
    templateUrl: 'templates/admin/product.html',
    controller: 'AddProductCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/account');

});
