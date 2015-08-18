(function () {
    'use strict';

    angular
        .module('starterApp')
        .config(Config);

    Config.$inject = ['$mdThemingProvider', '$mdIconProvider', 'RC'];

    function Config($mdThemingProvider, $mdIconProvider, RC)
    {
        $mdIconProvider
            .defaultIconSet(RC.urls.static + 'assets/svg/avatars.svg', 128)
            .icon('menu', RC.urls.static + 'assets/svg/menu.svg', 24)
            .icon('share', RC.urls.static + 'assets/svg/share.svg', 24)
            .icon('google_plus', RC.urls.static + 'assets/svg/google_plus.svg', 512)
            .icon('hangouts', RC.urls.static + 'assets/svg/hangouts.svg', 512)
            .icon('twitter', RC.urls.static + 'assets/svg/twitter.svg', 512)
            .icon('phone', RC.urls.static + 'assets/svg/phone.svg', 512);

        $mdThemingProvider.theme('default')
            .primaryPalette('brown')
            .accentPalette('red');
    }

}());
