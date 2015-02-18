(function() {

    'use strict';

    angular.module('app', [
        /* Shared modules */
        'app.core',

        /* Feature areas */
        'app.login',
        'app.layout',
        'app.applist'
    ]).config(config);


    // TODO: Figure out how to move routes to feature folders. Keep getting $stateProvider injection error
    config.$inject = ['$stateProvider', '$httpProvider', '$tooltipProvider', '$urlRouterProvider'];
    /* @ngInject */
    function config($stateProvider, $httpProvider, $tooltipProvider, $urlRouterProvider) {


        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.interceptors.push('AuthInterceptor');



        $stateProvider
            .state('applist', {
                url: '/applist',
                templateUrl: 'app/applist/applist.html',
                controller: 'AppList',
                controllerAs: 'vm',
                resolve: {
                    validate: ['JWT', '$state', function(JWT, $state) {
                        var authenticated;
                        return JWT.getToken().then(function(res) {
                            authenticated = res;
                            if (!authenticated) {
                                $state.go('login');
                            }
                        });
                    }]
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'Login',
                controllerAs: 'vm',
                resolve: {
                    validate: ['JWT', '$state', function(JWT, $state) {
                        var authenticated;
                        return JWT.getToken().then(function(res) {
                            authenticated = res;
                            if (authenticated) {
                                $state.go('applist');
                            }
                        });
                    }]
                }
            });

        $urlRouterProvider.otherwise('login');
        $tooltipProvider.options({appendToBody: true});
    }

})();
