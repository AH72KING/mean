(function(){
'use strict';
angular
    .module('Anerve')
    .controller('HeaderController',HeaderController);

    HeaderController.$inject = ['$http', '$state', '$location', '$scope', 'Global','$mdSidenav', '$mdUtil','$log', 'Session','$rootScope', '$window'];

    function HeaderController($http, $state, $location, $scope, Global, $mdSidenav, $mdUtil, $log, Session, $rootScope, $window){

        var baseUrl = 'http://localhost:3000/';
        var ip = window.ip;
        $rootScope.isLoaded = false;
       //var UploadUrl = 'http://'+ip+':8080/Anerve/images/';
        var UploadUrl = 'http://localhost:3000/public/assets/';
        var ApiBaseUrl = 'http://'+ip+':8080/Anerve/anerveWs/AnerveService/';
        var headers = {
                   'Access-Control-Allow-Origin': '*',
                   'Content-Type' : 'application/json; charset=UTF-8',
                   'Access-Control-Allow-Headers': 'content-type, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                   'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT',
                   'Access-Control-Max-Age': '3600',
                   'Access-Control-Allow-Credentials': 'true'
                };

        $scope.UploadUrl = 'http://localhost:3000/public/assets/';
        $rootScope.UploadUrl  = UploadUrl;   
        //check key if expire, then logout user
        // validate key
        $scope.socialApps = [
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
        $scope.provider = '';

        $rootScope.cartTotalPrice        = 0;

        $rootScope.showMenuChilds = function(item){
            item.active = !item.active;
        };
        $rootScope.selectAisleID = function (aisle) { 
            console.log(aisle);            //aisleId aisle_description aisle_name aisle_number
            $scope.AislesIsSelected    = true;
            $scope.AislesSelectedID    = aisle.aisleId;
            $scope.AislesSelectedName  = aisle.aisle_name;
            $scope.AislesSelectedDesc  = aisle.aisle_description;
            
           $rootScope.emptyAllProductCols();
            if($scope.NoMoreProductToFetch){
              $scope.startTimeout();
            }
        };
        $rootScope.emptyAllProductCols = function () {
            $scope.lastProductID = 0;
            $scope.arctr.products['col1'] = [];
            $scope.arctr.products['col2'] = [];
            $scope.arctr.products['col3'] = [];
            $scope.arctr.products['col4'] = [];
            if($scope.NoMoreProductToFetch){
              $scope.startTimeout();
            }

        };
        $rootScope.getAllProducts = function () {
            $rootScope.emptyAllProductCols();
            $scope.AislesIsSelected = false;
        };
        // get prod by aisle
        $rootScope.getProdByAisle = function(index){
          if(index !== undefined && index !== 'undefined' && index !== ''){
            var id = $scope.aisles[index].aisleId;
          }else{
            id = "";
          }

          var url = baseUrl+'api/getAisleProd';
          var postData = {'id':id};
          var configObj = { method: 'POST',url: url, data:postData, headers: headers};
         // notify('Loading Products...','info');
          $http(configObj)
              .then(function onFulfilled(response) {
                  for(var i = 1; i <= 4; i++){
                    $scope.arctr.products['col'+i] = response.data['col'+i];
                  }
                closeNoti();
                if(index !== undefined && index !== 'undefined' && index !== '') var $msg = $scope.aisles[index].aisle_name+' Products Loaded';
                else var $msg = "All Products Loaded";
                  notify($msg,'success');
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse.status);
          }); 
        }
        $scope.validateKey= function(){

          var url = baseUrl+'api/validateKey';
          var configObj = { method: 'POST',url: url, headers: headers};
          $http(configObj)
              .then(function onFulfilled(response) {
                  if(response.data == false){
                    logout();
                  } else if(response.data != false && response.data != true) {
                    Session.setItem('UserID',response.data.userId);
                    Session.setItem('key_'+response.data.userId, response.data.key);
                    $scope.provider = response.data.provider;
                  }
              }).catch( function onRejection(errorResponse) {
                console.log(errorResponse);
              });
        };
        $scope.validateKey();
        $scope.defaultAvatar = 'http://localhost:3000/public/assets/images/default-avatar.png';
        var vm = this;
        vm.global = Global;
        $scope.userImg = Session.getItem('img_loc');
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
           /* var link = UploadUrl+url;
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
        $scope.friendRequests = function(){
          if(typeof Session.getItem('UserID') != 'undefined'){
          var UserID  =  Session.getItem('UserID');
            if(UserID != null){
              var key   =  Session.getItem('key_'+UserID);
              var url = ApiBaseUrl+'myInvites/'+key;
              var configObj = { method: 'GET',url: url, headers: headers};
              $http(configObj)
                  .then(function onFulfilled(response) {
                      var dataJson    = JSON.parse(JSON.stringify(response.data));
                      $scope.requests = dataJson;
                  }).catch( function onRejection(errorResponse) {
                    console.log(errorResponse);
                  }); 
            }
          }
        };
        try {
          $scope.friendRequests();
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
            var url = ApiBaseUrl+'acceptInvitation/'+key+'/'+userId;
            var configObj = { method: 'GET',url: url, headers: headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                    var dataJson    = JSON.parse(JSON.stringify(response.data));
                    console.log(dataJson);
                    $scope.requests.slice(index, 1);
                    if(index === null){
                       $scope.CurrentUserBuyerDetail.action = '02';
                    }
                    notify('Friend Request has been Accepted Successfully');
                }).catch( function onRejection(errorResponse) {
                  console.log(errorResponse);
                }); 
          }
        };

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
                        console.log(dataJson);
                        $scope.CurrentUserBuyerDetail.action = '03';
                        notify('User Unfollowed Successfully');
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 
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
                        console.log(dataJson);
                        $scope.CurrentUserBuyerDetail.action = '01';
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 
        };

        // getUserCartDetail
        $rootScope.GetFriendCart  = function(USERID) {
                    var url = baseUrl+'api/getUserCartDetail';
                    var postData = {
                      USERID:USERID
                    };
                    var configObj = { method: 'POST',url: url, data: postData, headers: headers};
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