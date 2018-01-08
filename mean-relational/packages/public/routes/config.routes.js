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
      // states for my app
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/public/views/products/list.html',
          controller: 'productsController',
          controllerAs: 'arctr',
          resolve : {
          loggedin: function(MeanUser) {
            var $return;
                  if($return = MeanUser.checkLoggedin() == false){
                    console.log('MeanUser');
                    console.log($return);
                    return false;
                  }else{
                    console.log('MeanUserelse');
                    console.log($return);
                    return $return;  
                  }
              }
           }
        });
        /*.state('home', {
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
