var app = angular.module('eilium', ['ngRoute', 'angularModalService', 'ngStorage', 'ngAnimate', 'ngSanitize', 'users', 'notifications', 'dashboard']);

app.config(function ($routeProvider, $locationProvider) {
    var authResolver = {
        'auth': function (authenticationService) {
            return authenticationService.authenticate();
        }
    };

    $routeProvider.
        when('/', {
            title: 'Log in',
            templateUrl: '/assets/layouts/user-login.html',
            resolve: {
                auth: function ($q, $location, authenticationService) {
                    var defer = $q.defer();
                    var auth = authenticationService.authenticate();

                    auth.then(function () {
                        $location.path('/dashboard');
                    }).catch(function () {
                        defer.resolve();
                    });

                    return defer.promise;
                }
            }
        })
        .when('/logout', {
            title: 'Log out',
            controller: 'usersLogout',
            templateUrl: '/assets/layouts/user-login.html',
            auth: {
                logout: function (authenticationService) {
                    authenticationService.logout();
                }
            }
        })
        .when('/register', {
            title: 'Register',
            controller: 'usersRegister',
            templateUrl: '/assets/layouts/user-register.html',
            auth: {
                logout: function (authenticationService) {
                    authenticationService.logout();
                }
            }
        })
        .when('/dashboard', {
            title: 'Dashboard',
            templateUrl: '/assets/layouts/dashboard.html',
            resolve: authResolver
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
})
.run(function ($rootScope, $location, Notification) {
    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            Notification.error(eventObj.message);
            $location.path("/");
        } else if (eventObj.authenticated === true) {
            $location.path("/dashboard");
        }
    });
})
.directive('focus', function () {
    return function (scope, element) {
        element[0].focus();
    }
})
.directive('passwordMatch', function () {
    return {
        restrict: 'A',
        scope: true,
        require: 'ngModel',
        link: function (scope, elem, attrs, control) {
            var checker = function () {
                var e1 = scope.$eval(attrs.ngModel);
                var e2 = scope.$eval(attrs.passwordMatch);
                return e1 == e2;
            };
            scope.$watch(checker, function (n) {
                control.$setValidity("unique", n);
            });
        }
    };
})
.directive('elementEnter', function ($animate) {
    $animate.on('enter', container,
        function callback(element, phase) {
            element.addClass('enter-in');
        }
    );
});