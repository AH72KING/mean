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

        //declare and use methods
        vm.create = create;
        vm.remove = remove;
        vm.update = update;
        vm.find = find;
        vm.findOne = findOne;

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
            if (!user.updated) {
                user.updated = [];
            }
            user.updated.push(new Date().getTime());

            user.$update(function() {
                $location.path('users/' + user.USERID);
            });
        }
        

        function find() {
            users.query(function(users) {
                 vm.users = users;
            });
         }

        function findOne() {
            users.get({
                USERID: $stateParams.USERID
              }, function(user) {
                vm.user = user;
            });
        }

      }

})();