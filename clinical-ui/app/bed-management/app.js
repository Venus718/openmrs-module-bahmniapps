'use strict';

angular.module('bedManagement', ['authentication', 'bahmni.common.appFramework', 'httpErrorInterceptor',
    'bahmni.bedManagement', 'bahmni.common.patient', 'bahmni.common.domain', 'bahmni.common.conceptSet', 'ngRoute', 'bahmni.common.uiHelper'])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider.when('/patient/:patientUuid/encounter/:encounterUuid', {templateUrl:'views/bedManagement.html', controller:'BedManagementController', resolve:{initialization:'initialization'}});
    $routeProvider.when('/patient/:patientUuid', {templateUrl:'views/bedManagement.html', controller:'BedManagementController', resolve:{initialization:'initialization'}});
    $routeProvider.otherwise({templateUrl:'../common/ui-helper/error.html'});
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = true;
}]).run(['backlinkService', function (backlinkService) {
        backlinkService.addUrl("ADT", "/clinical/adt/#/patient/search");
}]);
