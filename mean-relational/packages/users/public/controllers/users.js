'use strict';
(function(){
    angular
      .module('mean.users')
      .controller('usersController',usersController);
      
      //,'$log'
      usersController.$inject = ['$stateParams', '$location', 'Global', 'users', '$state', '$scope', '$timeout', '$http', 'Session'];

  function usersController($stateParams, $location, Global, users, $state, $scope, $timeout, $http, Session){
        var vm = this;
        var ip = window.ip;

        $scope.timeInMs = 0;
        vm.global = Global;
        vm.lastUserID = 1;
        //vm.usertypes = ['A','F','M','P'];
        //declare and use methods
        vm.create = create;
        vm.remove = remove;
        vm.update = update;
        vm.find = find;
        vm.findOne = findOne;
        $scope.imgloc = '';
        $scope.userTypes = [
            {'value':'A','text':'All Users'},
            {'value':'F','text':'Friends'},
            {'value':'M','text':'Mates'},
            {'value':'P','text':'Pals'}
        ];
        $scope.$watch('lastUserID', function() {
            //alert('hey, lastUserID has changed!');
        });
      

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
            user.img_loc1 = $scope.imgloc;
            if (!user.updated) {
                user.updated = [];
            }
            user.updated.push(new Date().getTime());
            user.img_loc1 = $scope.imgloc;
            user.$update(function() {
                $location.path('users/' + user.USERID);
            });
        }
        $scope.uploadFile = function(element) {
            $scope.imgloc = element;
        }
        function find() {
            var UserID  =  Session.getItem('UserID');
            var key =  Session.getItem('key_'+UserID);
            var url = ApiBaseUrl+'allSiteUsers/'+key;
            var configObj = { method: 'GET',url: url, headers: headers};
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
        $scope.getUsers = function(usertype){
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
        }
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
            var url = ApiBaseUrl+'myfriends/'+key;
            var configObj = { method: 'GET',url: url, headers: headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                    closeNoti();
                    if(typeof response.data != 'undefined' && response.data.length > 1){
                        angular.forEach(response.data,function(value, key){
                            response.data[key]['GIVNAME'] = value['givname'];
                            response.data[key]['SURNAME'] = value['surname'];
                        });
                        vm.users = response.data;
                    } else {
                        notify("No Friends Found");
                    }
                }).catch( function onRejection(errorResponse) {
                    console.log('Error: ', errorResponse.status);
            }); 
        }
        // get user mates
        function getMates(){
            var UserID  =  Session.getItem('UserID');
            var key =  Session.getItem('key_'+UserID);
            var url = ApiBaseUrl+'myMates/'+key;
            var configObj = { method: 'GET',url: url, headers: headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                    closeNoti();
                    if(typeof response.data != 'undefined' && response.data.length > 1){
                        angular.forEach(response.data,function(value, key){
                            response.data[key]['GIVNAME'] = value['givname'];
                            response.data[key]['SURNAME'] = value['surname'];
                        });
                        vm.users = response.data;
                    } else {
                        notify("No Mates Found");
                    }
                }).catch( function onRejection(errorResponse) {
                    console.log('Error: ', errorResponse.status);
            }); 
        }
        // get user pals
        function getPals(){
            var UserID  =  Session.getItem('UserID');
            var key =  Session.getItem('key_'+UserID);
            var url = ApiBaseUrl+'myPals/'+key;
            var configObj = { method: 'GET',url: url, headers: headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                    closeNoti();
                    if(typeof response.data != 'undefined' && response.data.length > 1){
                        angular.forEach(response.data,function(value, key){
                            response.data[key]['GIVNAME'] = value['givname'];
                            response.data[key]['SURNAME'] = value['surname'];
                        });
                        vm.users = response.data;
                    } else {
                        notify("No Pals Found");
                    }
                }).catch( function onRejection(errorResponse) {
                    console.log('Error: ', errorResponse.status);
            }); 
        }
      }

})();