(function(){
  'use strict';
  angular.module('Anerve')
         .controller('LoginCtrl', LoginCtrl);
      LoginCtrl.$inject = ['$rootScope', '$http', '$scope', '$location', 'MeanUser' ,'Session'];
      function LoginCtrl($rootScope, $http, $scope, $location, MeanUser, Session){
            var vm = this;
            vm.meanuser = MeanUser;
            vm.user = {};
            vm.login =  login;
            function login(){
              console.log('login');
              $rootScope.UserLoginInJava(vm.user);  
            }
      }
})();