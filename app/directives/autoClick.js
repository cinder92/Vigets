var app = angular.module('Vigets');
app.directive('onLoadClicker', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      priority: -1,
      link: function($scope, iElm, iAttrs, controller) {
        $timeout(function() {
          iElm.triggerHandler('click');
        }, 500);
      }
    };
  }
]);