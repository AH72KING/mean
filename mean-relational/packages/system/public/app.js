'use strict';
var mean = angular.module('mean', [
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
  //'snap',
  //'pageslide-directive',

  /*feature areas*/
  'mean.system',
  'mean.products',
  'mean.users'
]).directive('sidenavPushIn',sidenavPushIn);

//mean.directive('mAppLoading',mAppLoading);
//mean.directive('myFrame',myFrame);
mean.config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
}]);

window.ip = '192.168.1.88';
//window.ip = '192.168.100.88';  

   /* setTimeout(
      function asyncBootstrap() {
        angular.bootstrap( document, [ 'mean' ] );
        console.log('asyncBootstrap');
      },
      ( 5000 )
    );*/

angular.module('mean.system', []);
angular.module('mean.products', []);
angular.module('mean.users',[]);

function myFrame(){
    return {
        restrict: 'E',
        templateUrl:"system/views/frame.html",
        controller:function($scope){
          $scope.hidden=false;
          $scope.close=function(){
            $scope.hidden=true;
            
          }
        },
        transclude:false


    }

}

function mAppLoading($animate){

                // Return the directive configuration.
                return({
                    link: link,
                    transclude:false,
                    restrict: "E"
                });
                // I bind the JavaScript events to the scope.
                function link( scope, element, attributes ) {
                    // Due to the way AngularJS prevents animation during the bootstrap
                    // of the application, we can't animate the top-level container; but,
                    // since we added "ngAnimateChildren", we can animated the inner
                    // container during this phase.
                    // --
                    // NOTE: Am using .eq(1) so that we don't animate the Style block.
                    $animate.leave( element.children().eq( 1 ) ).then(
                        function cleanupAfterAnimation() {
                            // Remove the root directive element.
                            element.remove();
                            // Clear the closed-over variable references.
                            scope = element = attributes = null;
                        }
                    );
                }

}




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
