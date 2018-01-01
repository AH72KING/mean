(function(){
'use strict';
angular
    .module('Anerve')
    .controller('HeaderController',HeaderController);

    HeaderController.$inject = ['$http','$state', '$scope', 'Global','$mdSidenav', '$mdUtil','$log', 'Session','$rootScope'];

    function HeaderController($http, $state, $scope, Global, $mdSidenav, $mdUtil, $log, Session, $rootScope){

        var baseUrl = 'http://localhost:3000/';
        var ip = window.ip;
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

        $rootScope.showMenuChilds = function(item){
            item.active = !item.active;
        };
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
       

       /*  var socket = io.connect();
          socket.on('news', function (data) {
            console.log(data);
            socket.emit('news', { my: 'just testing socket' });
          });*/
    }
})();