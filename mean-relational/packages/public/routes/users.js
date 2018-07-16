(function(){

  'use strict';
  //Setting up route
  angular
         .module('Anerve')
         .config(config);

  config.$inject = ['$stateProvider'];


  function config($stateProvider){

      // states for my app
      $stateProvider
        .state('users', {
          url: '/all-users',
          templateUrl: '/public/views/list.html',
          controller: 'usersController',
          controllerAs: 'usctr'
        })
        .state('create-user', {
          url: '/users/create',
          templateUrl: '/public/views/create.html',
          controller: 'usersController',
          controllerAs: 'usctr'
        })
        .state('edit user', {
            url: '/users/:USERID/edit',
            templateUrl: '/public/views/edit.html',
            controller: 'usersController',
            controllerAs: 'usctr'
        })
        .state('view user', {
            url:'/users/:USERID',
            templateUrl: '/public/views/profile_view.html',
            controller: 'usersController',
            controllerAs: 'usctr'
        })
        .state('test user', {
            url:'/test/:USERID',
            templateUrl: '/public/views/view.html',
            controller: 'usersController',
            controllerAs: 'usctr'
        });

  }

})();
