'use strict';
(function(){
    angular
      .module('Anerve')
      .controller('usersController',usersController);
      
      //,'$log'
      usersController.$inject = ['$stateParams', '$location', 'Global', 'users', '$state', '$scope', '$timeout', '$http', 'Session', '$rootScope'];

  function usersController($stateParams, $location, Global, users, $state, $scope, $timeout, $http, Session, $rootScope){
        var vm = this;
     
        $rootScope.timeInMs = 0;
        vm.global = Global;
        vm.lastUserID = 1;
        //vm.usertypes = ['A','F','M','P'];
        //declare and use methods
        vm.create = create;
        vm.remove = remove;
        vm.update = update;
        vm.find = find;
        vm.findOne = findOne;
        $rootScope.imgloc = '';
        $rootScope.userTypes = [
            {'value':'A','text':'All Users'},
            {'value':'F','text':'Friends'},
            {'value':'M','text':'Mates'},
            {'value':'P','text':'Pals'}
        ];
        $rootScope.$watch('lastUserID', function() {
            //alert('hey, lastUserID has changed!');
        });
      
        $rootScope.social = {};
        //methods
         function create() {
           /* var user = new Users({
                title: vm.title,
                content: vm.content
            });

            user.$save(function(response) {
                $location.path('users/' + response.id);
            });

            vm.title = '';
            vm.content = '';*/
        }

        function remove(user) {
            if (user) {
                user.$remove();

                for (var i in vm.users) {
                    if (vm.users[i] === user) {
                        vm.users.splice(i, 1);
                    }
                }
            }
            else {
                vm.user.$remove(function(){
                  $state.go('users');
                });
            }
        }

        function update() {
            var user = vm.user;
            user.img_loc1 = $rootScope.imgloc;
            if (!user.updated) {
                user.updated = [];
            }
            user.updated.push(new Date().getTime());
            user.img_loc1 = $rootScope.imgloc;
            user.$update(function() {
                $location.path('users/' + user.USERID);
            });
        }
/*        $rootScope.Base64encode = function(hash) {
            console.log(hash);
            if(hash != '' && hash != undefined && hash != 'undefined'){
                var hash = hash.toString();
                console.log(typeof hash);
                return btoa(hash);
             }
             return '';
        };
        $rootScope.Base64decode = function(hash) {
            console.log(hash);
            if(hash != '' && hash != undefined && hash != 'undefined'){
                var hash = hash.toString();
                console.log(typeof hash);
                return atob(hash);
            }
            return '';
        };*/
        $rootScope.uploadFile = function(element) {
            $rootScope.imgloc = element;
        };
        function find() {
            var UserID  =  Session.getItem('UserID');
            console.log(UserID);
            var key =  Session.getItem('key_'+UserID);
            var url = $rootScope.ApiBaseUrl+'allSiteUsers/'+key;
            var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
            var tempArray = [];
            $http(configObj)
                .then(function onFulfilled(response) {
                    closeNoti();
                    if(typeof response.data != 'undefined' && response.data.length > 1){
                        angular.forEach(response.data,function(value, key){
                            if(typeof value['userid'] != 'undefined')
                                response.data[key]['userId'] = value['userid'];
                            if(typeof value['imgloc'] != 'undefined')
                                response.data[key]['img_loc'] = value['imgloc'];
                            if(value['userId'] != UserID)
                                tempArray.push(response.data[key]);
                        });
                        vm.users = tempArray;
                        tempArray = [];
                    } else {
                        notify('No Users Found');
                    }
                }).catch( function onRejection(errorResponse) {
                    console.log('Error: ', errorResponse.status);
            }); 
         }

        function findOne() {
            users.get({
                USERID: $stateParams.USERID
              }, function(user) {
                vm.user = user;
            });
        }

       // get all users
        $rootScope.getUsers = function(usertype){
            notify('Processing Request. Please Wait','info');
            var type = usertype.value;
            switch(type){
                case 'A': 
                    find(); break;
                case 'F':
                    getFriends(); break;
                case 'M':
                    getMates(); break;
                case 'P':
                    getPals(); break;
                
            }
        };
        // get user friends
        function getAllUsers(){
            users.query(function(users) {
                 vm.users = users;
            });
        }
        // get user friends
        function getFriends(){
            var UserID  =  Session.getItem('UserID');
            var key =  Session.getItem('key_'+UserID);
            var url = $rootScope.ApiBaseUrl+'myfriends/'+key;
            var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                    closeNoti();
                    if(typeof response.data != 'undefined' && response.data.length > 0){
                        angular.forEach(response.data,function(value, key){
                            response.data[key]['GIVNAME'] = value['givname'];
                            response.data[key]['SURNAME'] = value['surname'];
                        });
                        vm.users = response.data;
                    } else {
                        notify('No Friends Found');
                    }
                }).catch( function onRejection(errorResponse) {
                    console.log('Error: ', errorResponse.status);
            }); 
        }
        // get user mates
        function getMates(){
            var UserID  =  Session.getItem('UserID');
            var key =  Session.getItem('key_'+UserID);
            var url = $rootScope.ApiBaseUrl+'myMates/'+key;
            var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                    closeNoti();
                    if(typeof response.data != 'undefined' && response.data.length > 0){
                        angular.forEach(response.data,function(value, key){
                            response.data[key]['GIVNAME'] = value['givname'];
                            response.data[key]['SURNAME'] = value['surname'];
                        });
                        vm.users = response.data;
                    } else {
                        notify('No Mates Found');
                    }
                }).catch( function onRejection(errorResponse) {
                    console.log('Error: ', errorResponse.status);
            }); 
        }
        // get user pals
        function getPals(){
            var UserID  =  Session.getItem('UserID');
            var key =  Session.getItem('key_'+UserID);
            var url = $rootScope.ApiBaseUrl+'myPals/'+key;
            var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                    closeNoti();
                    if(typeof response.data != 'undefined' && response.data.length > 0){
                        angular.forEach(response.data,function(value, key){
                            response.data[key]['GIVNAME'] = value['givname'];
                            response.data[key]['SURNAME'] = value['surname'];
                        });
                        vm.users = response.data;
                    } else {
                        notify('No Pals Found');
                    }
                }).catch( function onRejection(errorResponse) {
                    console.log('Error: ', errorResponse.status);
            }); 
        }
        

        $rootScope.setCurrentSoicalUser = function(id){
            $rootScope.social.current = 'twitter';
            $rootScope.social.userId = id;
            $rootScope.getPosts('twitter');
        }

        $rootScope.getPosts = function(social){
            $rootScope.social.current = social;
            if(social == 'twitter'){
                var url = $rootScope.baseUrl+'api/timeline';
                var postData = {'userId':$rootScope.social.userId};
                var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        $rootScope.twitterPosts = response.data;
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse);
                }); 
            } else if(social == 'tumblr'){
                var url = $rootScope.baseUrl+'api/tumblrPosts';
                var postData = {'userId':$rootScope.social.userId};
                var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
                $http(configObj)
                    .then(function onFulfilled(response) {
                        $rootScope.tumblrPosts = response.data;
                    }).catch( function onRejection(errorResponse) {
                        console.log('Error: ', errorResponse);
                }); 
            }
        }
      }

})();