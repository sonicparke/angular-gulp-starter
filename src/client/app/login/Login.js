(function() {
    'use strict';

    angular.module('app.core')
        .controller('Login', Login);

    Login.$inject = ['$state', 'DataService', 'JWT', 'toastr'];
    /* @ngInject */
    function Login ($state, DataService, JWT, toastr) {
        var vm = this;

        vm.Login = login;

        function login() {
            return DataService.Login(vm.login).then(function(res) {
                vm.currentUser = res;
                console.log('res', res);
                if (res.Valid === 'False') {
                    toastr.error('Your username or password is incorrect...', 'UhOh!');
                } else {
                    toastr.success('You\'re in!', 'WOO HOO!!!!');
                    JWT.setToken(res.JWT);
                    $state.go('applist');
                }

            });
        }

    }
})();
