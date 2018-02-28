'use strict';
var angularModel = angular.module('Anerve', [
  /* angular modules */
  'ngCookies',
  'ngResource',
  'ngRoute',

  /*3rd-party modules*/
  'ui.router',
  'ui.bootstrap',
  'ngDragDrop',
  'ngMaterial',
  'ngMessages',
  'ngSanitize',
  'ngAnimate',
  'angularFileUpload',
  'ngImgCrop'
]);

/*var body = document.getElementsByTagName('body')[0];

setTimeout(function() {
  body.setAttribute('ng-app', 'Anerve');
  angular.bootstrap(body, ['ng', 'Anerve']);
  // for this remove ng-app from body tag first in jade
}, 10); */

var Anerve = angularModel.directive('sidenavPushIn',sidenavPushIn);
Anerve.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

//window.ip = '192.168.100.88';
window.ip = '192.168.1.88';
function sidenavPushIn(){
        return {
            restrict: 'A',
            require: '^mdSidenav',
            link: function ($scope, element, attr, sidenavCtrl) {
                var body = angular.element(document.body);
                body.addClass('md-sidenav-push-in');
                var cssClass = (element.hasClass('md-sidenav-left') ? 'md-sidenav-left' : 'md-sidenav-right') + '-open';
                var stateChanged = function (state) {
                    body[state ? 'addClass' : 'removeClass'](cssClass);
                };
                // overvwrite default functions and forward current state to custom function
                angular.forEach(['open', 'close', 'toggle'], function (fn) {
                    var org = sidenavCtrl[fn];
                    sidenavCtrl[fn] = function () {
                        var res = org.apply(sidenavCtrl, arguments);
                        stateChanged(sidenavCtrl.isOpen());
                        return res;
                    };
                });
            }
        };
    }