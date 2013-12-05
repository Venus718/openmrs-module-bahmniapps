'use strict';

angular.module('opd.consultation').factory('initialization',
    ['$rootScope', '$route', 'configurationService', 'visitService', 'patientService', 'patientMapper', 'authenticator', 'appService',
    function ($rootScope, $route, configurationService, visitService, patientService, patientMapper, authenticator, appService) {
        var getConsultationConfigs = function() {
            var configNames = ['encounterConfig', 'patientConfig', 'dosageFrequencyConfig','dosageInstructionConfig', 'consultationNoteConfig'];
            return configurationService.getConfigurations(configNames).then(function (configurations) {
                $rootScope.encounterConfig = angular.extend(new EncounterConfig(), configurations.encounterConfig);
                $rootScope.patientConfig = configurations.patientConfig;
                $rootScope.dosageFrequencyConfig = configurations.dosageFrequencyConfig;
                $rootScope.dosageInstructionConfig = configurations.dosageInstructionConfig;
                $rootScope.consultationNoteConcept = configurations.consultationNoteConfig.results[0];
            });
        };

        var getVisit = function() {
            return visitService.getVisit($route.current.params.visitUuid).success(function (visit) {
                $rootScope.visit = visit;
                $rootScope.consultation = new Bahmni.Opd.ConsultationMapper($rootScope.encounterConfig,
                    $rootScope.dosageFrequencyConfig, $rootScope.dosageInstructionConfig, $rootScope.consultationNoteConcept).map(visit);
                $rootScope.disposition = new Bahmni.Opd.DispositionMapper($rootScope.encounterConfig).map(visit);
                $rootScope.disposition.currentActionIndex = 0; // this will be used in case we have multiple encounters with dispositions
            });
        };

        var getPatient = function(visitResponse) {
            var visit = visitResponse.data;
            return patientService.getPatient(visit.patient.uuid).success(function (openMRSPatient) {
                $rootScope.patient = patientMapper.map(openMRSPatient);
            });
        };

        var getVisitSummary = function() {
            return visitService.getVisitSummary($route.current.params.visitUuid).success(function (encounterTransactions) {
                $rootScope.visitSummary = Bahmni.Opd.Consultation.VisitSummary.create(encounterTransactions);
            });
        };

        var initApp = function() {
            return appService.initApp('clinical', {'extension' : true});
        };

        return authenticator.authenticateUser().then(initApp).then(getConsultationConfigs)
                            .then(getVisit).then(getPatient).then(getVisitSummary);
    }]
);




