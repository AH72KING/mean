//users service used for users REST endpoint
(function(){
  'use strict';

  angular
      .module('Anerve')
      .factory('users',users);

      users.$inject = ['$resource'];

      function users($resource){

        return $resource('api/users/:USERID', {
            USERID: '@USERID'
        }, {
            update:{method: 'PUT'}
        });


      }
})();
    


