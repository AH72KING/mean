(function(){

  'use strict';
  //Setting up route
  angular
         .module('Anerve')
         .config(config);

  config.$inject = ['$stateProvider'];


  function config($stateProvider){
   // console.log('$stateProvider routes  .user');
      // states for my app
      $stateProvider
      .state('auth', {
        url: '/auth',
        templateUrl: '/public/views/auth.html'
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: '/public/views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'lgctr',
        resolve: {
                loggedin: function(MeanUser){
                  MeanUser.checkLoggedOut();
                }
          }
      })
      .state('auth.register',{
        url: '/register',
        templateUrl: '/public/views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'rgctr',
        resolve: {
                loggedin: function(MeanUser) {
                  MeanUser.checkLoggedOut();
                }
          }
      });

  }

})();
