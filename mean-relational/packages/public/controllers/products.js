'use strict';
(function(){
   var $anerveModule =  angular
      .module('Anerve');
      $anerveModule.
      filter('htmlToPlaintext', function() {
          return function(text) {
            return angular.element(text).text();
          };
        }
      );
      $anerveModule.controller('productsController',productsController);
      productsController.$inject = ['$stateParams', '$location', 'Global', 'products', '$state', '$scope', '$timeout', '$http', 'Session', '$mdSidenav', '$mdUtil','$sce', '$rootScope'];
      function productsController($stateParams, $location, Global, products, $state, $scope, $timeout, $http, Session, $mdSidenav, $mdUtil, $sce, $rootScope ){
      var vm = this;
        // bind functions

        $rootScope.addPaymentButton     = true;
        $rootScope.addShippingButton    = false;
        $rootScope.hideShippingAddress  = true;
        $rootScope.hidePayment          = true;
        $rootScope.hideMyZoneCart       = false; 
        $rootScope.proceedButton        = false;
        $rootScope.paymentFormButton    = false;
        $rootScope.paymentButton        = false;
        $rootScope.shippingAddressAdded = false;
        $rootScope.showPaymentCompleteMsg = false;

        $rootScope.AislesIsSelected = false;

        var cartCreated = false;
        var grp_cartId = null;
        var isGuest = true; 

        $rootScope.CurrentProductDetail  = '';
        $rootScope.CurrentProductDetailImage  = '';

        $rootScope.cart = []; // cart Array
        $rootScope.friendsCart = []; // friends in cart Array
        $rootScope.userFirends = []; // friends Array;
        var userFirends = [];
        $rootScope.userFirends = userFirends;
        

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildToggler(navID) {
          var debounceFn = $mdUtil.debounce(function() {
            $mdSidenav(navID)
              .toggle()
              .then(function() {
                //$log.debug("toggle " + navID + " is done");
              });
          }, 300);

          return debounceFn;
        }

        $rootScope.toTrustedHTML = function (html) {
          return $sce.trustAsHtml(html);
        };
        

        $rootScope.hideMe = function() {
          if($rootScope.products !== undefined){
            return $rootScope.products.length > 0;
          }else{
            return false;
          }
        };

        $rootScope.showPaymentForm = function() {
            $rootScope.addPaymentButton = false;
            $rootScope.hidePayment = false;
            $rootScope.addShippingButton = false; 
            $rootScope.hideMyZoneCart = true;
            $rootScope.paymentFormButton = true;
            $rootScope.paymentButton = false; 
        };
        $rootScope.submitPaymentForm = function() {
            $rootScope.hidePayment = true;
            $rootScope.hideShippingAddress = false;
            $rootScope.proceedButton = true;
            $rootScope.paymentFormButton = false; 
            

           $rootScope.paymentInformations={
              card:this.card,
              month:this.month,
              year:this.year,
              cvc:this.cvc
            };
             console.log($rootScope.paymentInformations);
        };
     

        $rootScope.showShippingAddressForm = function() {
            $rootScope.hidePayment = true;
            $rootScope.hideShippingAddress = false; 
            $rootScope.hideMyZoneCart = true;
            $rootScope.proceedButton = true;
            $rootScope.paymentButton = false;  
             
        };
        
        $rootScope.submitShippingAddressForm = function() {  
            $rootScope.shippingAddressAdded = true;
            $rootScope.addShippingButton = false;
            $rootScope.paymentButton = true;
            $rootScope.proceedButton = false;
            $rootScope.hideMyZoneCart = false;
            $rootScope.hideShippingAddress = true; 
            $rootScope.shippingInformations={
              first_name:this.first_name,
              last_name:this.last_name,
              email:this.email,
              mobile:this.mobile,
              street:this.street,
              city:this.city,
              postcode:this.postcode,
              country:this.country
            };
             console.log($rootScope.shippingInformations);
        };

        $rootScope.doPayment = function() {
          console.log($rootScope.shippingInformations);
          var shippingInformations  = $rootScope.shippingInformations;
          var paymentInformations   = $rootScope.paymentInformations;
            var totalAmountToPay    = $rootScope.cartTotalPrice;
                totalAmountToPay    = totalAmountToPay.toFixed(2).toString();
                totalAmountToPay    = parseInt(totalAmountToPay.replace('.',''));
            
            //var Token = '';
           Stripe.setPublishableKey('pk_test_sZay0UdHi8gZBfIRtvWefcLy');
           Stripe.card.createToken({
              number: paymentInformations.card,//'4242424242424242',
              exp_month: paymentInformations.month,//'12',
              exp_year: paymentInformations.year,//'2018',
              cvc: paymentInformations.cvc,//'123',
              name: shippingInformations.first_name+' '+shippingInformations.last_name,
              address_line1: shippingInformations.street,
              address_city: shippingInformations.city,
              address_country: shippingInformations.country,
              //address_state: 'Punjab',
              address_zip: shippingInformations.postcode
            }, stripeResponseHandler2);
        };

        function stripeResponseHandler2(status, token){
            console.log('stripeResponseHandler2');
            console.log(token);
            var url = $rootScope.baseUrl+'api/charge';

             var totalAmountToPay = $rootScope.cartTotalPrice;
                totalAmountToPay = totalAmountToPay.toFixed(2).toString();
                totalAmountToPay = parseInt (totalAmountToPay.replace('.',''));


            var TokenId = token.id;
            console.log(TokenId);
            var CardID = token.card.id;
            var Email   = 'ahsandev.creative@gmail.com';//token.email;
            var Amount   = totalAmountToPay;
            var postData = {
              TokenId:TokenId,
              Email:Email,
              Amount:Amount,
              CardID:CardID
            };
             var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                  $http(configObj)
                      .then(function onFulfilled(response) {
                        console.log('stripeResponseHandler2onFulfilled');
                          var dataJson    = JSON.parse(JSON.stringify(response.data));
                          var status      = dataJson.status;
                          //var object      = dataJson.object;
                          //var seller_message = dataJson.outcome.seller_message;
                          console.log(dataJson);
                          if(status === 'succeeded'){
                              $rootScope.paymentButton = false;
                              $rootScope.hideMyZoneCart = true;

                              $rootScope.showPaymentCompleteMsg = true;

                          }
                      }).catch( function onRejection(errorResponse) {
                          console.log('Error: ', errorResponse.status);
                          console.log(errorResponse);
                  }); 
        }
        
        $rootScope.showProductDetail = function(productID) {
            console.log('showProductDetail');
            console.log(productID);   
              if(angular.isNumber(productID)){
                $rootScope.CurrentProductDetail = $rootScope.CurrentProduct(productID);
                $rootScope.groupCartId = grp_cartId;
                $rootScope.isProductDetailOpen();
              }
        };
        $rootScope.showUserCart = function(grp_cartId, USERID){
          
              if(angular.isNumber(grp_cartId) && angular.isNumber(USERID) ){
                console.log(grp_cartId +' cart belong to user id '+ USERID);
                $rootScope.CurrentUserBuyerDetail = $rootScope.CurrentUserBuyer(grp_cartId,USERID);
                $rootScope.isUserDetailOpen();
              }
        };

          
        $rootScope.showCurrentImage  = function(imageSrc,$event) {   
          console.log(imageSrc);
          console.log($event.currentTarget.src);
          console.log($rootScope.CurrentProductDetailImage);
          if($event.currentTarget.src === imageSrc && imageSrc !== $rootScope.CurrentProductDetailImage ){
            $event.currentTarget.src = $rootScope.CurrentProductDetailImage;
            $rootScope.CurrentProductDetailImage = imageSrc;
          }else{
            if(imageSrc !== $rootScope.CurrentProductDetailImage ){
              var temp = $event.currentTarget.src;
              $event.currentTarget.src = $rootScope.CurrentProductDetailImage;
              $rootScope.CurrentProductDetailImage = temp;
            }else{
              var temp1 = $event.currentTarget.src;
              $event.currentTarget.src = $rootScope.CurrentProductDetailImage;
              $rootScope.CurrentProductDetailImage = temp1;
            }
          }
        };

        vm.timeInMs = 0;
        vm.global = Global;
        $rootScope.lastProductID = 1;

        //declare and use methods
        vm.create = create;
        vm.remove = remove;
        vm.update = update;
        vm.find = find;
        vm.findOne = findOne;

        $rootScope.$watch('lastProductID', function() {
            //alert('hey, lastProductID has changed!');
        });
      

        //methods
         function create() {
           /* var product = new Products({
                title: vm.title,
                content: vm.content
            });

            product.$save(function(response) {
                $location.path('/' + response.id);
            });

            vm.title = '';
            vm.content = '';*/
        }

        function remove(product) {
            if (product) {
                product.$remove();

                for (var i in $rootScope.products) {
                    if ($rootScope.products[i] === product) {
                        $rootScope.products.splice(i, 1);
                    }
                }
            }
            else {
                $rootScope.product.$remove(function(){
                  $state.go('products');
                });
            }
        }

        function update() {
            var product = $rootScope.product;
            if (!product.updated) {
                product.updated = [];
            }
            product.updated.push(new Date().getTime());

            product.$update(function() {
                $location.path('/' + product.id);
            });
        }

        function find() {
            //products.query(function(products) {
            products.get(function(products) {
                 $rootScope.products = products;
                 grp_cartId = products['grp_cartId'];
                 $rootScope.cartTotalPrice = products['TotalCartPrice'];
                 $rootScope.lastProductID = 1;
                 getList();
                 $rootScope.isLoaded = true;
            });
         }

        function findOne() {
            products.get({
                productId: $stateParams.productId
              }, function(product) {
                $rootScope.product = product;
            });
        }
        $rootScope.CurrentUserBuyer  = function(grp_cartId, USERID) {
                    var url = $rootScope.baseUrl+'api/getUserDetail';
                    var postData = {
                      grp_cartId:grp_cartId,
                      USERID:USERID
                    };
                    var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                      $http(configObj)
                          .then(function onFulfilled(response) {
                              var newData = JSON.stringify(response.data);
                              newData = JSON.parse(newData);
                              console.log('getUserDetail');
                              console.log(newData);
                              $rootScope.CurrentUserBuyerDetail = newData;
                          }).catch( function onRejection(errorResponse) {
                              console.log('Error: ', errorResponse.status);
                              console.log(errorResponse);
                      });
                    url = $rootScope.baseUrl+'api/getUserProductDetails';
                    configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                      $http(configObj)
                          .then(function onFulfilled(response) {
                              var newData = JSON.stringify(response.data);
                              newData = JSON.parse(newData);
                              console.log('getUserProductDetails');
                              console.log(newData);
                              $rootScope.CurrentUserBuyerProductsDetail = newData;
                          }).catch( function onRejection(errorResponse) {
                              console.log('Error: ', errorResponse.status);
                              console.log(errorResponse);
                      });  
               
        };
        $rootScope.GetFriendCart1  = function(USERID) {
                    var url = $rootScope.baseUrl+'api/getUserDetail';
                    var postData = {
                      USERID:USERID
                    };
                    var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                      $http(configObj)
                          .then(function onFulfilled(response) {
                              var newData = JSON.stringify(response.data);
                              newData = JSON.parse(newData);
                              console.log('getUserDetail');
                              console.log(newData);
                              $rootScope.CurrentUserBuyerDetail = newData;
                          }).catch( function onRejection(errorResponse) {
                              console.log('Error: ', errorResponse.status);
                              console.log(errorResponse);
                      });
                    url = $rootScope.baseUrl+'api/getUserProductDetails';
                    configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                      $http(configObj)
                          .then(function onFulfilled(response) {
                              var newData = JSON.stringify(response.data);
                              newData = JSON.parse(newData);
                              console.log('getUserProductDetails');
                              console.log(newData);
                              $rootScope.CurrentUserBuyerProductsDetail = newData;
                          }).catch( function onRejection(errorResponse) {
                              console.log('Error: ', errorResponse.status);
                              console.log(errorResponse);
                      });  
               
        };
        
        
        
        


       $rootScope.CurrentProduct = function(productId) {
            products.get({
                productId: productId
              }, function(product) {
                $rootScope.CurrentProductDetail = product;
                if(product !== undefined){
                  $rootScope.CurrentProductDetailImage = $rootScope.ApiUploadUrl+product.img_loc;
                  var url = $rootScope.baseUrl+'api/getProductBuyingUsers';
                  var postData = {
                    productId:productId
                  };

                  var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};

                    $http(configObj)
                        .then(function onFulfilled(response) {
                            var newData = JSON.stringify(response.data);
                            newData = JSON.parse(newData);
                            product.buyingUser = newData.grpCartDataResponse;
                            $rootScope.CurrentProductDetail = product;
                        }).catch( function onRejection(errorResponse) {
                            console.log('Error: ', errorResponse.status);
                            console.log(errorResponse);
                    }); 


                }
                return product;
            });
        };


       function getList(){
           $rootScope.startTimeout();
        }

        $rootScope.startCount = 0;  
        $rootScope.startTimeout = function () {  
            $rootScope.startCount = $rootScope.startCount + 1;  
            $rootScope.getProducts();
            $rootScope.mytimeout = $timeout($rootScope.startTimeout, 100000);  
        };

        $rootScope.stopTimeout = function () {  
            $timeout.cancel($rootScope.mytimeout);  
            $rootScope.NoMoreProductToFetch = true;
            console.log('Timer Stopped No More Products');  
        };

        

        $rootScope.getProducts = function () {
                var lastProductID = $rootScope.lastProductID;
                var nextProducts = 4;
                var body = '';
                var data = '';
                if(lastProductID === undefined){
                    lastProductID = $rootScope.lastProductID;
                }
                var url = $rootScope.ApiBaseUrl+'getAllProdsInLocDefault_thin/PK/'+lastProductID+'/'+nextProducts;
                if($rootScope.AislesIsSelected){
                   url = $rootScope.ApiBaseUrl+'getAllProdsInLocDefaultInAisle_mini/PK/'+lastProductID+'/'+nextProducts+'/'+$rootScope.AislesSelectedID;
                }
                var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        body = response.data;
                        var newData = JSON.stringify(body);
                        data = JSON.parse(newData);

                          if(data.length < 2){
                            //console.log(data);
                            $rootScope.stopTimeout();
                          }

                          $rootScope.addObject(data);

                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 
        };
        $rootScope.getAisleProducts = function (aisle,lastAisleProductID = null) {
                if(lastAisleProductID === undefined){
                    lastAisleProductID = $rootScope.lastAisleProductID;
                }
                if(lastAisleProductID == null){
                  lastAisleProductID = 0;
                }

                var nextProducts = 3;
                var aisleId = aisle.aisleId;

                if(aisleId !== undefined && aisleId !== null){
                  $rootScope.aisleId = aisleId;
                }
                var body = '';
                var data = '';
                var url = $rootScope.ApiBaseUrl+'getAllProdsInLocDefaultInAisle_mini/PK/'+lastAisleProductID+'/'+nextProducts+'/'+aisleId;
                var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        body = response.data;
                        var newData = JSON.stringify(body);
                        data = JSON.parse(newData);

                          if(data.length < 2){
                            //console.log(data);
                            $rootScope.stopTimeout();
                          }

                          $rootScope.addObject(data);

                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 
        };

        $rootScope.addObject = function (data) {
              if(data !== undefined){
                var counter = 0;
                var localLoopProductBrandID = 1;
                 angular.forEach(data,function(value){
                    value.ProdBrandId = value.prodBrandId;
                    //removing conflicts of case Product Brand ID
                    counter++;
                    
                    if(counter === 1){
                      $rootScope.products['col1'].push(value);
                    }
                    if(counter === 2){
                      $rootScope.products['col2'].push(value);
                    }
                    if(counter === 3){
                      $rootScope.products['col3'].push(value);
                    }
                    if(counter === 4){
                      $rootScope.products['col4'].push(value);
                      counter = 0;
                    }
                    localLoopProductBrandID = value.ProdBrandId;         
                });
                $rootScope.lastProductID = localLoopProductBrandID;  
              }else{
                console.log('Product Public Controller Add Object Undefined Data');
              } 
        };

        $rootScope.productDropInCart  = function (event , ui) {   
            var CurrentProduct = ui.draggable;
            var ProdBrandId = CurrentProduct.attr('data-product-id');
            //var ProdBrandId = CurrentProduct.attr('data-product-grp-cart-id');
            if(ProdBrandId !== undefined){
              if(!cartCreated){
                if(isGuest){  
                  $rootScope.createCart(ProdBrandId);
                }
              }else{
                if(isGuest){  
                  $rootScope.addToCart(grp_cartId,ProdBrandId);
               }
              }
            }
        };
        $rootScope.productDropOutFromCart  = function (event , ui) {   
            var CurrentProduct = ui.draggable;
            //var ProdBrandId = CurrentProduct.attr('data-product-id'); 
            var ProdBrandId   = CurrentProduct.attr('data-product-grp-cart-id');
            var ProductIndex  = CurrentProduct.attr('data-index');
            var ProductArrayType  = CurrentProduct.attr('data-type');
            if(ProductArrayType !== undefined && ProductArrayType === 'grpcart_products'){
              $rootScope.products.grpcart_products.splice(ProductIndex, 1);
            }
            if(ProductArrayType !== undefined && ProductArrayType === 'cart'){
              $rootScope.cart.splice(ProductIndex, 1);
            }
            
              ui.draggable.remove();
            if(ProdBrandId !== undefined && grp_cartId !== undefined){
              $rootScope.nl_removefromCart(grp_cartId,ProdBrandId);
            }
        };

        // drop in cart
        $rootScope.dropInCart = function(event, ui){ 
            var draggableElement = ui.draggable;
            var prodId = draggableElement.attr('data-product-id');
            var friendId = draggableElement.attr('data-friend-id'); 
            if(typeof prodId != 'undefined' && prodId != null){
              var img = draggableElement.find('.product_image').find('img').attr('src');
              $rootScope.addorCreateCart(prodId, img);
              notify('Adding Product To Cart...','info');
            }
            else if(typeof friendId != 'undefined' && friendId != null){console.log(friendId);
              $rootScope.addUserToCart(draggableElement);
              notify('Adding User To Cart...','info');
            }

        };
        // drop out from cart
        $rootScope.dropOutFromCart = function(event, ui){
           var draggableElement = ui.draggable;
           console.log(draggableElement);
            var prodId = draggableElement.attr('data-product-id');
            var friendId = draggableElement.attr('data-friend-id');
            if(typeof prodId != 'undefined' && prodId != null){
              $rootScope.removeProdFromCart(draggableElement);
              notify('Removing Product From Cart...','info');
            }
            else if(typeof friendId != 'undefined' && friendId != null){
              $rootScope.removeUserFromCart(draggableElement);
              notify('Removing User From Cart...','info');
            }
            draggableElement.remove();
        };

        $rootScope.addToCartBtn = function(prodId, img){
          $rootScope.addorCreateCart(prodId, img);
        };

        $rootScope.addorCreateCart = function(prodId, img){   
          $rootScope.cart.push({
            'userid':prodId,
            'img_loc':img
          });
          if(!cartCreated){
            if(isGuest){  
              $rootScope.createCart(prodId);
            }
          }else{
            if(isGuest){  
              $rootScope.addToCart(grp_cartId,prodId);
           }
          }
        };
         // add user to cart
        $rootScope.addUserToCart = function(user){ 
          var userId = user.attr('data-friend-id');
          var img = user.find('img').attr('src');
          var Online = user.find('img').parent().hasClass('online');
          console.log('Online: '+Online);
          //if(list.indexOf(createItem.artNr) !== -1) {
          console.log($rootScope.friendsCart);
          if (!userExistsInCart(userId)) {
            $rootScope.friendsCart.push({
              'userid':userId,
              'img_loc':img,
              'online':Online
            });
            console.log($rootScope.friendsCart);
            $rootScope.addUserToCartAjax(grp_cartId, userId);
              var usrIndex = user.attr('data-index');
              $rootScope.userFirends[usrIndex]['followId'] = userId;
          }else{
            console.log('User '+userId+' Already in cart');
          }
        };

        // remove prod from cart
        $rootScope.removeProdFromCart = function(prod){
            //var ProdBrandId = CurrentProduct.attr('data-product-id'); 
            var ProdBrandId   = prod.attr('data-product-grp-cart-id');
            var ProductIndex  = prod.attr('data-index');
            var ProductArrayType  = prod.attr('data-type');
            if(ProductArrayType !== undefined && ProductArrayType === 'grpcart_products'){
              $rootScope.products.grpcart_products.splice(ProductIndex, 1);
            }
            if(ProductArrayType !== undefined && ProductArrayType === 'cart'){
              $rootScope.cart.splice(ProductIndex, 1);
            }
            
              prod.remove();
            if(ProdBrandId !== undefined && grp_cartId !== undefined){
              $rootScope.nl_removefromCart(grp_cartId,ProdBrandId);
            }
        };

        // remove prod button click
        $rootScope.removeProdBtn = function(prodId, index){
          if(prodId !== undefined && grp_cartId !== undefined){
              $rootScope.nl_removefromCart(grp_cartId,prodId);
              $rootScope.CurrentUserBuyerProductsDetail.splice(index, 1);
            }
        };

        // remove user from cart 
        $rootScope.removeUserFromCart = function(user){
             var userId   = user.attr('data-friend-id');
            var userIndex  = user.attr('data-index');
            var userArrayType  = user.attr('data-type');
            if(userArrayType !== undefined && userArrayType === 'grpcart_products'){
              $rootScope.products.friendsCart.splice(userIndex, 1);
            }
            if(userId !== undefined && grp_cartId !== undefined){
             console.log('User id : '+userId);
              $rootScope.removeUserFromCartAjax(grp_cartId,userId);
            }
        };

        // remove user icon in side cart window
        $rootScope.removeCartUsr = function(usrId, index){
          $rootScope.removeUserFromCartAjax(grp_cartId,usrId);
          $rootScope.cartUsers.splice(index, 1);
        };

        $rootScope.createCart  = function (ProdBrandId) {
           var url = $rootScope.baseUrl+'api/createCart';
           var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
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
                          console.log('ProdBrandId:'+ProdBrandId);
                          if(grp_cartId !== undefined){
                            $rootScope.addToCart(grp_cartId, ProdBrandId);
                          }
                        }

                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 

        };
         $rootScope.addToCart  = function (cartID, productID) {
          var url = $rootScope.baseUrl+'api/addToCart';
          var postData = {cartID:cartID,productID:productID};
          var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        closeNoti();
                        notify('Product Added To Cart','success');
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        if(dataJson !== undefined){

                          grp_cartId            = dataJson.grp_cartId;
                          $rootScope.cartItemCount  = dataJson.count;
                          $rootScope.cartTotalPrice = dataJson.current_total;
                          $rootScope.cartCurrency   = dataJson.currency;

                          /*var cart_items     = dataJson.cart_items;
                          var cartUsers      = dataJson.cartUsers;
                          var cart_chats     = dataJson.cart_chats;
                          var cart_events    = dataJson.cart_events;
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

        // add user to cart
        $rootScope.addUserToCartAjax = function(cartId, userId){ 
          var url = $rootScope.baseUrl+'api/addUserToCart';
          var postData = {cartID:cartId,userId:userId};
          var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
          $http(configObj)
              .then(function onFulfilled(response) {
                closeNoti();
                notify('User Added To Cart','success');
                console.log(response);
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse.status);
          }); 
        };

        $rootScope.removeUserFromCartAjax= function(cartId,userId){
          var url = $rootScope.baseUrl+'api/removeUserFromCart';
          var postData = {cartID:cartId,userId:userId};
          var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
          $http(configObj)
              .then(function onFulfilled(response) {
                closeNoti();
                notify('User Removed From Cart','success');
                console.log(response);
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse.status);
          }); 
        };

        $rootScope.nl_removefromCart  = function (cartID, productID) {
            var url = $rootScope.baseUrl+'api/nl_removefromCart';
            var postData = {cartID:cartID,productID:productID};
            var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                      closeNoti();
                      notify('Product Removed From Cart','success');
                        var dataJson = JSON.parse(JSON.stringify(response.data));

                        if(dataJson !== undefined){
 
                          grp_cartId            = dataJson.grpcartX.grp_cartId;
                          $rootScope.cartItemCount  = dataJson.grpcartX.count;
                          $rootScope.cartTotalPrice = dataJson.grpcartX.current_total;
                          $rootScope.cartCurrency   = dataJson.grpcartX.currency;

                        }
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 
          
        };
        $rootScope.myfriends  = function () {
          	var UserID 	= Session.getItem('UserID');
            var url     = $rootScope.baseUrl+'api/getAllUsers';
            var  configObj = { method: 'GET',url: url, headers: $rootScope.headers};
                  $http(configObj)
                      .then(function onFulfilled(response) {
                          var dataJson = JSON.parse(JSON.stringify(response.data));
                          if(dataJson !== undefined ){
                                angular.forEach(dataJson,function(value){
                                  if(value['USERID'] != UserID){if(value['USERID'])
                                     value['userid']  = value['USERID'];
                                     // check if avatar val null , then get default avatar
                                    value['img_loc'] = $rootScope.getDefaultAvatar(value['img_loc']);
                                    $rootScope.userFirends.push(value);
                                  }
                                  
                              });
                                Session.setItem('myfriends',$rootScope.userFirends);
                          }
                      }).catch( function onRejection(errorResponse) {
                          console.log('Error: ', errorResponse.status);
                          console.log(errorResponse);
                  });
          
        };
        $rootScope.myfriends();

        // send friend request
        $rootScope.sendFriendRequest = function(userid){
            var UserID = Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
                var key = Session.getItem('key_'+UserID);
                var url = $rootScope.ApiBaseUrl+'followUser';
                var postData = {key:key, query_userId:userid};
                var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        console.log(dataJson);
                        $rootScope.CurrentUserBuyerDetail.action = '01';
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 
        };

        // unfollow user
        $rootScope.unFollow = function(userid){
            var UserID  =  Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
                var key = Session.getItem('key_'+UserID);
                var url = $rootScope.ApiBaseUrl+'unfollowUser';
                var postData = {key:key, query_userId:userid};
                var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                         console.log(dataJson);
                        $rootScope.CurrentUserBuyerDetail.action = '03';
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 
        };

        // add comment to cart
        $rootScope.data = {};
        $rootScope.addCommentToCart = function(cartId){
          var comment = $rootScope.data.comment;
          var UserID  =  Session.getItem('UserID');
          if(typeof UserID != 'undefined' && UserID != null){
              var key   =  Session.getItem('key_'+UserID);
               console.log(key);
              var givename  =  Session.getItem('GIVNAME');
              var surname  =  Session.getItem('SURNAME');
              var img_loc  =  Session.getItem('img_loc');
              var newComment = {
                'GIVNAME' : givename,
                'SURNAME' : surname,
                'img_loc' : img_loc,
                'chat_text' : comment,
                'chattime' : new Date().toLocaleString()
              };
              if(typeof $rootScope.cartComments == 'undefined')
                $rootScope.cartComments = {};
              $rootScope.cartComments.push(newComment);
              var postData = {
                'comment' :{
                'grp_cartId' : cartId,
                'byUser'  : UserID,
                'chattime' : '2017-11-17 15:36:55',
                'chat_text': comment
              }
              } ;
              // insert into
              var url = $rootScope.baseUrl+'api/addCommentToCart';
              var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
              $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                         console.log(dataJson);
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 
          } 
        };

        // join cart
        $rootScope.joinCart = function(cartId){
          var UserID  =  Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
                var key   =  Session.getItem('key_'+UserID);
                var url = $rootScope.ApiBaseUrl+'joinCart/'+key+'/'+cartId;
                var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
                notify('Joining Cart ...','info');
                $http(configObj)
                    .then(function onFulfilled(response) {
                        closeNoti();
                        notify('Cart Successfully Joined','success');
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        $rootScope.isCartMember = true;
                        console.log(dataJson);
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 
        };
        // leave cart
        $rootScope.leaveCart = function(cartId){
          var UserID  =  Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
                var key = Session.getItem('key_'+UserID);
                var url = $rootScope.ApiBaseUrl+'leaveCart/'+key+'/'+cartId;
                var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
                $rootScope.isCartMember = false;
                notify('Leaving Cart ...','info');
                $http(configObj)
                    .then(function onFulfilled(response) {
                      console.log(response);
                        closeNoti();
                        notify('Cart Successfully Leaved','success');/*

                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        console.log(dataJson);*/
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 

        };
        // on product drag start
        $rootScope.onProdDragStart = function(event, ui){
          var dragElement = ui.helper;
          console.log(event);
          var x = event.pageX;
          var y = event.pageY; 
          console.log(x+','+y);
          dragElement.css('top',(x-35)+'px');
          dragElement.css('left',(y-35)+'px');
          dragElement.css({'min-height':'50px','width':'70px','height': '60px'});
          dragElement.find('img').css({'height':'50px','width':'50px'});
        };

        // on prod drag
        $rootScope.onProdDrag = function(event, ui){
          var dragElement = ui.helper;
          var relX = (event.pageX)+'px';
          var relY = (event.pageY)+'px';
          console.log(relY+','+relX);
          dragElement.css({'top':'0!important', 'left':'0!important'});
        };

        // drop prod on user
        $rootScope.dropOnUser = function(event, ui){
          var dragElement = ui.draggable;
          var usrId = this.friends.userid;
          var prodId = dragElement.attr('data-product-id');
          $rootScope.suggestProdToUsr(usrId, prodId);
          notify('Suggesting Product ...','info');
        };

        // suggest prod to usr
        $rootScope.suggestProdToUsr = function(usrId, prodId){
          var postData = {'usrId':usrId, 'prodId':prodId};
          var url = $rootScope.baseUrl+'api/suggestProd';
          var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
          // $rootScope.isCartMember = false;
          $http(configObj)
              .then(function onFulfilled(response) {
                closeNoti();
                notify('Product Suggested To Cart','success');
                console.log(response);
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse);
          }); 
        };

        // accept product
        $rootScope.acceptProdInCart = function(prodId){
          notify('Accepting Product ...','info');
          var postData = {'cartId':grp_cartId, 'prodId':prodId};
          var url = $rootScope.baseUrl+'api/acceptProdInCart';
          var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
          // $rootScope.isCartMember = false;
          $http(configObj)
              .then(function onFulfilled(response) {
                closeNoti();
                notify('Product Accepted','success');
                console.log(response);
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse);
          }); 
        };


        $rootScope.getDefaultAvatar = function(url){
          if(url == null)
            url = '/images/default-avatar.png';
          return url;
       };
       function userExistsInCart(userID) {
            for (var i = 0, len = $rootScope.friendsCart.length; i < len; i++) {
                if ($rootScope.friendsCart[i].userid === userID)
                    return true;
            }

            return false;
        }

        if (window.user != null && window.user.connections != null && window.user.connections != ''){
            var connections = JSON.parse(window.user.connections);
            if(connections.twitter != undefined && connections.twitter != 0 ){
              // get twitter timeline
              function timeline(){
                var url = $rootScope.baseUrl+'api/timeline';
                var configObj = { method: 'POST',url: url, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        $rootScope.twitterPosts = response.data;
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse);
                }); 
              }
              timeline();

            

              // post tweet

              $rootScope.postTwitter =function(e){
                e.preventDefault();
                var url = $rootScope.baseUrl+'api/postTweet';
                var postData = {'msg':$rootScope.data.tw_text};
                console.log($rootScope.data.tw_file);/*
                if($rootScope.data.tw_file != "")
                  url =$rootScope.baseUrl+'api/postMediaTweet';*/
                var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                      if(response.status == 200){
                        if(typeof response.data != 'undefined' && typeof response.data.errors != 'undefined'){
                          var code = response.data.errors[0].code;
                          console.log(code);
                          //if(code == 144)
                            notify(response.data.errors[0].message);
                        } else {
                          notify('Status has been Updated Successfully','success');
                          $rootScope.postModal.modalClass = "hide-al";
                        }
                      }
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse);
                });
              };
            }


            if(connections.tumblr != undefined && connections.tumblr != 0 ){
              console.log('tumblr');
              // tumblr methods
              function tumblrPosts(){
                var url = $rootScope.baseUrl+'api/tumblrPosts';
                var configObj = { method: 'POST',url: url, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        $rootScope.tumblrPosts = response.data;
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse);
                }); 
              }
              tumblrPosts();

            }

            if(connections.instagram != undefined && connections.instagram != 0){
              function instagramPosts(){
                var url = $rootScope.baseUrl+'api/instagramPosts';
                var configObj = { method: 'POST',url: url, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        $rootScope.instagramPosts = response.data;
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse);
                }); 
              }
              instagramPosts();

            }
        }
        // watch
        $rootScope.uploadFile = function(element) {
            $rootScope.twfile = element;
            console.log(element);
        };

        $rootScope.getAisles = function(element){
          $rootScope.aisles = {};
          var url = $rootScope.baseUrl+'api/getAisles';
          var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
              $http(configObj).then(function onFulfilled(response) {
                   var dataJson    = JSON.parse(JSON.stringify(response.data));
                   $rootScope.aisles = response.data;
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse);
              });     
        };
        $rootScope.getAisles();

        

        // get facebook post
        function fbposts(){
          var url = $rootScope.baseUrl+'api/fbposts';
          var configObj = { method: 'POST',url: url, data:{}, headers: $rootScope.headers};
          $http(configObj)
              .then(function onFulfilled(response) {
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse);
          }); 
        }
        fbposts();

        vm.loginUser = {};
        //declare scope methods controllers
        $rootScope.loginUser = function(){
           $rootScope.UserLoginInJava(vm.loginUser);
        };
        
        /*// get googleplus post
        function gplus(){
          var url = $rootScope.baseUrl+'api/gplus';
          var configObj = { method: 'POST',url: url, data:{}, headers: $rootScope.headers};
          $http(configObj)
              .then(function onFulfilled(response) {
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse);
          }); 
        }
       gplus();*/

      }

})();
