var authenticationModule = angular.module('casparcg', []);

authenticationModule.service("casparcgService", function ($http, $q, $window, $location, $rootScope, Notification, socket) {
    var service = {};
    var deferred = $q.defer();

    service.play =  function(fields) {
        var self = this;
        $http.post('/api/casparcg/play', fields).success(function (result) {
            Notification.success(result);
            return deferred.resolve(result);
        }).error(function (data) {
            Notification.error(data.message);
            return deferred.reject(data);
        });

        return deferred.promise;
    };

    service.stop =  function(fields) {
        var self = this;
        $http.post('/api/casparcg/stop', fields).success(function (result) {
            Notification.success(result);
            return deferred.resolve(result);
        }).error(function (data) {
            Notification.error(data.message);
            return deferred.reject(data);
        });

        return deferred.promise;
    };

    service.update = function(fields) {
        var self = this;
        $http.put('/api/casparcg/update', fields).success(function (result) {
            Notification.success(result);
            return deferred.resolve(result);
        }).error(function (data) {
            Notification.error(data.message);
            return deferred.reject(data);
        });

        return deferred.promise;
    };

    service.connection_toggle = function() {
        var self = this;
        if(!$rootScope.casparcg_connected) {
            $http.post('/api/casparcg/connect').success(function (result) {
                return deferred.resolve(result);
            }).error(function (data, status) {
                Notification.error(status + ' ' + data.message);
                return deferred.reject(data);
            });
        } else {
            $http.post('/api/casparcg/disconnect').success(function (result) {
                return deferred.resolve(result);
            }).error(function (data, status) {
                Notification.error(status + ' ' + data.message);
                return deferred.reject(data);
            });
        }

        return deferred.promise;
    };

    service.clear =  function(fields) {
        var self = this;
        $http.post('/api/casparcg/clear', fields).success(function (result) {
            Notification.success(result);
            return deferred.resolve(result);
        }).error(function (data) {
            Notification.error(data.message);
            return deferred.reject(data);
        });

        return deferred.promise;
    };

    service.isConnected = function() {
        var self = this;
        $http.get('/api/casparcg/is_connected').success(function (result) {
            self.buttonsDisconnect();
            return deferred.resolve(result);
        }).error(function (data) {
            self.buttonsConnect();
            return deferred.reject(data);
        });

        return deferred.promise;
    };

    service.buttonsDisconnect = function() {
        $rootScope.casparcg_connected = true;
        $rootScope.conn_message = 'Disconnect from Server';
        $rootScope.conn_class = 'disconnect';
    };

    service.buttonsConnect = function() {
        $rootScope.casparcg_connected = false;
        $rootScope.conn_message = 'Connect to Server';
        $rootScope.conn_class = 'connect';
    };

    /* Listening for Node socket.io emits */

    socket.on('serverDisconnected', function (message) {
        Notification.error(message.message);
        if(message.server_conn == false) {
            service.buttonsConnect();
        }
    });

    socket.on('serverConnected', function (message) {
        Notification.success(message.message);
        if(message.server_conn == true) {
            service.buttonsDisconnect();
        }
    });

    return service;
});