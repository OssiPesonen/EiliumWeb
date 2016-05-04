var dashboardModule = angular.module('dashboard', ['casparcg']);

dashboardModule.controller('dashboardMain', function ($scope, $http, $rootScope, Notification, casparcgService) {
    $scope.fields = {};
    $scope.isDisabled = true;
    $scope.isEnabled = false;

    $scope.tab = 'information';

    $scope.setTab = function(tab_name){
      $scope.tab = tab_name;
    };

    $scope.tabSet = function(tab_name) {
      return $scope.tab === tab_name;
    };

    casparcgService.isConnected();

    $http.get('/api/fields').success(function (result) {
        result = result.fields;
        angular.forEach(result, function (value, _key) {
            if ($scope.fields[value.template] == undefined) {
                $scope.fields[value.template] = {f0: ''};
            }

            $scope.fields[value.template][value.key] = value.value;
        });
    }).error(function (data) {
        Notification.error(data.message);
    });

    $scope.play = function (channel, template, inputs) {
        var _inputs = {};

        if (inputs[template] === undefined) {
            $scope.fields[template] = {f0: ''};
        }

        setTimeout(function () {
            if (inputs[template].replaced !== undefined) {
                _inputs = inputs[template].replaced;
            } else {
                _inputs = inputs[template];
            }

            var fields = {channel: channel, template: template, inputs: _inputs};

            casparcgService.play(fields);
        }, 100);
    };

    $scope.stop = function (channel) {
        var fields = {channel: channel};

        casparcgService.stop(fields, function (data) {
            if (data.server_conn == false) {
                casparcgService.buttonsConnect();
            }
        });
    };

    $scope.update = function (channel, template, inputs) {
        var _inputs = {};

        if (inputs[template] === undefined) {
            $scope.fields[template] = {f0: ''};
        }

        setTimeout(function () {
            if (inputs[template].replaced !== undefined) {
                _inputs = inputs[template].replaced;
            } else {
                _inputs = inputs[template];
            }

            var fields = {channel: channel, template: template, inputs: _inputs};

            casparcgService.update(fields);
        }, 100);

    };

    $scope.clear = function (channel) {
        var fields = {channel: channel};
        casparcgService.clear(fields);
    };

    $scope.connection_toggle = function () {
        casparcgService.connection_toggle();
    };

    $scope.select_box = function () {
        alert('You selected this');
    };

    $scope.save_fields = function (inputs) {
        var fields = {inputs: inputs};

        $http.post('/api/save', fields).success(function (result) {
            Notification.success(result);
        }).error(function (data) {
            Notification.error(data.message);
        });
    };

}).directive('templates', function () {
    return {
        restrict: 'E',
        templateUrl: '/assets/layouts/templates.html'
    }
}).directive('toggleInputs', function () {
    return {
        compile: function (element, attrs) {
            element.find('.box').bind('dblclick', function () {
                element.find('.box').removeClass('selected');
                $(this).addClass('selected');
                toggleInputDisabled();
            });

            function toggleInputDisabled() {
                element.find('.box').each(function () {
                    $(this).find(':input').attr('disabled', !$(this).hasClass('selected'));
                });
            }

            toggleInputDisabled();
        }
    };
}).directive('buttonClick', function () {
    return {
        priority: 100,
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                /* This can be changed to form submit */
                scope.fields.information.replaced = {};

                var i = 0;

                $('.selectable-boxes .box.selected input').each(function () {
                    scope.fields.information.replaced['f' + i] = $(this).val();
                    i++;
                });

                scope.$apply();
            });
        }
    };
});

app.directive('helpBalloon', function () {
    return {
        link: function (scope, element, attrs) {
            var $element = element;

            $element.find('.content').hide();

            $element.hover(function () {
                $(this).find('.content').stop().fadeIn(250);
            }, function () {
                $(this).find('.content').stop().fadeOut(250);
            });
        }
    };
});
