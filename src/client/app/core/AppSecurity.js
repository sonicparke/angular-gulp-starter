(function() {
    'use strict';

    // Restangular services
    angular.module('app.core')
        .factory('AppSecurity', AppSecurity);

    AppSecurity.$inject = ['Restangular', 'ServerAPI'];
    /* @ngInject */
    function AppSecurity (Restangular, ServerAPI) {
        var servername = ServerAPI.GetServer().Name;
        var apitype = ServerAPI.GetAPI().Name;

        var BaseUrl = 'http://' + servername + '/appsecuritywebapi' + apitype + '/api';

        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(BaseUrl);
        });

    }
})();
