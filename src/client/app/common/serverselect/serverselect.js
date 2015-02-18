(function() {

    'use strict';
    /*global _:false */
    //////////////////////////////////////////////////////////
    //
    // AXC WebAPI Server Select Directive
    // Requires Angular UI Boostrap http://angular-ui.github.io/bootstrap/
    //
    //////////////////////////////////////////////////////////
    angular.module('app.serverselect')
        .directive('ngServerSelect', ngServerSelect);

    ngServerSelect.$inject = ['DataService'];
    /* @ngInject */
    function ngServerSelect(DataService) {
        return {
            restrict: 'E,A',
            replace: true,
            controller: ss,
            templateUrl: 'app/common/serverselect/serverselect.html',
            scope: {}
        };
    }

    ss.$inject = ['$scope', 'ServerAPI', 'SeverSelectData'];
    /* @ngInject */
    function ss ($scope, ServerAPI, SeverSelectData) {
        var Server;
        var API;
        $scope.showServerSelect = false;

        SeverSelectData.GetAllData().then(function (result) {
            $scope.data = result.data;
            checkUser();
        });

        // Get the current user from the asp.net yukiness
        $scope.currentUser = 'bmcalister';

        // Show or hide component based on user
        var checkUser = function () {
            return _.find($scope.data.Users, function (user) {
                if (user.Name === $scope.currentUser) {
                    $scope.showServerSelect = true;
                }
            });
        };

        $scope.GetServer = function () {
            Server = ServerAPI.GetServer();
            if (!Server) {
                Server = 'axcapps.harsco.com';
                $scope.selectedServer = Server;
                return Server;
            } else {
                $scope.selectedServer = Server;
                return Server.servername;
            }
        };

        $scope.SetServer = function (data) {
            var selectedServer = ServerAPI.SetServer(data);
            $scope.selectedServer = selectedServer;
        };

        $scope.RemoveServer = function (data) {
            var selectedServer = ServerAPI.RemoveServer(data);
            $scope.selectedServer = selectedServer;
        };

        $scope.GetAPI = function () {
            API = ServerAPI.GetAPI();
            if (API === 'Test') {
                $scope.showServerSelect = false;
            }
            if (!API) {
                API = '';
                $scope.selectedAPI = API;
                return API;
            } else {
                $scope.selectedAPI = API;
                return API.name;
            }
        };

        $scope.SetAPI = function (data) {
            var selectedApi = ServerAPI.SetAPI(data);
            $scope.GetAPI();

        };

        $scope.RemoveAPI = function (data) {
            var selectedAPI = ServerAPI.RemoveAPI(data);
            $scope.selectedAPI = selectedAPI;
        };

    }
})();

