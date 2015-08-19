/**
 * Main Controller for the Angular Material Starter App
 * @constructor
 */
function UsersController(userService, $mdSidenav, $mdBottomSheet, $log, RC) {
    $log = $log.getInstance("SessionController");
    $log.debug("instanceOf() ");
    $log.log('RC', RC);

    var self = this;

    self.selected = null;
    self.users = [];
    self.selectUser = selectUser;
    self.toggleList = toggleUsersList;
    self.share = share;

    // Load all registered users

    userService
        .loadAllUsers()
        .then(function (users) {
            self.users = [].concat(users);
            self.selected = users[0];
        });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
        $mdSidenav('left').toggle();
    }

    /**
     * Select the current avatars
     */
    function selectUser(user) {
        self.selected = angular.isNumber(user) ? $scope.users[user] : user;
        self.toggleList();
    }

    /**
     * Show the bottom sheet
     */
    function share($event) {
        var user = self.selected;

        $mdBottomSheet.show({
            parent: angular.element(document.getElementById('content')),
            templateUrl: RC.urls.static + 'app/users/view/contactSheet.html',
            controller: ['$mdBottomSheet', UserSheetController],
            controllerAs: 'vm',
            bindToController: true,
            targetEvent: $event
        }).then(function (clickedItem) {
            $log.debug(clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function UserSheetController($mdBottomSheet) {
            this.user = user;
            this.items = [
                {
                    name: 'Phone',
                    icon: 'phone',
                    iconUrl: RC.urls.static + 'assets/svg/phone.svg'
                },
                {
                    name: 'Twitter',
                    icon: 'twitter',
                    iconUrl: RC.urls.static + 'assets/svg/twitter.svg'
                },
                {
                    name: 'Google+',
                    icon: 'google_plus',
                    iconUrl: RC.urls.static + 'assets/svg/google_plus.svg'
                },
                {
                    name: 'Hangout',
                    icon: 'hangouts',
                    iconUrl: RC.urls.static + 'assets/svg/hangouts.svg'
                }
            ];
            this.performAction = function (action) {
                $mdBottomSheet.hide(action);
            };
        }
    }

}

export default [
    'usersService', '$mdSidenav', '$mdBottomSheet', '$log', 'RC',
    UsersController
];
