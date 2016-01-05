(function() {
    'use strict';

    angular
        .module('app.core', [
            /* Angular modules */
            'ngAnimate',
            'ngSanitize',

            /* Cross-app modules */
            'app.uibutton',

            /* 3rd-party modules */
            'ui.router',
            'restangular',
            'ngStorage',
            'toastr'
        ]);

})();
