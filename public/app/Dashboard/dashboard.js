var dashboardModule = angular.module('dashboard', []);

dashboardModule.controller('dashboardTest', function ($scope, $http, Notification) {
    $scope.play =  function(fields) {
        console.log(fields);
        fields.channel = '1-1';
        fields.template = 'information';
        $http.post('/api/casparcg/play', fields).success(function (result) {
            Notification.success(result);
        }).error(function (data) {
            Notification.error(data.message);
        });
    };

    $scope.stop =  function(fields) {
        fields.channel = '1-1';
        fields.template = 'information';
        $http.post('/api/casparcg/stop', fields).success(function (result) {
            Notification.success(result);
        }).error(function (data) {
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
            Notification.error(data.message);
        });
    }

}).directive('templateTest', function() {
    return {
        restrict: 'E',
        templateUrl: '/assets/layouts/dashboard-template-test.html'
    }
});

dashboardModule.controller('dashboardConnection', function ($scope, $http, Notification) {
    $scope.conn_message = 'Connect to Server';
    $scope.conn_class = 'connect';

    $scope.connection_toggle = function() {
        if($scope.conn_class == 'connect') {
            $http.post('/api/casparcg/connect').success(function (result) {
                Notification.success(result);
                $scope.conn_message = 'Disconnect from Server';
                $scope.conn_class = 'disconnect';
            }).error(function (data, status) {
                Notification.error(status + ' ' + data);
            });
        } else {
            $http.post('/api/casparcg/disconnect').success(function (result) {
                Notification.success(result);
                $scope.conn_message = 'Connect to Server';
                $scope.conn_class = 'connect';
            }).error(function (data, status) {
                Notification.error(status + ' ' + data);
            });
        }
    };
});