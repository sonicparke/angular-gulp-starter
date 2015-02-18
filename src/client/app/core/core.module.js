(function() {
    'use strict';

    angular
        .module('app.core', [
            /* Angular modules */
            'ngAnimate',
            'ngSanitize',

            /* Cross-app modules */
            'app.loader',
            'app.serverselect',
            'app.uibutton',

            /* 3rd-party modules */
            'ui.router',
            'restangular',
            'ui.bootstrap',
            'ngStorage',
            'toastr'
        ]);

})();
