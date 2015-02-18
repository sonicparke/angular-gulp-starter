(function() {
    'use strict';

    angular.module('app.core')
        .directive('autofocus', ['$timeout', function($timeout) {
            return {
                restrict: 'A',
                link : function($scope, $element) {
                    $timeout(function() {
                        $element[0].focus();
                    });
                }
            };
        }]);
})();
