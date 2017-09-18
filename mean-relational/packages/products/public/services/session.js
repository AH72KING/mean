//products service used for product & cart Sessions
(function(){
  'use strict';

  angular
      .module('mean.products')
      .factory('Session',Session);

      Session.$inject = ['$window'];

      function Session($window){
        var localStorage = $window.localStorage;
        var Session = {
              getItem: function(key) {
                return angular.fromJson(localStorage.getItem(key));
              },
              setItem: function(key, value) {
                return localStorage.setItem(key, angular.toJson(value));
              },
              removeItem: function(key) {
                return localStorage.removeItem(key);
              }
            };

            return Session;
      }
})();