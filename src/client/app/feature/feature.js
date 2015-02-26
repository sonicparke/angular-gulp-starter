(function() {
    'use strict';

    angular.module('app.core')
        .controller('Feature', Feature);

    Feature.$inject = ['Service'];
    /* @ngInject */
    function Feature (Service) {
        var vm = this;
        vm.showLoader = true;
        vm.GetItems = GetItems;
        vm.Items = [];

        // Initial Functions
        vm.InitPage = function() {
            vm.GetItems();
        };

        function GetItems(data) {
            var token = JWT.getToken();
            vm.itemsResults = Service.all('Items').getList();
            return vm.itemsResults.then(function(res) {
                vm.showLoader = false;
                vm.Items = res;
            });
        }
    }
})();
