var authenticationModule = angular.module('authentication', []);

authenticationModule.service("authenticationService", function ($http, $q, $window, $location, Notification) {
    var service = {};
    var userInfo = {};

    service.getEmail = function () {
        userInfo = JSON.parse($window.sessionStorage["user"]);
        return userInfo.email;
    };

    service.getCurrentUser = function () {
        userInfo = JSON.parse($window.sessionStorage["user"]);
        return userInfo;
    };

    service.authenticate = function () {
        var deferred = $q.defer();

        if ($window.sessionStorage["user"]) {
            $http.get('/api/users', {
                user: JSON.parse($window.sessionStorage['user'])
            })
            .success(function () {
                deferred.resolve({authenticated: true});
            })
            .error(function (error) {
                $window.sessionStorage.removeItem("user");
                deferred.reject({authenticated: false, message: error.message});
            });
        } else {
            deferred.reject({authenticated: false, message: 'Please log in'});
        }

        return deferred.promise;
    };

    service.login = function (credentials) {
        $http.post('/api/users/login', {
            user: credentials
        })
        .success(function (result) {
            userInfo = {
                email: result.email,
                user_id: result.user_id
            };

            $window.sessionStorage["user"] = JSON.stringify(userInfo);
            Notification.success({message: result.message});
            $location.path('/dashboard');
        })
        .error(function (status) {
            Notification.error({message: status.message})
        });
    };

    service.logout = function () {
        $http.post('/api/users/logout', {
            user: JSON.parse($window.sessionStorage["user"])
        })
        .success(function (result) {
            delete $window.sessionStorage["user"];
            Notification.success({message: result.message});
            $location.path('/');
        })
        .error(function (status, data) {
            Notification.error({message: status.message});
        });
    };

    return service;
});