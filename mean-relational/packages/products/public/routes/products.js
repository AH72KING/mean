(function(){

  'use strict';
  //Setting up route
  angular
         .module('mean.products')
         .config(config);

  config.$inject = ['$stateProvider'];


  function config($stateProvider){

      // states for my app
      $stateProvider
        .state('products', {
          url: '/all-products',
          templateUrl: '/products/views/list.html',
          controller: 'productsController',
          controllerAs: 'arctr'
        })
        .state('create-product', {
          url: '/products/create',
          templateUrl: 'products/views/create.html',
          controller: 'productsController',
          controllerAs: 'arctr'
        })
        .state('edit product', {
            url: '/products/:productId/edit',
            templateUrl: 'products/views/edit.html',
            controller: 'productsController',
            controllerAs: 'arctr'
        })
        .state('view product', {
            url:'/products/:productId',
            templateUrl: 'products/views/view.html',
            controller: 'productsController',
            controllerAs: 'arctr'
        });

  }

})();
