(function() {
    'use strict';

    angular.module('app.core')
        .factory('JWT', JWT);

    JWT.$inject = ['$q'];
    /* @ngInject */
    function JWT($q) {

        var key = 'API_Storage.Token';

        var service = {
            getToken: getToken,
            setToken: setToken
        };

        return service;


        function getToken() {
            var deferred = $q.defer();
            var token = localStorage.getItem(key);

            deferred.resolve(token);
            return deferred.promise;
        }


        function setToken(token) {
            var deferred = $q.defer();
            if (token) {
                localStorage.setItem(key, token);
            }
            else {
                deferred.resolve(localStorage.removeItem(key));
                return deferred.promise;
            }
        }


    }


})();
