(function(){

  'use strict';
  angular.module('mean.users')
         .controller('LoginCtrl', LoginCtrl);

      LoginCtrl.$inject = ['$rootScope', '$http', '$location','MeanUser'];

      function LoginCtrl($rootScope, $http, $location,MeanUser){
            //console.log('login.controller .LoginCtrl');
            //declare internal variables
            var vm = this;

            //declare scope variables
            vm.meanuser = MeanUser;
            vm.user = {};

            //declare scope methods controllers
            vm.login =  login;

            //declare logical scope methods controller
            function login(){
              console.log('login.controller .login');
               vm.meanuser.login(vm.user);
            }

      }

})();
