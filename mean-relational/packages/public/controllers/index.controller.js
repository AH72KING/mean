(function(){
  'use strict';
  angular
      .module('Anerve')
      .controller('IndexController',IndexController);

      IndexController.inject = ['Global'];

      function IndexController(Global){
        var vm = this;
        vm.global = Global;
       // var $ = require("jquery");

      }
  
})();
