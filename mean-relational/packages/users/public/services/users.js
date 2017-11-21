//users service used for users REST endpoint
(function(){
  'use strict';

  angular
      .module('mean.users')
      .factory('users',users);

      users.$inject = ['$resource'];

      function users($resource){

        return $resource('api/users/:userId', {
            userId: '@id'
        }, {
            update:{method: 'PUT'}
        });


      }
})();
