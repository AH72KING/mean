(function(){
'use strict';
angular
    .module('mean.system')
    .controller('HeaderController',HeaderController);

    HeaderController.$inject = ['$http','$state', '$scope', 'Global','$mdSidenav', '$mdUtil','$log', 'Session','$rootScope'];

    function HeaderController($http, $state, $scope, Global, $mdSidenav, $mdUtil, $log, Session, $rootScope){
        /*$scope.UploadUrl = 'http://localhost:3000/products/assets/';*/
        $rootScope.UploadUrl            = UploadUrl;   

        $scope.defaultAvatar = 'http://localhost:3000/products/assets/images/default-avatar.png';
        var vm = this;
        vm.global = Global;
        vm.menu = [{
            'title': 'products',
            'link': 'products'
        }, {
            'title': 'Create New product',
            'link': 'create-product'
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

         $scope.getDefaultAvatar = function(url){
          if(url == null)
            url = '/images/default-avatar.png';
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
                    console.log(JSON.stringify(response.data));
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
        $scope.acceptRequest = function(userId, index){
          var currentUId  =  Session.getItem('UserID');
          if(typeof currentUId != 'undefined' && currentUId != null){
            var key   =  Session.getItem('key_'+currentUId);
            var url = ApiBaseUrl+'acceptInvitation/'+key+'/'+userId;
            var configObj = { method: 'GET',url: url, headers: headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                    var dataJson    = JSON.parse(JSON.stringify(response.data));
                    $scope.requests.slice(index, 1);
                    console.log('Response is : '+JSON.stringify(response.data));
                }).catch( function onRejection(errorResponse) {
                }); 
          }
        }

    }
})();