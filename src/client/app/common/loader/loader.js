(function() {
    'use strict';

    angular.module('app.loader')
        .directive('ngLoader', function () {
            return {
                restrict: 'E,A',
                replace: true,
                templateUrl: 'app/common/loader/loader.html',
                scope: {
                    showLoader: '=?'
                },
                link:function (scope, element, attrs) {
                    scope.showLoader = true;
                }
            };
        })
        .directive('ngDogLoader', function () {
            return {
                restrict: 'E,A',
                replace: true,
                templateUrl: 'app/common/loader/dogloader.html',
                scope: {}
            };
        });
})();
