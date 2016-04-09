(function() {

  'use strict';

  var module = angular.module('angularModalService', []);

  module.factory('ModalService', ['$document', '$compile', '$controller', '$http', '$rootScope', '$q', '$templateCache',
    function($document, $compile, $controller, $http, $rootScope, $q, $templateCache) {

    var body = $document.find('body');

    function ModalService() {

      var self = this;

      var getTemplate = function(template, templateUrl) {
        var deferred = $q.defer();
        if(template) {
          deferred.resolve(template);
        } else if(templateUrl) {
          var cachedTemplate = $templateCache.get(templateUrl);
          if(cachedTemplate !== undefined) {
            deferred.resolve(cachedTemplate);
          }
          else {
            $http({method: 'GET', url: templateUrl, cache: true})
              .then(function(result) {
                $templateCache.put(templateUrl, result.data);
                deferred.resolve(result.data);
              }, function(error) {
                deferred.reject(error);
              });
          }
        } else {
        }
        return deferred.promise;
      };

      self.showModal = function(options) {
        var deferred = $q.defer();
        var controllerName = options.controller;
        if(!controllerName) {
          deferred.reject("No controller has been specified.");
          return deferred.promise;
        }
        if(options.controllerAs) {
          controllerName = controllerName + " as " + options.controllerAs;
        }
        getTemplate(options.template, options.templateUrl)
          .then(function(template) {
            var modalScope = $rootScope.$new();
            var closeDeferred = $q.defer();
            var inputs = {
              $scope: modalScope,
              close: function(result, delay) {
                if(delay === undefined || delay === null) delay = 0;
                setTimeout(function() {
                  modalElement.addClass('fade-out');
                },0);
                window.setTimeout(function() {
                  closeDeferred.resolve(result);
                  modalScope.$destroy();
                  modalElement.remove();
                  inputs.close = null;
                  deferred = null;
                  closeDeferred = null;
                  modal = null;
                  inputs = null;
                  modalElement = null;
                  modalScope = null;
                }, delay);
              }
            };

            if(options.inputs) {
              for(var inputName in options.inputs) {
                inputs[inputName] = options.inputs[inputName];
              }
            }

            var modalElementTemplate = angular.element(template);
            var linkFn = $compile(modalElementTemplate);
            var modalElement = linkFn(modalScope);
            inputs.$element = modalElement;

            var modalController = $controller(controllerName, inputs);
            if (options.appendElement) {
              options.appendElement.append(modalElement);
            } else {
              body.append(modalElement);
            }

            var modal = {
              controller: modalController,
              scope: modalScope,
              element: modalElement,
              close: closeDeferred.promise
            };

            setTimeout(function() {
              modalElement.addClass('fade-in');
            }, 0);

            deferred.resolve(modal);
          })
          .then(null, function(error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

    }

    return new ModalService();
  }]);

}());