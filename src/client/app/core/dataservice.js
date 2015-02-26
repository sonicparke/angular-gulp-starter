(function() {
    'use strict';

    angular.module('app.core')
        .factory('DataService', DataService);

    DataService.$inject = ['$q', 'Service'];
    /* @ngInject */
    function DataService($q, Service) {

        var service = {
            GetItems: GetItems
        };

        return service;

        function GetItems(data) {
            var deferred = $q.defer();
            var params = {UserName: data};
            var results = Service.all('menuitems').getList(params).then(function(result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }


    }

})();
