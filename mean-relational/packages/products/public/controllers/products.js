'use strict';
/*import {Observable} from 'rxjs/observable';
import 'rxjs/RX';
import 'rxjs/add/operator/map';*/
(function(){
    angular
      .module('mean.products')
      .controller('productsController',productsController);

      productsController.$inject = ['$stateParams', '$location', 'Global', 'products','$state', '$scope', '$timeout', '$http', 'Session'];

  function productsController($stateParams, $location, Global, products, $state, $scope, $timeout, $http, Session){
        var vm = this;
        var baseUrl = 'http://localhost:3000/';
        var ip = '192.168.100.88';
        var ApiBaseUrl = 'http://'+ip+':8080/Anerve/anerveWs/AnerveService/';
        var headers = {
                   'Access-Control-Allow-Origin': '*',
                   'Content-Type' : 'application/json; charset=UTF-8',
                   'Access-Control-Allow-Headers': 'content-type, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                   'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT',
                   'Access-Control-Max-Age': '3600',
                   'Access-Control-Allow-Credentials': 'true'
                };



        var cartCreated = false;
        var grp_cartId = null;
        var isGuest = true; 
        /*if(Session.getItem('grp_cartId') != undefined){
          cartCreated = true ;
          grp_cartId = Session.getItem('grp_cartId');
        }*/
        $scope.cart = [];

        $scope.hideMe = function() {
          if(vm.products !== undefined){
            return vm.products.length > 0;
          }else{
            return false;
          }
        };




        $scope.timeInMs = 0;
        vm.global = Global;
        vm.lastProductID = 0;

        //declare and use methods
        vm.create = create;
        vm.remove = remove;
        vm.update = update;
        vm.find = find;
        vm.findOne = findOne;

        $scope.$watch('lastProductID', function() {
            //alert('hey, lastProductID has changed!');
        });

        //methods
         function create() {
           /* var product = new Products({
                title: vm.title,
                content: vm.content
            });

            product.$save(function(response) {
                $location.path('products/' + response.id);
            });

            vm.title = '';
            vm.content = '';*/
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
                 grp_cartId = products[4].grp_cartId;
                 console.log('grp_cartId '+grp_cartId);
                 vm.lastProductID = 0;
            });
         }

        function findOne() {
            products.get({
                productId: $stateParams.productId
              }, function(product) {
                vm.product = product;
            });
        }

       /* function getList(){
           $scope.startTimeout();
        }*/

        $scope.startCount = 0;  
        $scope.startTimeout = function () {  
            $scope.startCount = $scope.startCount + 1;  
            $scope.getProducts();
            vm.mytimeout = $timeout($scope.startTimeout, 1000);  
        };

        

        $scope.stopTimeout = function () {  
            $timeout.cancel(vm.mytimeout);  
            console.log('Timer Stopped No More Products');  
        };

        $scope.productDropInCart  = function (event , ui) {   
            var CurrentProduct = ui.draggable;
            var prodBrandId = CurrentProduct.attr('data-product-id');
            if(!cartCreated){
              if(isGuest){  
                $scope.createCart_guest(prodBrandId);
              }
            }else{
              if(isGuest){  
                $scope.addToCart_guest(grp_cartId,prodBrandId);
             }
            }
        };
        $scope.productDropOutFromCart  = function (event , ui) {   
            var CurrentProduct = ui.draggable;
            var prodBrandId = CurrentProduct.attr('data-product-id'); 
              $scope.removeFromCart_guest(grp_cartId,prodBrandId);
        };
        

        $scope.createCart_guest  = function (prodBrandId) {
           var url = baseUrl+'api/createCart_guest';
           //var url = ApiBaseUrl+'createCart_guest/PK/';
           var configObj = { method: 'GET',url: url, headers: headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        console.log(response);
                        console.log('response above');
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        console.log('dataJson below');
                        console.log(dataJson);
                        if(dataJson !== undefined){

                          /*var cart_items     = dataJson.cart_items;
                          var cartUsers      = dataJson.cartUsers;
                          var cart_chats     = dataJson.cart_chats;
                          var cart_events    = dataJson.cart_events;*/
                              grp_cartId     = dataJson.grp_cartId;
                          /*var count          = dataJson.count;
                          var status         = dataJson.status;
                          var privacy        = dataJson.privacy;
                          var owner_username = dataJson.owner_username;
                          var owner_userId   = dataJson.owner_userId;
                          var member_count   = dataJson.member_count;
                          var createtime     = dataJson.createtime;
                          var current_total  = dataJson.current_total;
                          var currency       = dataJson.currency;*/
                          Session.setItem('grp_cartId', grp_cartId);
                          console.log('grp_cartId:'+grp_cartId);
                          console.log('prodBrandId:'+prodBrandId);
                          if(grp_cartId !== undefined){
                            $scope.addToCart_guest(grp_cartId, prodBrandId);
                          }
                        }

                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 

        };
         $scope.addToCart_guest  = function (cartID, productID) {
           var url = baseUrl+'api/addToCart_guest';
          // var url = ApiBaseUrl+'addToCart_guest/'+productID+'/'+cartID;
          var postData = {cartID:cartID,productID:productID};
           var configObj = { method: 'POST',url: url, data: postData, headers: headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        if(dataJson !== undefined && dataJson.length > 0 ){

                          /*var cart_items     = dataJson.cart_items;
                          var cartUsers      = dataJson.cartUsers;
                          var cart_chats     = dataJson.cart_chats;
                          var cart_events    = dataJson.cart_events;*/
                              grp_cartId     = dataJson.grp_cartId;
                          /*var count          = dataJson.count;
                          var status         = dataJson.status;
                          var privacy        = dataJson.privacy;
                          var owner_username = dataJson.owner_username;
                          var owner_userId   = dataJson.owner_userId;
                          var member_count   = dataJson.member_count;
                          var createtime     = dataJson.createtime;
                          var current_total  = dataJson.current_total;
                          var currency       = dataJson.currency;*/
                        }
                        
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 

        };
        $scope.removeFromCart_guest  = function (cartID, productID) {
          console.log('removed from guest cart');
          console.log('cartID'+cartID);
          console.log('productID'+productID);
          /*var url = baseUrl+'api/addToCart_guest';
            var postData = {cartID:cartID,productID:productID};
            var configObj = { method: 'POST',url: url, data: postData, headers: headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        if(dataJson !== undefined && dataJson.length > 0 ){
                         grp_cartId     = dataJson.grp_cartId;
                        }
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 
          */
        };
        

        $scope.getProducts = function () {
                var lastProductID = $scope.lastProductID;
                if(lastProductID === undefined){
                    lastProductID = vm.lastProductID;
                }
                var nextProducts = 16;
                var body = '';
                var data = '';
                var url = ApiBaseUrl+'getAllProdsInLocDefault/PK/'+lastProductID+'/'+nextProducts;
                
               
                var configObj = { method: 'GET',url: url, headers: headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        body = response.data;
                        var newData = JSON.stringify(body);
                        data = JSON.parse(newData);
                        //console.log(data);
                        console.log(data.length);
                     if(data.length < 2){
                        $scope.stopTimeout();
                      }
                         $scope.addObject(data);
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 
        };
        $scope.addObject = function (data) {
                var counter = 0;
                 angular.forEach(data,function(value){
                    counter++;
                    $scope.lastProductID = value.prod.prodBrandId;
                    if(counter === 1){
                      $scope.arctr.products[0].col1.push(value);
                    }
                    if(counter === 2){
                      $scope.arctr.products[1].col2.push(value);
                    }
                    if(counter === 3){
                      $scope.arctr.products[2].col3.push(value);
                    }
                    if(counter === 4){
                      $scope.arctr.products[3].col4.push(value);
                      counter = 0;
                    }
                    
                });
                
        };
      }
})();
