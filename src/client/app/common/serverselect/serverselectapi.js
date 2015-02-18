(function() {
    'use strict';
    /*global _:false*/
    angular.module('app.core')
        .factory('ServerAPI', ServerAPI);

    ServerAPI.$inject = [];
    /* @ngInject */
    function ServerAPI() {
        var Server = {};
        var API = {};
        var SetServer = function(data) {
            localStorage.setItem('AXC_API_Storage.Server', JSON.stringify(data));
            Server = JSON.parse(localStorage.getItem('AXC_API_Storage.Server'));
            return Server;
        };
        var GetServer = function(data) {
            var testUrl = _.contains(window.location.pathname, 'test');
            if (testUrl === true) {
                Server.Name = 'axcapps.harsco.com';
                return Server;
            }
            else if (localStorage.getItem('AXC_API_Storage.Server')) {
                Server = JSON.parse(localStorage.getItem('AXC_API_Storage.Server'));
                return Server;
            } else {
                Server.Name = 'axcapps.harsco.com';
                return Server;
            }
        };
        var RemoveServer = function(data) {
            if (localStorage.getItem('AXC_API_Storage.Server')) {
                localStorage.removeItem('AXC_API_Storage.Server');
                Server = JSON.parse(localStorage.getItem('AXC_API_Storage.Server'));
            }
        };
        var SetAPI = function(data) {
            localStorage.setItem('AXC_API_Storage.API', JSON.stringify(data));
            API = JSON.parse(localStorage.getItem('AXC_API_Storage.API'));
            return API;
        };
        var GetAPI = function(data) {
            var url = _.contains(window.location.pathname, 'test');
            if (url === true) {
                API.Name = 'Test';
                return API;
            }
            else if (localStorage.getItem('AXC_API_Storage.API')) {
                API = JSON.parse(localStorage.getItem('AXC_API_Storage.API'));
                return API;
            }
            else {
                API.Name = '';
                return API;
            }
        };
        var RemoveAPI = function(data) {
            if (localStorage.getItem('AXC_API_Storage.API')) {
                localStorage.removeItem('AXC_API_Storage.API');
                API = JSON.parse(localStorage.getItem('AXC_API_Storage.API'));
            }
        };
        return {
            SetServer: SetServer,
            GetServer: GetServer,
            RemoveServer: RemoveServer,
            SetAPI: SetAPI,
            GetAPI: GetAPI,
            RemoveAPI: RemoveAPI
        };
    }
})();
