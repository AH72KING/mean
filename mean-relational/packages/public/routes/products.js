(function(){

  'use strict';
  //Setting up route
  angular
         .module('Anerve')
         .config(config);
         

  config.$inject = ['$stateProvider','$httpProvider'];


  function config($stateProvider){//,$httpProvider){

      // states for my app
      $stateProvider
        .state('products', {
          url: '/all-products',
          templateUrl: '/public/views/products/list.html',
          controller: 'productsController',
          controllerAs: 'arctr'
        })
        .state('create-product', {
          url: '/products/create',
          templateUrl: '/public/views/products/create.html',
          controller: 'productsController',
          controllerAs: 'arctr'
        })
        .state('edit product', {
            url: '/products/:productId/edit',
            templateUrl: '/public/views/products/edit.html',
            controller: 'productsController',
            controllerAs: 'arctr'
        });
        /*.state('view product', {
            url:'/products/:productId',
            templateUrl: '/public/views/products/view.html',
            controller: 'productsController',
            controllerAs: 'arctr'
        });*/
        /*$httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.get = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];*/

  }

})();
