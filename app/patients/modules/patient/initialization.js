'use strict';

angular.module('opd.patient').factory('initialization', ['$rootScope', '$q', 'configurationService', 'authenticator', 'appService', '$route',
    function ($rootScope, $q, configurationService, authenticator, appService, $route) {

        var getAppContext = function(prefix) {
            var appContext = $route.current.params["appContext"];
            appContext = appContext || '';
            appContext = appContext.trim();
            return (appContext != '') ? (prefix + '/' + appContext) : prefix;
        }

        var initializationPromise = $q.defer();

        var getConfigs = function () {
            var configurationsPromises = $q.defer();
            configurationService.getConfigurations(['bahmniConfiguration','encounterConfig']).then(function (configurations) {
                $rootScope.bahmniConfiguration = configurations.bahmniConfiguration;
                $rootScope.encounterConfig = configurations.encounterConfig;
                configurationsPromises.resolve();
            });
            return configurationsPromises.promise;
        };

        authenticator.authenticateUser().then(function () {
            getConfigs().then(function () {
                var appLoadOptions = {'app': false, 'extension' : true};
                appService.initApp(getAppContext('patientsearch'), appLoadOptions).then(function (result) {
                    initializationPromise.resolve();
                });
            });
        });

        return initializationPromise.promise;
    }]
);    