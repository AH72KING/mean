//products service used for products REST endpoint
(function(){
  'use strict';

  angular
      .module('mean.products')
      .factory('products',products);

      products.$inject = ['$resource'];

      function products($resource){

        return $resource('api/products/:productId', {
            productId: '@id'
        }, {
            update:{method: 'PUT'}
        });


      }
})();
