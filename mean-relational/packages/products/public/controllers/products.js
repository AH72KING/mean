'use strict';
/*import {Observable} from 'rxjs/observable';
import 'rxjs/RX';
import 'rxjs/add/operator/map';*/
(function(){
    angular
      .module('mean.products')
      .controller('productsController',productsController);
      
      //,'$log'
      productsController.$inject = ['$stateParams', '$location', 'Global', 'products', '$state', '$scope', '$timeout', '$http', 'Session', '$mdSidenav', '$mdUtil','$sce'];

  function productsController($stateParams, $location, Global, products, $state, $scope, $timeout, $http, Session, $mdSidenav, $mdUtil,$sce){
        var vm = this;

       // var baseUrl = 'http://localhost:3000/';
        var ip = window.ip;
       //var UploadUrl = 'http://'+ip+':8080/Anerve/images/';
       // var UploadUrl = 'http://localhost:3000/products/assets/';
       // var ApiBaseUrl = 'http://'+ip+':8080/Anerve/anerveWs/AnerveService/';
       /* var headers = {
                   'Access-Control-Allow-Origin': '*',
                   'Content-Type' : 'application/json; charset=UTF-8',
                   'Access-Control-Allow-Headers': 'content-type, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                   'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT',
                   'Access-Control-Max-Age': '3600',
                   'Access-Control-Allow-Credentials': 'true'
                };*/
        // bind functions


        $scope.cartTotalPrice        = 0;/*
        $scope.UploadUrl            = UploadUrl;   */
        $scope.addPaymentButton     = true;
        $scope.addShippingButton    = false;
        $scope.hideShippingAddress  = true;
        $scope.hidePayment          = true;
        $scope.hideMyZoneCart       = false; 
        $scope.proceedButton        = false;
        $scope.paymentFormButton    = false;
        $scope.paymentButton        = false;
        $scope.shippingAddressAdded = false;
        $scope.showPaymentCompleteMsg = false;



        var cartCreated = false;
        var grp_cartId = null;
        var isGuest = true; 

        $scope.CurrentProductDetail  = '';
        $scope.CurrentProductDetailImage  = '';

        /*if(Session.getItem('grp_cartId') != undefined){
          cartCreated = true ;
          grp_cartId = Session.getItem('grp_cartId');
        }*/
        $scope.cart = []; // cart Array
        $scope.friendsCart = []; // friends in cart Array
        $scope.userFirends = []; // friends Array;
        var userFirends = [];
        vm.userFirends = userFirends;

        $scope.toggleLeft     = buildToggler('left');
        $scope.toggleRight    = buildToggler('right');
        $scope.ProductDetail  = buildToggler('ProductDetail');
        $scope.UserDetail     = buildToggler('UserDetail');
        $scope.lockLeft = false;
        $scope.lockRight = false;
        $scope.lockProductDetail = false;
        $scope.lockUserDetail = false;

        $scope.isLeftOpen = function() {
          return $mdSidenav('left').isOpen();
        };
        $scope.isRightOpen = function() {
          return $mdSidenav('right').isOpen();
        };
        $scope.isProductDetailOpen = function() {
          return $mdSidenav('ProductDetail').isOpen();
        };
        $scope.isUserDetailOpen = function() {
          return $mdSidenav('UserDetail').isOpen();
        };

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

        $scope.toTrustedHTML = function (html) {
          return $sce.trustAsHtml(html);
        };
        

        $scope.hideMe = function() {
          if(vm.products !== undefined){
            return vm.products.length > 0;
          }else{
            return false;
          }
        };

        $scope.showPaymentForm = function() {
            $scope.addPaymentButton = false;
            $scope.hidePayment = false;
            $scope.addShippingButton = false; 
            $scope.hideMyZoneCart = true;
            $scope.paymentFormButton = true;
            $scope.paymentButton = false; 
        };
        $scope.submitPaymentForm = function() {
            $scope.hidePayment = true;
            $scope.hideShippingAddress = false;
            $scope.proceedButton = true;
            $scope.paymentFormButton = false; 
            

           $scope.paymentInformations={
              card:this.card,
              month:this.month,
              year:this.year,
              cvc:this.cvc
            };
             console.log($scope.paymentInformations);
        };
     

        $scope.showShippingAddressForm = function() {

            /*var totalAmountToPay = $scope.cartTotalPrice;
                totalAmountToPay = totalAmountToPay.toFixed(2).toString();
                totalAmountToPay = parseInt (totalAmountToPay.replace('.',''));
            var Token = '';
            var checkoutHandler = (window).StripeCheckout.configure({
              key: "pk_test_sZay0UdHi8gZBfIRtvWefcLy",
              locale: "auto"
            });   
            checkoutHandler.open({
              name: 'Anerve Shop',
              description: 'Friends Shopping Platform',
              amount:  totalAmountToPay,
              token: handleToken
            });*/
            $scope.hidePayment = true;
            $scope.hideShippingAddress = false; 
            $scope.hideMyZoneCart = true;
            $scope.proceedButton = true;
            $scope.paymentButton = false;  
             
        };
        
        $scope.submitShippingAddressForm = function() {  
            $scope.shippingAddressAdded = true;
            $scope.addShippingButton = false;
            $scope.paymentButton = true;
            $scope.proceedButton = false;
            $scope.hideMyZoneCart = false;
            $scope.hideShippingAddress = true; 
            $scope.shippingInformations={
              first_name:this.first_name,
              last_name:this.last_name,
              email:this.email,
              mobile:this.mobile,
              street:this.street,
              city:this.city,
              postcode:this.postcode,
              country:this.country
            };
             console.log($scope.shippingInformations);
        };

        $scope.doPayment = function() {
          console.log($scope.shippingInformations);
          var shippingInformations  = $scope.shippingInformations;
          var paymentInformations   = $scope.paymentInformations;
            var totalAmountToPay    = $scope.cartTotalPrice;
                totalAmountToPay    = totalAmountToPay.toFixed(2).toString();
                totalAmountToPay    = parseInt(totalAmountToPay.replace('.',''));
            
            //var Token = '';
            Stripe.setPublishableKey('pk_test_sZay0UdHi8gZBfIRtvWefcLy');
            /*var checkoutHandler = (window).StripeCheckout.configure({
              key: 'pk_test_sZay0UdHi8gZBfIRtvWefcLy',
              locale: 'auto',
              token: function (token , args){
                 // args.billing_address_apt = '';
                  args.billing_address_city = shippingInformations.city;
                  args.billing_address_country = shippingInformations.country;
                  //args.billing_address_country_code = 'US';
                  args.billing_address_line1 = shippingInformations.street;
                  //args.billing_address_state = 'CA';
                  args.billing_address_zip = shippingInformations.postcode;
                  args.billing_name = shippingInformations.first_name+' '+shippingInformations.last_name;
                  //args.shipping_address_apt = '';
                  args.shipping_address_city = shippingInformations.city;
                  args.shipping_address_country = shippingInformations.country;
                  //args.shipping_address_country_code = 'US';
                  args.shipping_address_line1 = shippingInformations.street;
                  //args.shipping_address_state = 'CA';
                  args.shipping_address_zip = shippingInformations.postcode;
                  args.shipping_name =  shippingInformations.first_name+' '+shippingInformations.last_name;
                  console.log('args');
                  console.log(args);
                  console.log(token);

              }
            });  */ 

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
            

            /*checkoutHandler.open({
              name: 'Anerve Shop',
              description: 'Friends Shopping Platform',
              amount:  totalAmountToPay,
              shippingAddress: false,
              billingAddress: false,
              token: handleToken
            });*/



           /* var handler = (window).StripeCheckout.configure({
              key: 'pk_test_sZay0UdHi8gZBfIRtvWefcLy',
              locale: 'auto',
              token: function (token) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
                  Token = token.id;
                  console.log(token);
                  var stripe = require("stripe")("pk_test_sZay0UdHi8gZBfIRtvWefcLy");

                  // Token is created using Stripe.js or Checkout!
                  // Get the payment token ID submitted by the form:
                  // Using Express
                  // Charge the user's card:
                  stripe.charges.create({
                    amount: totalAmountToPay,
                    source: Token,
                  }, function(err, charge) {
                      console.log(charge);
                  });
              }
            });
             
            handler.open({
              //image : 'https://stripe.com/img/documentation/checkout/marketplace.png',
              name: 'Anerve Shop',
              description: 'Friends Shopping Platform',
              amount:  totalAmountToPay
              //billingAddress: 'true'
              //shippingAddress :'true'
            });*/
            // Set your secret key: remember to change this to your live secret key in production
            // See your keys here: https://dashboard.stripe.com/account/apikeys*/
           
        };
       /*function stripeResponseHandler(status, response){
            var totalAmountToPay = $scope.cartTotalPrice;
                totalAmountToPay = totalAmountToPay.toFixed(2).toString();
                totalAmountToPay = parseInt (totalAmountToPay.replace('.',''));
                console.log('stripeResponseHandler');
                console.log(response);
            var checkoutHandler = (window).StripeCheckout.configure({
              key: 'pk_test_sZay0UdHi8gZBfIRtvWefcLy',
              locale: 'auto',
              token: response
            }); 
            checkoutHandler.open({
              name: 'Anerve Shop',
              description: 'Friends Shopping Platform',
              amount:  totalAmountToPay,
              token: stripeResponseHandler2
            });
        }*/
 
        function stripeResponseHandler2(status, token){
            console.log('stripeResponseHandler2');
            console.log(token);
            var url = baseUrl+'api/charge';

             var totalAmountToPay = $scope.cartTotalPrice;
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
             var configObj = { method: 'POST',url: url, data: postData, headers: headers};
                  $http(configObj)
                      .then(function onFulfilled(response) {
                        console.log('stripeResponseHandler2onFulfilled');
                          var dataJson    = JSON.parse(JSON.stringify(response.data));
                          var status      = dataJson.status;
                          //var object      = dataJson.object;
                          //var seller_message = dataJson.outcome.seller_message;
                          console.log(dataJson);
                          if(status === 'succeeded'){
                              $scope.paymentButton = false;
                              $scope.hideMyZoneCart = true;

                              $scope.showPaymentCompleteMsg = true;

                          }
                      }).catch( function onRejection(errorResponse) {
                          console.log('Error: ', errorResponse.status);
                          console.log(errorResponse);
                  }); 
        }
        /*function handleToken(token){
          console.log(token);
            var url = baseUrl+'api/charge';

             var totalAmountToPay = $scope.cartTotalPrice;
                totalAmountToPay = totalAmountToPay.toFixed(2).toString();
                totalAmountToPay = parseInt (totalAmountToPay.replace('.',''));


            var TokenId = token.id;
            var CardID = token.card.id;
            var Email   = 'ahsandev.creative@gmail.com';//token.email;
            var Amount   = totalAmountToPay;
            var postData = {TokenId:TokenId,Email:Email,Amount:Amount,CardID:CardID};
             var configObj = { method: 'POST',url: url, data: postData, headers: headers};
                  $http(configObj)
                      .then(function onFulfilled(response) {
                          var dataJson    = JSON.parse(JSON.stringify(response.data));
                        //var amount      = dataJson.amount;
                        //var amount_refunded = dataJson.amount_refunded;
                        //var created     = dataJson.created;
                          //var currency    = dataJson.currency;
                          //var destination = dataJson.destination;
                          //var status      = dataJson.status;
                          console.log(dataJson);
                          
                      }).catch( function onRejection(errorResponse) {
                          console.log('Error: ', errorResponse.status);
                          console.log(errorResponse);
                  }); 
        }*/
        $scope.showProductDetail = function(productID) {
            console.log('showProductDetail');
            console.log(productID);   
              if(angular.isNumber(productID)){
                $scope.CurrentProductDetail = $scope.CurrentProduct(productID);
                $scope.groupCartId = grp_cartId;
                $scope.isProductDetailOpen();
              }
        };
        $scope.showUserCart = function(grp_cartId, USERID){
          
              if(angular.isNumber(grp_cartId) && angular.isNumber(USERID) ){
                console.log(grp_cartId +' cart belong to user id '+ USERID);
                $scope.CurrentUserBuyerDetail = $scope.CurrentUserBuyer(grp_cartId,USERID);
                $scope.isUserDetailOpen();
              }
        };
        $scope.showFriendCart = function(USERID){
          		console.log(USERID);
          		console.log('showFriendCart');
              if(angular.isNumber(USERID) ){
                console.log(' cart belong to user id '+ USERID);
                $scope.CurrentUserBuyerDetail = $scope.GetFriendCart(USERID);
                $scope.isUserDetailOpen();
              }
        };
          
        $scope.showCurrentImage  = function(imageSrc,$event) {   
          console.log(imageSrc);
          console.log($event.currentTarget.src);
          console.log($scope.CurrentProductDetailImage);
          if($event.currentTarget.src === imageSrc && imageSrc !== $scope.CurrentProductDetailImage ){
            $event.currentTarget.src = $scope.CurrentProductDetailImage;
            $scope.CurrentProductDetailImage = imageSrc;
          }else{
            if(imageSrc !== $scope.CurrentProductDetailImage ){
              var temp = $event.currentTarget.src;
              $event.currentTarget.src = $scope.CurrentProductDetailImage;
              $scope.CurrentProductDetailImage = temp;
            }else{
              var temp1 = $event.currentTarget.src;
              $event.currentTarget.src = $scope.CurrentProductDetailImage;
              $scope.CurrentProductDetailImage = temp1;
            }
          }
        };





        $scope.timeInMs = 0;
        vm.global = Global;
        vm.lastProductID = 1;

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
                 grp_cartId = products['grp_cartId'];
                 $scope.cartTotalPrice = products['TotalCartPrice'];
                 vm.lastProductID = 1;
                 getList();
            });
         }

        function findOne() {
            products.get({
                productId: $stateParams.productId
              }, function(product) {
                vm.product = product;
            });
        }
        $scope.CurrentUserBuyer  = function(grp_cartId, USERID) {
                    var url = baseUrl+'api/getUserDetail';
                    var postData = {
                      grp_cartId:grp_cartId,
                      USERID:USERID
                    };
                    var configObj = { method: 'POST',url: url, data: postData, headers: headers};
                      $http(configObj)
                          .then(function onFulfilled(response) {
                              var newData = JSON.stringify(response.data);
                              newData = JSON.parse(newData);
                              console.log('getUserDetail');
                              console.log(newData);
                              $scope.CurrentUserBuyerDetail = newData;
                          }).catch( function onRejection(errorResponse) {
                              console.log('Error: ', errorResponse.status);
                              console.log(errorResponse);
                      });
                    url = baseUrl+'api/getUserProductDetails';
                    configObj = { method: 'POST',url: url, data: postData, headers: headers};
                      $http(configObj)
                          .then(function onFulfilled(response) {
                              var newData = JSON.stringify(response.data);
                              newData = JSON.parse(newData);
                              console.log('getUserProductDetails');
                              console.log(newData);
                              $scope.CurrentUserBuyerProductsDetail = newData;
                          }).catch( function onRejection(errorResponse) {
                              console.log('Error: ', errorResponse.status);
                              console.log(errorResponse);
                      });  
               
        };
        $scope.GetFriendCart1  = function(USERID) {
                    var url = baseUrl+'api/getUserDetail';
                    var postData = {
                      USERID:USERID
                    };
                    var configObj = { method: 'POST',url: url, data: postData, headers: headers};
                      $http(configObj)
                          .then(function onFulfilled(response) {
                              var newData = JSON.stringify(response.data);
                              newData = JSON.parse(newData);
                              console.log('getUserDetail');
                              console.log(newData);
                              $scope.CurrentUserBuyerDetail = newData;
                          }).catch( function onRejection(errorResponse) {
                              console.log('Error: ', errorResponse.status);
                              console.log(errorResponse);
                      });
                    url = baseUrl+'api/getUserProductDetails';
                    configObj = { method: 'POST',url: url, data: postData, headers: headers};
                      $http(configObj)
                          .then(function onFulfilled(response) {
                              var newData = JSON.stringify(response.data);
                              newData = JSON.parse(newData);
                              console.log('getUserProductDetails');
                              console.log(newData);
                              $scope.CurrentUserBuyerProductsDetail = newData;
                          }).catch( function onRejection(errorResponse) {
                              console.log('Error: ', errorResponse.status);
                              console.log(errorResponse);
                      });  
               
        };
        
        // getUserCartDetail
        $scope.GetFriendCart  = function(USERID) {
                    var url = baseUrl+'api/getUserCartDetail';
                    var postData = {
                      USERID:USERID
                    };
                    var configObj = { method: 'POST',url: url, data: postData, headers: headers};
                      $http(configObj)
                          .then(function onFulfilled(response) {
                              var newData = JSON.stringify(response.data);
                              newData = JSON.parse(newData);
                              $scope.CurrentUserBuyerDetail = newData.cartOwner;
                              $scope.CurrentUserBuyerProductsDetail = newData.cartProducts;
                              $scope.cartUsers = newData.cartUsers;
                              $scope.isCartMember = $scope.checkInCartUsers(newData.cartUsers);
                              $scope.userCartId = newData.cartId;
                              $scope.cartComments = newData.cartComments;
                          }).catch( function onRejection(errorResponse) {
                              console.log('Error: ', errorResponse.status);
                              console.log(errorResponse);
                      });
               
        };
        
        // check in cart users
        $scope.checkInCartUsers = function(crtUsrs){
          var UserID  =  Session.getItem('UserID');
          var isMember = false;
          angular.forEach(crtUsrs,function(value, key){
            if(value['USERID'] == UserID){
              console.log(UserID);
              isMember = true;
            }
          });
          return isMember;
        }


       $scope.CurrentProduct = function(productId) {
            products.get({
                productId: productId
              }, function(product) {
                $scope.CurrentProductDetail = product;
                if(product !== undefined){
                  $scope.CurrentProductDetailImage = $scope.UploadUrl+product.img_loc;
                  var url = baseUrl+'api/getProductBuyingUsers';
                  var postData = {
                    productId:productId
                  };

                  var configObj = { method: 'POST',url: url, data: postData, headers: headers};

                    $http(configObj)
                        .then(function onFulfilled(response) {
                            var newData = JSON.stringify(response.data);
                            newData = JSON.parse(newData);
                            product.buyingUser = newData.grpCartDataResponse;
                            $scope.CurrentProductDetail = product;
                        }).catch( function onRejection(errorResponse) {
                            console.log('Error: ', errorResponse.status);
                            console.log(errorResponse);
                    }); 


                }
                return product;
            });
        };


       function getList(){
           $scope.startTimeout();
        }

        $scope.startCount = 0;  
        $scope.startTimeout = function () {  
            $scope.startCount = $scope.startCount + 1;  
            $scope.getProducts();
            vm.mytimeout = $timeout($scope.startTimeout, 30000);  
        };

        $scope.stopTimeout = function () {  
            $timeout.cancel(vm.mytimeout);  
            console.log('Timer Stopped No More Products');  
        };

        $scope.getProducts = function () {
                var lastProductID = $scope.lastProductID;
                if(lastProductID === undefined){
                    lastProductID = vm.lastProductID;
                }
                var nextProducts = 3;
                var body = '';
                var data = '';
                //var url = ApiBaseUrl+'getAllProdsInLocDefault/PK/'+lastProductID+'/'+nextProducts;
                //var url = ApiBaseUrl+'getAllProdsInLocDefault_mini/PK/'+lastProductID+'/'+nextProducts;
                var url = ApiBaseUrl+'getAllProdsInLocDefault_thin/PK/'+lastProductID+'/'+nextProducts;


                //var url = ApiBaseUrl+'getAllProdsInLocDefault/PK/1/1';
                
               
                var configObj = { method: 'GET',url: url, headers: headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        body = response.data;
                        var newData = JSON.stringify(body);
                        data = JSON.parse(newData);

                          if(data.length < 2){
                            //console.log(data);
                            $scope.stopTimeout();
                          }

                          $scope.addObject(data);

                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 
        };

        $scope.addObject = function (data) {
              if(data !== undefined){
                var counter = 0;
                var localLoopProductBrandID = 1;
                 angular.forEach(data,function(value){
                    value.ProdBrandId = value.prodBrandId;
                    //removing conflicts of case Product Brand ID
                    counter++;
                    
                    if(counter === 1){
                      $scope.arctr.products['col1'].push(value);
                    }
                    if(counter === 2){
                      $scope.arctr.products['col2'].push(value);
                    }
                    if(counter === 3){
                      $scope.arctr.products['col3'].push(value);
                    }
                    if(counter === 4){
                      $scope.arctr.products['col4'].push(value);
                      counter = 0;
                    }
                    localLoopProductBrandID = value.ProdBrandId;         
                });
                $scope.lastProductID = localLoopProductBrandID;  
              }else{
                console.log('Product Public Controller Add Object Undefined Data');
              } 
        };

        $scope.productDropInCart  = function (event , ui) {   
            var CurrentProduct = ui.draggable;
            var ProdBrandId = CurrentProduct.attr('data-product-id');
            //var ProdBrandId = CurrentProduct.attr('data-product-grp-cart-id');
            if(ProdBrandId !== undefined){
              if(!cartCreated){
                if(isGuest){  
                  $scope.createCart(ProdBrandId);
                }
              }else{
                if(isGuest){  
                  $scope.addToCart(grp_cartId,ProdBrandId);
               }
              }
            }
        };
        $scope.productDropOutFromCart  = function (event , ui) {   
            var CurrentProduct = ui.draggable;
            //var ProdBrandId = CurrentProduct.attr('data-product-id'); 
            var ProdBrandId   = CurrentProduct.attr('data-product-grp-cart-id');
            var ProductIndex  = CurrentProduct.attr('data-index');
            var ProductArrayType  = CurrentProduct.attr('data-type');
            if(ProductArrayType !== undefined && ProductArrayType === 'grpcart_products'){
              //unset($scope.products[6]['grpcart_products'][ProductIndex]);
              //myArray.splice(key, 1);
              //console.log(ProductIndex);
              //console.log(vm.products[6].grpcart_products);
              //console.log(vm.products[6].grpcart_products[ProductIndex]);
              vm.products.grpcart_products.splice(ProductIndex, 1);
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
            if(ProdBrandId !== undefined && grp_cartId !== undefined){
              $scope.nl_removefromCart(grp_cartId,ProdBrandId);
            }
        };

        // drop in cart
        $scope.dropInCart = function(event, ui){ 
            var draggableElement = ui.draggable;
            var prodId = draggableElement.attr('data-product-id');
            var friendId = draggableElement.attr('data-friend-id');    
            if(typeof prodId != 'undefined' && prodId != null){
              var img = draggableElement.find('.product_image').find('img').attr('src');
              $scope.addorCreateCart(prodId, img);
            }
            else if(typeof friendId != 'undefined' && friendId != null){console.log(friendId);
              $scope.addUserToCart(draggableElement);
            }

        }
        // drop out from cart
        $scope.dropOutFromCart = function(event, ui){
           var draggableElement = ui.draggable;
           console.log(draggableElement);
            var prodId = draggableElement.attr('data-product-id');
            var friendId = draggableElement.attr('data-friend-id');
            if(typeof prodId != 'undefined' && prodId != null)
              $scope.removeProdFromCart(draggableElement);
            else if(typeof friendId != 'undefined' && friendId != null)
              $scope.removeUserFromCart(draggableElement);
            draggableElement.remove();
        }

        $scope.addToCartBtn = function(prodId, img){
          $scope.addorCreateCart(prodId, img);
        }

        $scope.addorCreateCart = function(prodId, img){
          $scope.cart.push({
            'userid':prodId,
            'img_loc':img
          })
          if(!cartCreated){
            if(isGuest){  
              $scope.createCart(prodId);
            }
          }else{
            if(isGuest){  
              $scope.addToCart(grp_cartId,prodId);
           }
          }
        }
         // add user to cart
        $scope.addUserToCart = function(user){ 
          var userId = user.attr('data-friend-id');
          var img = user.find('img').attr('src');
          var Online = user.find('img').parent().hasClass('online');
          console.log('Online: '+Online);
          //if(list.indexOf(createItem.artNr) !== -1) {
          console.log($scope.friendsCart);
          if (!userExistsInCart(userId)) {
            $scope.friendsCart.push({
              'userid':userId,
              'img_loc':img,
              'online':Online
            })
            console.log($scope.friendsCart);
            $scope.addUserToCartAjax(grp_cartId, userId);
              var usrIndex = user.attr('data-index');
              vm.userFirends[usrIndex]['followId'] = userId;
          }else{
            console.log('User '+userId+' Already in cart');
          }
        };

        // remove prod from cart
        $scope.removeProdFromCart = function(prod){
            //var ProdBrandId = CurrentProduct.attr('data-product-id'); 
            var ProdBrandId   = prod.attr('data-product-grp-cart-id');
            var ProductIndex  = prod.attr('data-index');
            var ProductArrayType  = prod.attr('data-type');
            if(ProductArrayType !== undefined && ProductArrayType === 'grpcart_products'){
              vm.products.grpcart_products.splice(ProductIndex, 1);
            }
            if(ProductArrayType !== undefined && ProductArrayType === 'cart'){
              $scope.cart.splice(ProductIndex, 1);
            }
            
              prod.remove();
            if(ProdBrandId !== undefined && grp_cartId !== undefined){
              $scope.nl_removefromCart(grp_cartId,ProdBrandId);
            }
        };

        // remove prod button click
        $scope.removeProdBtn = function(prodId, index){
          if(prodId !== undefined && grp_cartId !== undefined){
              $scope.nl_removefromCart(grp_cartId,prodId);
              $scope.CurrentUserBuyerProductsDetail.splice(index, 1);
            }
        }

        // remove user from cart 
        $scope.removeUserFromCart = function(user){
             var userId   = user.attr('data-friend-id');
            var userIndex  = user.attr('data-index');
            var userArrayType  = user.attr('data-type');
            if(userArrayType !== undefined && userArrayType === 'grpcart_products'){
              vm.products.friendsCart.splice(userIndex, 1);
            }
            if(userId !== undefined && grp_cartId !== undefined){
             console.log('User id : '+userId);
              $scope.removeUserFromCartAjax(grp_cartId,userId);
            }
        };

        // remove user icon in side cart window
        $scope.removeCartUsr = function(usrId, index){
          $scope.removeUserFromCartAjax(grp_cartId,usrId);
          $scope.cartUsers.splice(index, 1);
        }

        $scope.createCart  = function (ProdBrandId) {
           var url = baseUrl+'api/createCart';
           //var url = ApiBaseUrl+'createCart/PK/';
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
                          console.log('ProdBrandId:'+ProdBrandId);
                          if(grp_cartId !== undefined){
                            $scope.addToCart(grp_cartId, ProdBrandId);
                          }
                        }

                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 

        };
         $scope.addToCart  = function (cartID, productID) {
           var url = baseUrl+'api/addToCart';
          // var url = ApiBaseUrl+'addToCart/'+productID+'/'+cartID;
          var postData = {cartID:cartID,productID:productID};
           var configObj = { method: 'POST',url: url, data: postData, headers: headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        if(dataJson !== undefined){

                          grp_cartId            = dataJson.grp_cartId;
                          $scope.cartItemCount  = dataJson.count;
                          $scope.cartTotalPrice = dataJson.current_total;
                          $scope.cartCurrency   = dataJson.currency;

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
        $scope.addUserToCartAjax = function(cartId, userId){ 
          var url = baseUrl+'api/addUserToCart';
          var postData = {cartID:cartId,userId:userId};
          var configObj = { method: 'POST',url: url, data: postData, headers: headers};
          $http(configObj)
              .then(function onFulfilled(response) {
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse.status);
          }); 
        };

        $scope.removeUserFromCartAjax= function(cartId,userId){
          var url = baseUrl+'api/removeUserFromCart';
          var postData = {cartID:cartId,userId:userId};
          var configObj = { method: 'POST',url: url, data: postData, headers: headers};
          $http(configObj)
              .then(function onFulfilled(response) {
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse.status);
          }); 
        };

        $scope.nl_removefromCart  = function (cartID, productID) {
            var url = baseUrl+'api/nl_removefromCart';
            var postData = {cartID:cartID,productID:productID};
            var configObj = { method: 'POST',url: url, data: postData, headers: headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));

                        if(dataJson !== undefined){
 
                          grp_cartId            = dataJson.grpcartX.grp_cartId;
                          $scope.cartItemCount  = dataJson.grpcartX.count;
                          $scope.cartTotalPrice = dataJson.grpcartX.current_total;
                          $scope.cartCurrency   = dataJson.grpcartX.currency;

                        }
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 
          
        };
        $scope.myfriends  = function () {
          	var UserID 	=  Session.getItem('UserID');
              var url = baseUrl+'api/getAllUsers';
                //postData = {key:key};
              var  configObj = { method: 'GET',url: url, headers: headers};
                  $http(configObj)
                      .then(function onFulfilled(response) {
                          var dataJson = JSON.parse(JSON.stringify(response.data));
                          console.log('data json : '+dataJson);
                          console.log(dataJson);
                          if(dataJson !== undefined ){
                                angular.forEach(dataJson,function(value){
                                  if(value['USERID'] != UserID){if(value['USERID'])
                                     value['userid']  = value['USERID'];
                                     // check if avatar val null , then get default avatar
                                    value['img_loc'] = $scope.getDefaultAvatar(value['img_loc']);
                                    vm.userFirends.push(value);
                                  }
                                  
                              });
                                Session.setItem('myfriends',vm.userFirends);
                          }
                      }).catch( function onRejection(errorResponse) {
                          console.log('Error: ', errorResponse.status);
                          console.log(errorResponse);
                  });
          
        };
        $scope.myfriends();

        $scope.testing  = function () {
          var key =  Session.getItem('key');
            var url = ApiBaseUrl+'getAllProdsInLocBySize/US/'+key+'/1/2';
            var postData = {key:key};
            var configObj = { method: 'GET',url: url, headers: headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        if(dataJson !== undefined ){
                              angular.forEach(dataJson,function(value){
                                vm.userFirends.push(value);      
                            });
                              Session.setItem('myfriends',vm.userFirends);
                        }
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 
          
        };

        // send friend request
        $scope.sendFriendRequest = function(userid){
            var UserID  =  Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
                var key   =  Session.getItem('key_'+UserID);
                var url = ApiBaseUrl+'followUser';
                var postData = {key:key, query_userId:userid};
                var configObj = { method: 'POST',url: url, data: postData, headers: headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        $scope.CurrentUserBuyerDetail.action = '01';
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 
        }

        // unfollow user
        $scope.unFollow = function(userid){
            var UserID  =  Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
                var key   =  Session.getItem('key_'+UserID);
                var url = ApiBaseUrl+'unfollowUser';
                var postData = {key:key, query_userId:userid};
                var configObj = { method: 'POST',url: url, data: postData, headers: headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        $scope.CurrentUserBuyerDetail.action = '03';
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 
        }

        // add comment to cart
        $scope.data = {};
        $scope.addCommentToCart = function(cartId){
          var comment = $scope.data.comment;
          var UserID  =  Session.getItem('UserID');
          if(typeof UserID != 'undefined' && UserID != null){
              var key   =  Session.getItem('key_'+UserID);
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
              if(typeof $scope.cartComments == 'undefined')
                $scope.cartComments = {};
              $scope.cartComments.push(newComment);
              var postData = {
                'comment' :{
                'grp_cartId' : cartId,
                'byUser'  : UserID,
                'chattime' : '2017-11-17 15:36:55',
                'chat_text': comment
              }
              } ;
              // insert into
              var url = baseUrl+'api/addCommentToCart';
              var configObj = { method: 'POST',url: url, data: postData, headers: headers};
              $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                        console.log(errorResponse);
                }); 
          } 
        }

        // join cart
        $scope.joinCart = function(cartId){
          var UserID  =  Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
                var key   =  Session.getItem('key_'+UserID);
                var url = ApiBaseUrl+'joinCart/'+key+'/'+cartId;
                var configObj = { method: 'GET',url: url, headers: headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        $scope.isCartMember = true;
                        console.log(dataJson);
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 

        }
        // leave cart
        $scope.leaveCart = function(cartId){
          var UserID  =  Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
                var key   =  Session.getItem('key_'+UserID);
                var url = ApiBaseUrl+'leaveCart/'+key+'/'+cartId;
                var configObj = { method: 'GET',url: url, headers: headers};
                $scope.isCartMember = false;
                $http(configObj)
                    .then(function onFulfilled(response) {/*
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        console.log(dataJson);*/
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 

        }
        // on product drag start
        $scope.onProdDragStart = function(event, ui){
          var dragElement = ui.helper;
          var relX = (event.pageX-35)+'px';
          var relY = (event.pageY-35)+'px';
          console.log(event);
          dragElement.css({'min-height':'50px','width':'70px','height': '70px','position':'absolute'});
          dragElement.find('img').css({'height':'50px','width':'50px'});
        }

        // on prod drag
        $scope.onProdDrag = function(event, ui){
          var dragElement = ui.helper;
          var relX = (event.pageX)+'px';
          var relY = (event.pageY)+'px';
          console.log(relY+','+relX);
          dragElement.css({'top':'0!important', 'left':'0!important'});
        }

        // drop prod on user
        $scope.dropOnUser = function(event, ui){
          var dragElement = ui.draggable;
          var usrId = this.friends.userid;
          var prodId = dragElement.attr('data-product-id');
          $scope.suggestProdToUsr(usrId, prodId);
        }

        // suggest prod to usr
        $scope.suggestProdToUsr = function(usrId, prodId){
          var postData = {'usrId':usrId, 'prodId':prodId};
          var url = baseUrl+'api/suggestProd';
          var configObj = { method: 'POST',url: url, data:postData, headers: headers};
          // $scope.isCartMember = false;
          $http(configObj)
              .then(function onFulfilled(response) {
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse.status);
          }); 
        }

        // accept product
        $scope.acceptProdInCart = function(prodId){
          var postData = {'cartId':grp_cartId, 'prodId':prodId};
          var url = baseUrl+'api/acceptProdInCart';
          var configObj = { method: 'POST',url: url, data:postData, headers: headers};
          // $scope.isCartMember = false;
          $http(configObj)
              .then(function onFulfilled(response) {
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse.status);
          }); 
        }


        $scope.getDefaultAvatar = function(url){
          if(url == null)
            url = '/images/default-avatar.png';
          return url;
       };
       function userExistsInCart(userID) {
            for (var i = 0, len = $scope.friendsCart.length; i < len; i++) {
                if ($scope.friendsCart[i].userid === userID)
                    return true;
            }

            return false;
        }

      }

})();
