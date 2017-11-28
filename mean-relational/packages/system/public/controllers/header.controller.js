(function(){
'use strict';
angular
    .module('mean.system')
    .controller('HeaderController',HeaderController);

    HeaderController.$inject = ['$http','$state', '$scope', 'Global','$mdSidenav', '$mdUtil','$log', 'Session','$rootScope'];

    function HeaderController($http, $state, $scope, Global, $mdSidenav, $mdUtil, $log, Session, $rootScope){
        /*$scope.UploadUrl = 'http://localhost:3000/products/assets/';*/
        $rootScope.UploadUrl            = UploadUrl;   
        //check key if expire, then logout user
        // validate key
        $scope.validateKey= function(){
          var currentUId  =  Session.getItem('UserID');
          if(typeof currentUId != 'undefined' && currentUId != null){
            var key   =  Session.getItem('key_'+currentUId);
            var url = baseUrl+'api/validateKey';
            var postData = {'key':key};
            var configObj = { method: 'POST',url: url, data: postData, headers: headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                    if(response.data != true){
                      logout();
                    }
                }).catch( function onRejection(errorResponse) {
                });
          }
        }
        $scope.validateKey();
        $scope.defaultAvatar = 'http://localhost:3000/products/assets/images/default-avatar.png';
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

              $state.go('auth.login');

            },function(err){
                console.log(err);
            }
          );
        }
        $scope.toggleLeft     = buildToggler('left');
        $scope.toggleRight    = buildToggler('right');
        //$scope.ProductDetail  = buildToggler('ProductDetail');
        $scope.lockLeft = true;
        $scope.lockRight = true;

        
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

         $rootScope.getDefaultAvatar = function(url){
          if(url == null)
            url = '/images/default-avatar.png'; 
          else {
            var link = UploadUrl+url;
            var http = new XMLHttpRequest();
            http.open('HEAD', link, false);
            http.send();
            if(http.status==404){
              url = '/images/default-avatar.png'; 
            }
          }
          return url;
       };
        // get friend request
        $scope.friendRequests = function(){
          var UserID  =  Session.getItem('UserID');
          if(typeof UserID != 'undefined' && UserID != null){
            var key   =  Session.getItem('key_'+UserID);
            var url = ApiBaseUrl+'myInvites/'+key;
            var configObj = { method: 'GET',url: url, headers: headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                    var dataJson    = JSON.parse(JSON.stringify(response.data));
                    $scope.requests = dataJson;
                }).catch( function onRejection(errorResponse) {
                }); 
          }
        }
        $scope.friendRequests();
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
                    $scope.requests.slice(index, 1);
                    if(index === null){
                       CurrentUserBuyerDetail.action = '02';
                    }
                    notify('Friend Request has been Accepted Successfully');
                }).catch( function onRejection(errorResponse) {
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
                        $scope.CurrentUserBuyerDetail.action = '03';
                        notify('User Unfollowed Successfully');
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse.status);
                }); 
            } 
        }

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
        function getAisles(){
          $scope.aisles = {};
          var url = ApiBaseUrl+'getAisles';
          var configObj = { method: 'GET',url: url, headers: headers};
          $http(configObj)
              .then(function onFulfilled(response) {
                if(typeof response.data != 'undefined'){
                  $scope.aisles = response.data;
                }
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse.status);
          }); 
        }
        getAisles();
       /*  var socket = io.connect();
          socket.on('news', function (data) {
            console.log(data);
            socket.emit('news', { my: 'just testing socket' });
          });*/
    }
})();