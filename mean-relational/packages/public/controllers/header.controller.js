(function(){
'use strict';
angular
    .module('Anerve')
    .controller('HeaderController',HeaderController);

    HeaderController.$inject = ['$http', '$state', '$location', '$scope', 'Global','$mdSidenav', '$mdUtil','$log', 'Session','$rootScope', '$window'];

    function HeaderController($http, $state, $location, $scope, Global, $mdSidenav, $mdUtil, $log, Session, $rootScope, $window){
        $scope.isNotLogOut = false;
        $rootScope.isLoaded = false;
        $rootScope.ip  = window.ip;
        $rootScope.baseUrl = 'http://localhost:3000/';
        $rootScope.UploadUrl  = 'http://localhost:3000/public/assets/';
        $rootScope.ApiBaseUrl = 'http://'+$rootScope.ip+':8080/Anerve/anerveWs/AnerveService/';
        $rootScope.headers    = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type' : 'application/json; charset=UTF-8',
            'Access-Control-Allow-Headers': 'content-type, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Credentials': 'true'
        };  
        $rootScope.cartTotalPrice        = 0;
        //check key if expire, then logout user
        // validate key
        $rootScope.socialApps = [
          { 'name':'Twitter', 'key':'twitter', 'href':'/api/auth/twitter'},
          { 'name':'Tumblr',  'key':'tumblr',  'href':'/api/auth/tumblr'},
          { 'name':'Facebook','key':'facebook','href':'/api/auth/facebook'},
          { 'name':'Google',  'key':'google',  'href':'/api/auth/google'},
        ];
         $rootScope.SideBarLeftMenuItems = [
            {
                name: "Profile",
                subItems: [
                    {name: "View Profile"},
                    {name: "Edit Profile"}
                ]
            },
            {
                name: "My Anerve",
                subItems: [
                    {name: "My Orders"},
                    {name: "My Firends"},
                    {name: "SubItem5"}
                ]
            },
            {
                name: "Friends",
                subItems: [
                    {name: "My Firends"},
                    {name: "My Network"},
                    {name: "People"}
                ]
            },
            {
                name: "Buiness",
                subItems: [
                    {name: "About Anerve"},
                    {name: "Contact Us"},
                    {name: "Term & Conditions"}
                ]
            }
        ];
        $rootScope.provider = '';

        $rootScope.showMenuChilds = function(item){
            item.active = !item.active;
        };
        $rootScope.selectAisleID = function (aisle) { 
            console.log(aisle);            //aisleId aisle_description aisle_name aisle_number
            $rootScope.AislesIsSelected    = true;
            $rootScope.AislesSelectedID    = aisle.aisleId;
            $rootScope.AislesSelectedName  = aisle.aisle_name;
            $rootScope.AislesSelectedDesc  = aisle.aisle_description;
            
           $rootScope.emptyAllProductCols();
            if($rootScope.NoMoreProductToFetch){
              $rootScope.startTimeout();
            }
        };
        $rootScope.emptyAllProductCols = function () {
            $rootScope.lastProductID = 0;
            $rootScope.products['col1'] = [];
            $rootScope.products['col2'] = [];
            $rootScope.products['col3'] = [];
            $rootScope.products['col4'] = [];
            if($rootScope.NoMoreProductToFetch){
              $rootScope.startTimeout();
            }

        };
        $rootScope.getAllProducts = function () {
            $rootScope.emptyAllProductCols();
            $rootScope.AislesIsSelected = false;
        };
        // get prod by aisle
        $rootScope.getProdByAisle = function(index){
          var id = "";
          if(index !== undefined && index !== 'undefined' && index !== ''){
            id = $rootScope.aisles[index].aisleId;
          }

          var url = $rootScope.baseUrl+'api/getAisleProd';
          var postData = {'id':id};
          var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
         // notify('Loading Products...','info');
          $http(configObj)
              .then(function onFulfilled(response) {
                  for(var i = 1; i <= 4; i++){
                    $rootScope.products['col'+i] = response.data['col'+i];
                  }
                closeNoti();
                if(index !== undefined && index !== 'undefined' && index !== ''){
                  var $msg = $rootScope.aisles[index].aisle_name+' Products Loaded';
                }else{
                  var $msg = "All Products Loaded";
                  notify($msg,'success');
                }
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse);
          }); 
        };
        $rootScope.validatekey= function(){

          var url = $rootScope.baseUrl+'api/validatekey';
          var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
          $http(configObj)
              .then(function onFulfilled(response) {
                  if(response.data == false){
                    if($scope.isNotLogOut){
                      $scope.isNotLogOut = true;
                      logout();
                    }
                  }else if(response.data != false && response.data != true) {
                    Session.setItem('UserID',response.data.userId);
                    Session.setItem('key_'+response.data.userId, response.data.key);
                    $rootScope.provider = response.data.provider;
                  }
              }).catch( function onRejection(errorResponse) {
                console.log(errorResponse);
              });
        };
        $rootScope.validatekey();
        $rootScope.defaultAvatar = 'http://localhost:3000/public/assets/images/default-avatar.png';
        var vm = this;
        vm.global = Global;
        $rootScope.userImg = Session.getItem('img_loc');
        vm.menu = [
        /*{
            'title': 'products',
            'link': 'products'
        }, {
            'title': 'Create New product',
            'link': 'create-product'
        },*/ {
            'title': 'users',
            'link': 'users'
        }];

        vm.isCollapsed = false;
        vm.logout = logout;

        function logout(){
          $http.get('/api/logout').then(function() {
            Session.removeItem('UserID');
              vm.global = {
                user: false,
                authenticated: false
              };

              //$state.go('auth.login');
              ///$state.go('home');
              ///$state.go('home');
              //$location.url('/');
              $window.location.href = '/';

            },function(err){
                console.log(err);
            }
          );
        }
        $rootScope.toggleLeft     = buildToggler('left');
        $rootScope.toggleRight    = buildToggler('right');
        $rootScope.ProductDetail  = buildToggler('ProductDetail');
        $rootScope.UserDetail     = buildToggler('UserDetail');
        $rootScope.lockLeft = false;
        $rootScope.lockRight = false;
        $rootScope.lockProductDetail = false;
        $rootScope.lockUserDetail = false;

        
        $rootScope.isLeftOpen = function() {
          return $mdSidenav('left').isOpen();
        };
        $rootScope.isRightOpen = function() {
          return $mdSidenav('right').isOpen();
        };
        $rootScope.isProductDetailOpen = function() {
          return $mdSidenav('ProductDetail').isOpen();
        };
        $rootScope.isUserDetailOpen = function() {
          return $mdSidenav('UserDetail').isOpen();
        };

        $rootScope.getDefaultAvatar = function(url){
          if(url == null){
            url = '/images/default-avatar.png'; 
          }else {
            url = '/images/default-avatar.png'; 
           /* var link = $rootScope.UploadUrl+url;
            var http = new XMLHttpRequest();
            http.open('HEAD', link, false);
            http.send();
            if(http.status==404){localStorage.clear();
              url = '/images/default-avatar.png'; 
            }*/
          }
          return url;
       };
        // get friend request
        $rootScope.friendRequests = function(){
          if(typeof Session.getItem('UserID') != 'undefined'){
          var UserID  =  Session.getItem('UserID');
            if(UserID != null){
              var key   =  Session.getItem('key_'+UserID);
              var url = $rootScope.ApiBaseUrl+'myInvites/'+key;
              var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
              $http(configObj)
                  .then(function onFulfilled(response) {
                      var dataJson    = JSON.parse(JSON.stringify(response.data));
                      $rootScope.requests = dataJson;
                  }).catch( function onRejection(errorResponse) {
                    console.log(errorResponse);
                  }); 
            }
          }
        };
        try {
          $rootScope.friendRequests();
        }
        catch(e){
          console.log(e);
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
                $log.debug('toggle ' + navID + ' is done');
              });
          }, 300);

          return debounceFn;
        }

        // accept friend request
        $rootScope.acceptRequest = function(userId, index=null){
          var currentUId  =  Session.getItem('UserID');
          if(typeof currentUId != 'undefined' && currentUId != null){
            var key   =  Session.getItem('key_'+currentUId);
            var url = $rootScope.ApiBaseUrl+'acceptInvitation/'+key+'/'+userId;
            var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                    var dataJson    = JSON.parse(JSON.stringify(response.data));
                    console.log(dataJson);
                    $rootScope.requests.slice(index, 1);
                    if(index === null){
                       $rootScope.CurrentUserBuyerDetail.action = '02';
                    }
                    notify('Friend Request has been Accepted Successfully');
                }).catch( function onRejection(errorResponse) {
                  console.log(errorResponse);
                }); 
          }
        };

        // unfollow user
        $rootScope.unFollow = function(userid){
            var UserID  =  Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
                var key   =  Session.getItem('key_'+UserID);
                var url = $rootScope.ApiBaseUrl+'unfollowUser';
                var postData = {key:key, query_userId:userid};
                var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        var dataJson = JSON.parse(JSON.stringify(response.data));
                        console.log(dataJson);
                        $rootScope.CurrentUserBuyerDetail.action = '03';
                        notify('User Unfollowed Successfully');
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 
        };

          // send friend request
        $rootScope.sendFriendRequest = function(userid){
            var UserID  =  Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
                var key   =  Session.getItem('key_'+UserID);
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

        // getUserCartDetail
        $rootScope.GetFriendCart  = function(USERID) {
                    var url = $rootScope.baseUrl+'api/getUserCartDetail';
                    var postData = {
                      USERID:USERID
                    };
                    var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                      $http(configObj)
                          .then(function onFulfilled(response) {
                              var newData = JSON.stringify(response.data);
                              newData = JSON.parse(newData);
                              $rootScope.CurrentUserBuyerDetail = newData.cartOwner;
                              $rootScope.CurrentUserBuyerProductsDetail = newData.cartProducts;
                              $rootScope.cartUsers = newData.cartUsers;
                              $rootScope.isCartMember = $rootScope.checkInCartUsers(newData.cartUsers);
                              $rootScope.userCartId = newData.cartId;
                              $rootScope.cartComments = newData.cartComments;
                          }).catch( function onRejection(errorResponse) {
                              console.log('Error: ', errorResponse.status);
                              console.log(errorResponse);
                      });
               
        };
        $rootScope.showFriendCart = function(USERID){
          console.log('user id is');
          console.log(USERID);
          if(angular.isNumber(USERID) ){
            console.log(' cart belong to user id '+ USERID);
            $rootScope.CurrentUserBuyerDetail = $rootScope.GetFriendCart(USERID);
            $rootScope.isUserDetailOpen();
          }
        };
        // check in cart users
        $rootScope.checkInCartUsers = function(crtUsrs){
          var UserID  =  Session.getItem('UserID');
          var isMember = false;
          angular.forEach(crtUsrs,function(value, key){
            if(value['USERID'] == UserID){
              console.log(UserID);
              console.log(key);
              isMember = true;
            }
          });
          return isMember;
        };
       

       /*  var socket = io.connect();
          socket.on('news', function (data) {
            console.log(data);
            socket.emit('news', { my: 'just testing socket' });
          });*/
    }
})();