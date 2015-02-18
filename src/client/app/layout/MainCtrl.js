(function() {
    'use strict';

    angular.module('app.core')
        .controller('Main', Main);

    Main.$inject = ['appConfig'];
    /* @ngInject */
    function Main (appConfig) {

        var vm = this;
        vm.appConfig = appConfig;

    }
})();
