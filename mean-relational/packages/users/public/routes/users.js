(function(){

  'use strict';
  //Setting up route
  angular
         .module('mean.users')
         .config(config);

  config.$inject = ['$stateProvider'];


  function config($stateProvider){

      // states for my app
      $stateProvider
        .state('users', {
          url: '/all-users',
          templateUrl: '/users/views/list.html',
          controller: 'usersController',
          controllerAs: 'usctr'
        })
        .state('create-user', {
          url: '/users/create',
          templateUrl: 'users/views/create.html',
          controller: 'usersController',
          controllerAs: 'usctr'
        })
        .state('edit user', {
            url: '/users/:userId/edit',
            templateUrl: 'users/views/edit.html',
            controller: 'usersController',
            controllerAs: 'usctr'
        })
        .state('view user', {
            url:'/users/:userId',
            templateUrl: 'users/views/view.html',
            controller: 'usersController',
            controllerAs: 'usctr'
        });

  }

})();
