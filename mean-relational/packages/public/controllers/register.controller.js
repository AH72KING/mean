(function(){
  'use strict';
  angular
        .module('Anerve')
        .controller('RegisterCtrl',RegisterCtrl);

        RegisterCtrl.$inject = ['Global','$http','$state', 'MeanUser'];

        function RegisterCtrl(Global,$http,$state,MeanUser){
          var vm = this;
              vm.user = {};
              vm.global = Global;

              vm.register = register;

              function register(){
                MeanUser.register(vm.user);
              }
        }
})();
