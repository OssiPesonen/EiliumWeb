var usersModule = angular.module('users', ['authentication']);

usersModule.controller('usersUser', function ($scope, $http, authenticationService, ModalService, Notification) {
    $http.get('/api/user').success(function (result) {
        $scope.user = {
                id: result.id,
                email: result.email
        };
    }).error(function (data, status) {
        Notification.error(status + ' ' + data);
    });

    $scope.editUser = function (user) {
        ModalService.showModal({
            templateUrl: '/assets/layouts/user-edit.html',
            controller: 'usersEdit',
            inputs: {
                user: user
            }
        }).then(function (modal) {
            modal.close.then(function (obj) {
                if(typeof obj != "undefined") {
                    $scope.user.email = obj.email;
                }
            });
        });
    };
}).directive('userMenu', function () {
    return {
        restrict: 'E',
        templateUrl: '/assets/layouts/user-menu.html'
    };
});

usersModule.controller('usersLogin', function ($scope, $rootScope, authenticationService) {
    $scope.title = 'EiliumWeb';
    $scope.slogan = 'CasparCG Control Panel';
    $scope.viewClass = 'animate-home';
    $rootScope.bodyClass = 'login form index';

    $scope.credentials = {email: '', password: ''};

    $scope.login = function (credentials) {
        authenticationService.login(credentials);
    };
});

usersModule.controller('usersLogout', function ($http, $scope, $rootScope, authenticationService) {
    $scope.title = 'You have logged out';

    $scope.logout = function () {
        $http.post('/api/casparcg/disconnect').success(function () {
            $rootScope.casparcg_connected = false;
        }).error(function (data, status) {
            Notification.error(status + ' ' + data);
        });

        authenticationService.logout();
    }
});

usersModule.controller('usersRegister', function($scope, $http, $location, Notification) {
    $scope.title = 'Register';

    $scope.register = function (signup) {
        $http.post('/api/users/register', {user: signup})
            .success(function () {
                Notification.success({message: 'User successfully created'});
                $location.path( "/dashboard" );
            })
            .error(function(status, data) {
                Notification.error({message: status + ' ' + data});
                close(200);
            });
    };
});

usersModule.controller('debugController', function($scope, $http) {
    $scope.debug = false;

    $http.get('/api/v1/debug_mode').success(function() {
        $scope.debug = true;
    });
});

usersModule.controller('usersEdit', function ($scope, $http, close, user, Notification) {
    $scope.user = angular.copy(user);

    $scope.title = (user.id > 0) ? 'Update user data' : 'Add user';
    $scope.buttonText = (user.id > 0) ? 'Update' : 'Add';

    $scope.dismissModal = function (result) {
        close(result, 200);
    };

    $scope.submit = function (data) {
        if($scope.userEdit.$valid) {
            $http.post('/api/v1/user', data)
                .success(function (result) {
                    Notification.success(result);
                }).error(function (data, status) {
                    Notification.error(status + ' ' + data);
                });

            close(data, 200);
        }
        else {
            Notification.error('Some fields contain errors');
        }
    }
});
