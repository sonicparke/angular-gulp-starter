(function() {
    'use strict';

    angular.module('app.core')
        .controller('AppList', AppList);

    AppList.$inject = ['AppSecurity', 'JWT'];
    /* @ngInject */
    function AppList (AppSecurity, JWT) {
        var vm = this;
        vm.showLoader = true;
        vm.GetDataItems = [];
        vm.GetMenuItems = GetMenuItems;

        // Initial Functions
        vm.InitPage = function() {
            vm.GetMenuItems();
        };

        function GetMenuItems(data) {
            var token = JWT.getToken();
            vm.itemsResults = AppSecurity.all('MenuItems').getList();
            return vm.itemsResults.then(function(data) {
                vm.showLoader = false;
                vm.MenuItems = data;
            });
        }
    }
})();
