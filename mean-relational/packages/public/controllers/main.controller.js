 (function(){
   'use strict';
   angular
       .module('Anerve')
       .controller('MainCtrl', MainCtrl);

       MainCtrl.$inject = [];

  function MainCtrl() {
      var vm = this;
      vm.userName = 'Ahsan Khan';
      vm.helloText = 'Welcome to Anerve';
      vm.descriptionText = 'It Is An Application For Shopping With Friends.';
  }

 })();
