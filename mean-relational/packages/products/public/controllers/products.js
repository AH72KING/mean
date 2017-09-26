'use strict';
/*import {Observable} from 'rxjs/observable';
import 'rxjs/RX';
import 'rxjs/add/operator/map';*/
(function(){
    angular
      .module('mean.products')
      .controller('productsController',productsController)
      .directive('sidenavPushIn',sidenavPushIn);

      productsController.$inject = ['$stateParams', '$location', 'Global', 'products','$state', '$scope', '$timeout', '$http', 'Session', '$mdSidenav', '$mdUtil','$log'];

  function productsController($stateParams, $location, Global, products, $state, $scope, $timeout, $http, Session, $mdSidenav, $mdUtil, $log){
        var vm = this;
        var baseUrl = 'http://localhost:3000/';
        var ip = '192.168.100.88';
        //var ip = '192.168.1.88';
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
        $scope.cart = []; // cart Array



        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.lockLeft = false;
        $scope.isLeftOpen = function() {
          return $mdSidenav('left').isOpen();
        }
        $scope.isRightOpen = function() {
          return $mdSidenav('right').isOpen();
        }

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildToggler(navID) {
          var debounceFn = $mdUtil.debounce(function() {
            $mdSidenav(navID)
              .toggle()
              .then(function() {
                $log.debug("toggle " + navID + " is done");
              });
          }, 300);

          return debounceFn;
        }

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
            //products.query(function(products) {
            products.get(function(products) {
                 vm.products = products;
                 console.log(products);
                 grp_cartId = products['grp_cartId'];
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
            //var prodBrandId = CurrentProduct.attr('data-product-grp-cart-id');
            if(prodBrandId !== undefined){
              if(!cartCreated){
                if(isGuest){  
                  $scope.createCart_guest(prodBrandId);
                }
              }else{
                if(isGuest){  
                  $scope.addToCart_guest(grp_cartId,prodBrandId);
               }
              }
            }
        };
        $scope.productDropOutFromCart  = function (event , ui) {   
            var CurrentProduct = ui.draggable;
            //var prodBrandId = CurrentProduct.attr('data-product-id'); 
            var prodBrandId   = CurrentProduct.attr('data-product-grp-cart-id');
            var ProductIndex  = CurrentProduct.attr('data-index');
            var ProductArrayType  = CurrentProduct.attr('data-type');
            if(ProductArrayType !== undefined && ProductArrayType === 'grpcart_products'){
              //unset($scope.products[6]['grpcart_products'][ProductIndex]);
              //myArray.splice(key, 1);
              //console.log(ProductIndex);
              //console.log(vm.products[6].grpcart_products);
              //console.log(vm.products[6].grpcart_products[ProductIndex]);
              vm.products[6].grpcart_products.splice(ProductIndex, 1)
               //console.log(vm.products[6].grpcart_products);
            }
            if(ProductArrayType !== undefined && ProductArrayType === 'cart'){
              //unset($scope.cart[ProductIndex]);
              //console.log($scope.cart);
              //console.log(ProductIndex);
              $scope.cart.splice(ProductIndex, 1);
              //console.log($scope.cart);
            }
            
              ui.draggable.remove();
            if(prodBrandId !== undefined && grp_cartId !== undefined){
              $scope.nl_removefromCart(grp_cartId,prodBrandId);
            }
        };

/*        $scope.cartTotalPriceF = function () {   
            var itemsAddInCart = $scope.cart;
            var itemsInCart    = vm.products.products[6].grpcart_products;
            var itemsInCartPrice = 0;

            for (var i = 0; i < itemsInCart.length - 1; i++) {
              itemsInCartPrice = itemsInCartPrice + itemsInCart[i].cost_price;
            }
           for (var i = 0; i < itemsAddInCart.length - 1; i++) {
              itemsInCartPrice = itemsInCartPrice + itemsAddInCart[i].prod.cost_price;
            }
            console.log(itemsInCartPrice);
        };

        $scope.cartTotalProductsF = function () {   
            var itemsAddInCart = $scope.cart;
            var itemsInCart    = vm.products.products[6].grpcart_products;
            var TotalItemsInCart    = itemsInCart.length+itemsAddInCart.length ;
            console.log(TotalItemsInCart);
        };
         $scope.cartTotalPrice    = $scope.cartTotalPriceF();
       $scope.cartTotalProducts   = $scope.cartTotalProductsF();*/
    
    
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
        $scope.nl_removefromCart  = function (cartID, productID) {
          //console.log('removed from guest cart');
          //console.log('cartID'+cartID);
          //console.log('productID'+productID);
            var url = baseUrl+'api/nl_removefromCart';
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
function sidenavPushIn(){
        return {
            restrict: 'A',
            require: '^mdSidenav',
            link: function ($scope, element, attr, sidenavCtrl) {
                var body = angular.element(document.body);
                body.addClass('md-sidenav-push-in');
                var cssClass = (element.hasClass('md-sidenav-left') ? 'md-sidenav-left' : 'md-sidenav-right') + '-open';
                var stateChanged = function (state) {
                    body[state ? 'addClass' : 'removeClass'](cssClass);
                };
                // overvwrite default functions and forward current state to custom function
                angular.forEach(['open', 'close', 'toggle'], function (fn) {
                    var org = sidenavCtrl[fn];
                    sidenavCtrl[fn] = function () {
                        var res = org.apply(sidenavCtrl, arguments);
                        stateChanged(sidenavCtrl.isOpen());
                        return res;
                    };
                });
            }
        };
    }
