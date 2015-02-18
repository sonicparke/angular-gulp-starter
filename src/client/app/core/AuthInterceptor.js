(function() {
    'use strict';

    angular.module('app.core')
        .factory('AuthInterceptor', AuthInterceptor);

    AuthInterceptor.$inject = ['JWT'];
    /* @ngInject */
    function AuthInterceptor(JWT) {
        var service = {
            request: addToken
        };

        return service;

        function addToken(config) {
            var token = JWT.getToken().$$state.value;
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        }
    }

})();
