'use strict';
angular.module('mean', [
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
  //'snap',
  //'pageslide-directive',

  /*feature areas*/
  'mean.system',
  'mean.products',
  'mean.users'
]).directive('sidenavPushIn',sidenavPushIn)
.config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
}]);

angular.module('mean.system', []);
angular.module('mean.products', []);
angular.module('mean.users',[]);

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
