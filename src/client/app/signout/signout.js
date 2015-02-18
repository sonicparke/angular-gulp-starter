(function() {
    'use strict';

    angular.module('app.core')
        .directive('signOut', SignOut);

    //SignOut.$inject = [];
    /* @ngInject */
    function SignOut () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/signout/signout.html',
            scope:{
            },
            controllerAs: 'signout',
            controller: Controller
        };
    }

    Controller.$inject = ['$state', 'JWT', 'toastr'];
    /* @ngInject */
    function Controller($state, JWT, toastr) {
        var vm = this;

        vm.SignOut = function() {
            console.log('signout');
            JWT.setToken().then(function() {
                toastr.info('You\'ve signed out now. Sorry to see you go...', 'Goodbye. :-(');
                $state.go('login');
            });
        };
    }
})();
