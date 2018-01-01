(function(){

  'use strict';
  //Setting up route
  angular
         .module('Anerve')
         .config(configState)
         .config(configLoaction)
         .run(function($rootScope, $state) {
             $rootScope.$state = $state;
         });

  // config.$inject = ['$routeProvider','$locationProvider'];
  configState.$inject = ['$stateProvider','$urlRouterProvider'];
  configLoaction.$inject = ['$locationProvider'];


  function configState($stateProvider,$urlRouterProvider){

          // For unmatched routes:
      $urlRouterProvider.otherwise('/');
      $urlRouterProvider.when('/api/auth/twitter', '/api/auth/twitter');
      $urlRouterProvider.when('/api/auth/tumblr', '/api/auth/tumblr');
      $urlRouterProvider.when('/api/auth/facebook', '/api/auth/facebook');
      $urlRouterProvider.when('/api/auth/google', '/api/auth/google');
      // states for my app
      $stateProvider
          .state('home', {
          url: '/',
          templateUrl: '/public/views/products/list.html',
          controller: 'productsController',
          controllerAs: 'arctr'
        });
       /* .state('home', {
          //url: '/',
          url: '/all-products',
          templateUrl: '/public/views/index.html',
          controller:'IndexController',
          controllerAs:'idctr',
          resolve: {
          loggedin: function(MeanUser) {
                  return MeanUser.checkLoggedin();
              }
           }
        });*/
  }

  function configLoaction($locationProvider){
    $locationProvider.html5Mode({
      enabled:true,
      requireBase:false
    });
  }

})();
