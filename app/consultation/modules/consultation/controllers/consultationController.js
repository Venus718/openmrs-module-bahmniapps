'use strict';

angular.module('opd.consultation.controllers')
    .controller('ConsultationController', ['$scope', '$rootScope', 'consultationService', '$route', '$location', function ($scope, $rootScope, consultationService, $route, $location) {

    $scope.save = function () {
        var encounterData = {};
        encounterData.patientUuid = $scope.patient.uuid;
        encounterData.encounterTypeUuid = $rootScope.encounterConfig.getOpdConsultationEncounterUUID();
//        encounterData.diagnoses = $rootScope.consultation.diagnoses.map(function(diagnosis) {
//            return {
//                diagnosis: "Concept:" + diagnosis.concept.conceptId,
//                order: diagnosis.order,
//                certainty: diagnosis.certainty
//            }
//        });
        encounterData.testOrders = $rootScope.consultation.investigations.map(function (investigation) {
            return { conceptUuid: investigation.uuid, orderTypeUuid: investigation.orderTypeUuid };
        });

      //  encounterData.disposition = $rootScope.disposition.adtToStore;

        consultationService.create(encounterData).success(function(){
            window.location = Bahmni.Opd.Constants.activePatientsListUrl;
        });
      };
}]);
