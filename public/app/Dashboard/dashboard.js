var dashboardModule = angular.module('dashboard', []);

dashboardModule.controller('dashboardMain', function ($scope, $http, $rootScope, Notification) {
    $scope.buttonsDisconnect = function() {
        $rootScope.casparcg_connected = true;
        $scope.conn_message = 'Disconnect from Server';
        $scope.conn_class = 'disconnect';
    };

    $scope.buttonsConnect = function() {
        $rootScope.casparcg_connected = false;
        $scope.conn_message = 'Connect to Server';
        $scope.conn_class = 'connect';
    };

    if($rootScope.casparcg_connected == false) {
        $scope.buttonsConnect();
    } else {
        $scope.buttonsDisconnect();
    }

    $scope.play =  function(fields) {
        fields.channel = '1-1';
        fields.template = 'information';
        $http.post('/api/casparcg/play', fields).success(function (result) {
            Notification.success(result);
        }).error(function (data) {
            if(data.server_conn == false) {
                $scope.buttonsConnect();
            }
            Notification.error(data.message);
        });
    };

    $scope.stop =  function(fields) {
        fields.channel = '1-1';
        fields.template = 'information';
        $http.post('/api/casparcg/stop', fields).success(function (result) {
            Notification.success(result);
        }).error(function (data) {
            if(data.server_conn == false) {
                $rootScope.casparcg_connected = false;
                $scope.buttonsConnect();
            }
            Notification.error(data.message);
        });
    };

    $scope.update = function(fields) {
        fields.channel = '1-1';
        fields.template = 'information';
        console.log(fields);
        $http.put('/api/casparcg/update', fields).success(function (result) {
            Notification.success(result);
        }).error(function (data) {
            if(data.server_conn == false) {
                $rootScope.casparcg_connected = false;
                $scope.buttonsConnect();
            }
            Notification.error(data.message);
        });
    };

    $scope.connection_toggle = function() {
        if(!$rootScope.casparcg_connected) {
            $http.post('/api/casparcg/connect').success(function (result) {
                Notification.success(result);
                $scope.buttonsDisconnect();
            }).error(function (data, status) {
                Notification.error(status + ' ' + data);
            });
        } else {
            $http.post('/api/casparcg/disconnect').success(function (result) {
                Notification.success(result);
                $scope.buttonsConnect();
            }).error(function (data, status) {
                Notification.error(status + ' ' + data);
            });
        }
    };
}).directive('templates', function() {
    return {
        restrict: 'E',
        templateUrl: '/assets/layouts/templates.html'
    }
});