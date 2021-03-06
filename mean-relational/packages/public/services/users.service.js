(function(){
'use strict';


angular
    .module('Anerve')
    .factory('MeanUser',MeanUser);

    MeanUser.$inject = ['Global','$state', '$rootScope', '$http', '$location', '$stateParams', '$q', '$timeout','$window'];

    function MeanUser (Global, $state, $rootScope, $http, $location, $stateParams, $q, $timeout,$window) {
            //console.log('user services MeanUser');
            var self;

            function MeanUserKlass() {
                this.name = 'users';
                this.user = {};
                this.loggedin = false;
                this.isAdmin = false;
                this.loginError = null;
                this.validationError = null;
                this.resetpassworderror = null;
                this.validationError = null;
                self = this;
            }


            var MeanUserK = new MeanUserKlass();

            //prototype methods
            MeanUserKlass.prototype.onIdentity = onIdentity;
            MeanUserKlass.prototype.login = login;
            MeanUserKlass.prototype.onIdFail = onIdFail;
            MeanUserKlass.prototype.register = register;
            MeanUserKlass.prototype.resetpassword = resetpassword;
            MeanUserKlass.prototype.forgotpassword = forgotpassword;
            MeanUserKlass.prototype.logout = logout;
            MeanUserKlass.prototype.checkLoggedin = checkLoggedin;
            MeanUserKlass.prototype.checkLoggedOut = checkLoggedOut;
            MeanUserKlass.prototype.checkAdmin = checkAdmin;


            //return meanKlass
            return MeanUserK;


            function onIdentity(response) {
                var user = response.user ? response.user : response;

                self.loggedin = true;
                self.isAdmin = false;
                self.user = user;
                self.name = user.GIVNAME;

                //Global Services
                Global.user = user;
                Global.authenticated = true;

                if (response.redirect) {

                    if ($location.absUrl() === response.redirect) {
                        //This is so an admin user will get full admin page
                        $window.location.reload();
                    } else {
                        $window.location.href = response.redirect;
                    }
                }else{
                    $window.location.reload();
                }
            }

            function onIdFail(response) {
                self.loginError = 'Authentication failed.';
                self.registerError = response;
                self.validationError = response.msg;
                self.resetpassworderror = response.msg;
                $rootScope.$emit('loginfailed');
                $rootScope.$emit('registerfailed');
            }


            function login(user, redirect='/') {
                // this is an ugly hack due to mean-admin needs
                $http.post('/api/login', {
                        USERNAME: user.USERNAME,
                        PASSWORD: user.PASSWORD
                    })
                    .then(function (res) {
                        console.log(res);
                        //location.url('/');
                        //if(redirect != ''){
                            $window.location.href = redirect;
                        //}
                        //self.onIdentity(res);
                    }, function(err) {
                        console.log(err);
                        self.onIdFail(err);

                    });
            }

            function register(user) {
                 $http.post('/api/register', {
                        EMAIL: user.EMAIL,
                        PASSWORD: user.PASSWORD,
                        USERNAME: user.USERNAME,
                        GIVNAME: user.GIVNAME,
                        SURNAME: user.SURNAME
                    })
                     .then(function (res) {
                        self.login(user, '/users/'+res.data.USERID);
                        //$window.location.href = '/users/'+res.data.USERID;
                        //self.onIdentity(res);
                    }, function(err) {
                        console.log(err);
                        self.onIdFail(err);

                    });
            }

            function resetpassword(user) {
                 $http.post('/api/reset/' + $stateParams.tokenId, {
                        PASSWORD: user.PASSWORD,
                        confirmPassword: user.confirmPassword
                    })
                 .then(function (res) {
                        self.onIdentity(res);
                    }, function(err) {
                        console.log(err);
                        self.onIdFail(err);

                    });
            }

            function forgotpassword(user) {
                  $http.post('/api/forgot-password', {
                        text: user.EMAIL
                    })
                 .then(function (res) {
                        $rootScope.$emit('forgotmailsent', res);
                    }, function(err) {
                        console.log(err);
                         self.onIdFail(err);

                    });
            }

            function logout() {
                 $http.get('/api/logout')
                        .then(function () {
                            self.user = {};
                            self.loggedin = false;
                            self.isAdmin = false;

                            //Global Services
                            Global.user = null;
                            Global.authenticated = false;

                        $rootScope.$emit('logout');
                     }, function(err) {
                            //some error
                            console.log(err);
                    });

            }

            function checkLoggedin() {
                var deferred = $q.defer();

                $http.get('/api/loggedin')
                        .then(function (user) {
                            // Authenticated
                            if (user.data !== '0') {
                                $timeout(deferred.resolve);
                            }else{
                                 // Not Authenticated
                               $timeout(deferred.reject);
                                //location.url('/all-products');
                                //location.url('/auth/login');
                              // location.url('/');
                              return false;
                            }
                        }, function(err) {
                            //some error
                            console.log('/api/loggedin Error');
                            console.log(err);
                    });

                return deferred.promise;
            }

            function checkLoggedOut() {
                // Check if the user is not connected
                // Initialize a new promise
                var deferred = $q.defer();

                // Make an AJAX call to check if the user is logged in
                    $http.get('/api/loggedin')
                        .then(function (user) {
                          // Authenticated
                            if (user !== '0') {
                                $timeout(deferred.reject);
                                //$location.url('/');
                            }else{
                                 // Not Authenticated
                                $timeout(deferred.resolve);
                            }
                        }, function(err) {
                            //some error
                            console.log(err);
                    });

                return deferred.promise;
            }

            function checkAdmin() {
                var deferred = $q.defer();

                // Make an AJAX call to check if the user is logged in
                    $http.get('/api/loggedin')
                        .then(function (user) {
                          // Authenticated
                            if (user !== '0' && user.roles.indexOf('admin') !== -1) {
                                $timeout(deferred.resolve);
                            }

                            // Not Authenticated or not Admin
                            else {
                                $timeout(deferred.reject);
                                $location.url('/');
                            }
                        }, function(err) {
                            //some error
                            console.log(err);
                    });

                return deferred.promise;
            }
    }

})();