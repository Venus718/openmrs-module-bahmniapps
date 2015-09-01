'use strict';


angular.module('adt', ['bahmni.common.patient', 'bahmni.common.patientSearch', 'bahmni.common.uiHelper', 'bahmni.common.conceptSet', 'authentication', 'bahmni.common.appFramework',
    'httpErrorInterceptor', 'bahmni.adt', 'bahmni.common.domain', 'bahmni.common.config', 'ui.router', 'bahmni.common.util', 'bahmni.common.routeErrorHandler', 'bahmni.common.i18n',
    'bahmni.common.displaycontrol.dashboard', 'bahmni.common.displaycontrol.observation', 'bahmni.common.displaycontrol.disposition', 'bahmni.common.displaycontrol.admissiondetails',
    'bahmni.common.obs', 'bahmni.common.displaycontrol.patientprofile', 'bahmni.common.displaycontrol.diagnosis', 'RecursionHelper', 'ngSanitize', 'bahmni.common.uiHelper', 'bahmni.common.displaycontrol.navigationlinks', 'pascalprecht.translate', 'ngCookies', 'angularFileUpload']);
angular.module('adt').config(['$stateProvider', '$httpProvider', '$urlRouterProvider', '$bahmniTranslateProvider', function ($stateProvider, $httpProvider, $urlRouterProvider, $bahmniTranslateProvider) {

    $urlRouterProvider.otherwise('/home');
    var homeBackLink = {label: "", url: "../home/", icon: "fa-home",id: "homeBackLink"};
    var adtHomeBackLink = {label: "", url: "#/home", accessKey: 'p', icon: "fa-users",id: "adtHomeBackLink" };

    $stateProvider
        .state('home', {
            url: '/home',
            data: {
                backLinks: [homeBackLink]
            },
            views: {
                'content': {
                    templateUrl: 'views/home.html',
                    controller: function ($scope, appService) {
                        $scope.isBedManagementEnabled = appService.getAppDescriptor().getConfig("isBedManagementEnabled").value;
                    }
                },
                'wards@home': {
                    templateUrl: 'views/wards.html',
                    controller: 'WardsController'
                },
                'additional-header': {
                    templateUrl: 'views/headerAdt.html'
                }
            },
            resolve: {
                initialization: 'initialization'
            }
        })
        .state('patient', {
            url: '/patient/:patientUuid',
            data: {
                backLinks: [homeBackLink, adtHomeBackLink]
            },
            abstract: true,
            views: {
                'header': {
                    templateUrl: 'views/headerAdt.html',
                    controller: function ($scope){
                        $scope.showClinicalDashboardLink = true;
                    }
                },
                'content': {
                    template: '<ui-view/>'
                },
                'additional-header': {
                    templateUrl: '../common/patient/header/views/header.html'
                }
            },

            resolve: {
                patientResolution: function ($stateParams, patientInitialization) {
                    return patientInitialization($stateParams.patientUuid);
                }
            }
        })
        .state('patient.adt', {
            url: '/visit/:visitUuid',
            abstract: true,
            template: '<ui-view/>'
        })
        .state('patient.adt.action', {
            url: '/:action',
            templateUrl: 'views/dashboard.html',
            controller: 'AdtController'
        })
        .state('patient.adt.bedForExistingEncounter', {
            url: '/encounter/:encounterUuid/bed',
            templateUrl: 'views/bedManagement.html',
            controller: 'BedManagementController'
        })
        .state('patient.adt.bedForNewEncounter', {
            url: '/bed',
            templateUrl: 'views/bedManagement.html',
            controller: 'BedManagementController'
        });

    $bahmniTranslateProvider.init('adt');
}]);