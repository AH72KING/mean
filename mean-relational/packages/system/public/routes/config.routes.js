(function(){

  'use strict';
  //Setting up route
  angular
         .module('mean')
         .config(configState)
         .config(configLoaction)
         .config(['$httpProvider', function($httpProvider) {
              $httpProvider.defaults.headers.common = {};
              $httpProvider.defaults.headers.post = {};
              $httpProvider.defaults.headers.get = {};
              $httpProvider.defaults.headers.put = {};
              $httpProvider.defaults.headers.patch = {};
            }
         ])
         .run(function($rootScope, $state) {
             $rootScope.$state = $state;
         });

  // config.$inject = ['$routeProvider','$locationProvider'];
  configState.$inject = ['$stateProvider','$urlRouterProvider'];
  configLoaction.$inject = ['$locationProvider'];


  function configState($stateProvider,$urlRouterProvider){

          // For unmatched routes:
      $urlRouterProvider.otherwise('/');

      // states for my app
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'system/views/index.html',
          controller:'IndexController',
          controllerAs:'idctr',
          resolve: {
          loggedin: function(MeanUser) {
                  return MeanUser.checkLoggedin();
              }
           }
        });
  }

  function configLoaction($locationProvider){
    $locationProvider.html5Mode({
      enabled:true,
      requireBase:false
    });
  }

})();
