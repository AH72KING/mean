'use strict';
var angularModuel = angular.module('mean', [
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
]);
var mean = angularModuel.directive('sidenavPushIn',sidenavPushIn);



angularModuel.directive('validFile',[function() {
  return {
    require : 'ngModel',
    scope : {format: '@', upload : '&upload'},
    link : function(scope, el, attrs, ngModel) {
      // change event is fired when file is selected
      el.bind('change', function(event) {
        console.log(event.target.files[0]);
        scope.upload({file:event.target.files[0]});
        scope.$apply(function() {
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        });
      })
    }
  }
}]);


//mean.directive('mAppLoading',mAppLoading);
//mean.directive('myFrame',myFrame);
mean.config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
}]);


//window.ip = '192.168.1.88';
window.ip = '192.168.100.88';  
var baseUrl = 'http://localhost:3000/';
var ApiBaseUrl = 'http://'+window.ip+':8080/Anerve/anerveWs/AnerveService/';
var UploadUrl = baseUrl+'products/assets/';
 var headers = {
                   'Access-Control-Allow-Origin': '*',
                   'Content-Type' : 'application/json; charset=UTF-8',
                   'Access-Control-Allow-Headers': 'content-type, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                   'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT',
                   'Access-Control-Max-Age': '3600',
                   'Access-Control-Allow-Credentials': 'true'
                };
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
