(function() {
    'use strict';

    angular.module('app.core')
        .factory('SeverSelectData', SeverSelectData);

    SeverSelectData.$inject = ['$http'];
    /* @ngInject */
    function SeverSelectData($http) {
        var url = 'http://axcapps.harsco.com/DevelopmentEnvironmentWebAPI/api/';

        var GetServers = function(data) {
            return $http.get(url + 'servers').then(function(res) {
                return res;
            });
        };
        var GetUsers = function(data) {
            return $http.get(url + 'users').then(function(res) {
                return res;
            });
        };
        var GetAPIs = function(data) {
            return $http.get(url + 'apis').then(function(res) {
                return res;
            });
        };
        var GetAllData = function(data) {
            return $http.get(url + 'all').then(function(res) {
                return res;
            });
        };

        return {
            GetServers: GetServers,
            GetUsers: GetUsers,
            GetAPIs: GetAPIs,
            GetAllData: GetAllData
        };
    }
})();
