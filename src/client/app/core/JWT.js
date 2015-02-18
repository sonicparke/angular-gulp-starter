(function() {
    'use strict';

    angular.module('app.core')
        .factory('JWT', JWT);

    JWT.$inject = ['$q'];
    /* @ngInject */
    function JWT($q) {

        var key = 'AXC_API_Storage.Token';

        var service = {
            getToken: getToken,
            setToken: setToken
        };

        return service;

        //function getToken() {
        //
        //    var token = store.getItem(key);
        //    console.log('token', token);
        //    if(token){
        //        return $q.when(token);
        //    }
        //    return $q.reject('NO_TOKEN_FOUND');
        //};

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
                //localStorage.removeItem(key);
                return deferred.promise;
            }
        }


    }


})();
