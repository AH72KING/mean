
'use strict';

(function(){
    angular
      .module('mean.products')
      .controller('MyController',MyController);

      MyController.$inject = ['$stateParams', '$location', 'Global', 'products','$state'];

      function MyController($stateParams, $location, Global, products,$state){
        var vm = this;
        vm.global = Global;

        //declare and use methods
        vm.create = create;
        vm.remove = remove;
        vm.update = update;
        vm.find = find;
        vm.findOne = findOne;

        //methods
         function create() {
            var product = new Products({
                title: vm.title,
                content: vm.content
            });

            product.$save(function(response) {
                $location.path('products/' + response.id);
            });

            vm.title = '';
            vm.content = '';
        }

        function remove(product) {
            if (product) {
                product.$remove();

                for (var i in vm.products) {
                    if (vm.products[i] === product) {
                        vm.products.splice(i, 1);
                    }
                }
            }
            else {
                vm.product.$remove(function(){
                  $state.go('products');
                });
            }
        }

      function update() {
            var product = vm.product;
            if (!product.updated) {
                product.updated = [];
            }
            product.updated.push(new Date().getTime());

            product.$update(function() {
                $location.path('products/' + product.id);
            });
        }

        function find() {
            products.query(function(products) {
                vm.products = products;
            });
        }

      function findOne() {
            products.get({
                productId: $stateParams.productId
            }, function(product) {
                vm.product = product;
            });
        }

      }

})();
