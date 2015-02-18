(function() {
    'use strict';

    angular.module('app.uibutton')
        .directive('uiButton', function () {
            return {
                restrict: 'E',
                replace: true,
                controller: function() {

                },
                templateUrl: 'app/common/uibutton/ui-button.html',
                scope:{
                    clickFn: '&',
                    text: '@',
                    activeText: '@',
                    buttonClass: '@',
                    icon: '@',
                    buttonDisabled: '=?',
                    showButton: '=?'
                },
                link:function (scope, element, attrs) {
                    scope.showButton = true;
                    scope.onClick = function() {
                        scope.error = undefined;
                        scope.updating = true;
                        scope.buttonDisabled = true;
                        var promise = scope.clickFn();
                        promise.then(function() {
                            scope.updating = false;
                            scope.buttonDisabled = false;
                        }, function(error) {
                            scope.updating = false;
                            scope.buttonDisabled = false;
                            scope.error = error;
                        });
                    };
                }
            };
        });
})();
