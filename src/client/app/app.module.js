(function() {

    'use strict';

    angular.module('app', [
        /* Shared modules */
        'app.core',

        /* Feature areas */
        'app.login',
        'app.layout',
        'app.feature'
    ]).config(config);


    // TODO: Figure out how to move routes to feature folders. Keep getting $stateProvider injection error
    config.$inject = ['$stateProvider', '$httpProvider', '$tooltipProvider', '$urlRouterProvider'];
    /* @ngInject */
    function config($stateProvider, $httpProvider, $tooltipProvider, $urlRouterProvider) {


        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.interceptors.push('AuthInterceptor');



        $stateProvider
            .state('feature', {
                url: '/feature',
                templateUrl: 'app/feature/feature.html',
                controller: 'feature',
                controllerAs: 'vm'
            });


        $urlRouterProvider.otherwise('/');
        $tooltipProvider.options({appendToBody: true});
    }

})();
