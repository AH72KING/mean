'use strict';
/*import {Observable} from 'rxjs/observable';
import 'rxjs/RX';
import 'rxjs/add/operator/map';*/
(function(){
    angular
      .module('mean.products')
      .controller('productsController',productsController);

      productsController.$inject = ['$stateParams', '$location', 'Global', 'products','$state', '$scope', '$timeout', '$http'];

      function  productsController($stateParams, $location, Global, products,$state, $scope, $timeout,$http){
        var vm = this;
        $scope.timeInMs = 0;
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
             vm.list = getList();
        });
     }

      function findOne() {
            products.get({
                productId: $stateParams.productId
            }, function(product) {
                vm.product = product;
            });
        }
        function getList(){
             return $timeout(countUp, 15000);
            /*var http = require('http');
            var url = 'http://localhost:8080/Anerve/anerveWs/AnerveService/getAllProdsInLocDefault/PK/81/20';
            var data = '';
            var productsData = '';
            var body = '';
                var serverLink = url; // TODO this has to come from viewfile
                var method = 'GET';
                var $that = this;
                $http({
                    method: method,
                    url: serverLink
                }).then(function(response) {
                    console.log('successfully saved', response);
                }, function(response) {
                    console.log('error while saving', response);
                });*/

        }
        var countUp = function() {
        $scope.timeInMs+= 15000;
        var http = $http;
        var url = 'http://localhost:8080/Anerve/anerveWs/AnerveService/getAllProdsInLocDefault/PK/81/3';
        var data = '';
        var body = '';
           http.get(url, function(res2){
               

                res2.on('data', function(chunk){
                    body += chunk;
                });

                res2.on('end', function(){
                    data = JSON.parse(body);
                console.log(data);
                    
                });
            });
        $timeout(countUp, 15000);
    }

      }

})();
