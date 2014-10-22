'use strict';

angular.module('opd.patientDashboard', [])
    .controller('PatientDashboardController', ['$scope', '$rootScope', '$location', '$stateParams', 'patientVisitHistoryService',
        'urlHelper', 'encounterService', 'clinicalConfigService', 'diseaseTemplates',
        function ($scope, $rootScope, $location, $stateParams, patientVisitHistoryService, 
                  urlHelper, encounterService, clinicalConfigService, diseaseTemplates) {
        $scope.patientUuid = $stateParams.patientUuid;
        $scope.activeVisitData = {};
        $scope.diseaseTemplates= diseaseTemplates;
        $scope.obsIgnoreList = clinicalConfigService.getObsIgnoreList();
        $scope.patientSummary = {};

        $scope.patientDashboardSections = _.map(clinicalConfigService.getAllPatientDashboardSections(), Bahmni.Clinical.PatientDashboardSection.create);

        Bahmni.Clinical.DiseaseTemplateSectionHelper.populateDiseaseTemplateSections($scope.patientDashboardSections, $scope.diseaseTemplates);

        $scope.filterOdd = function(index) {
          return function() {
            return index++ % 2 == 0;
          };
        };

        $scope.filterEven = function(index) {
          return function() {
            return index++ % 2 == 1;
          };
        };

        var getEncountersForVisit = function (visitUuid) {
            encounterService.search(visitUuid).then(function (encounterTransactionsResponse) {
                $scope.visit = Bahmni.Clinical.Visit.create(encounterTransactionsResponse.data, $scope.consultationNoteConcept, $scope.labOrderNotesConcept, $scope.encounterConfig, $rootScope.allTestsAndPanelsConcept, $scope.obsIgnoreList, visitUuid, conceptSetUiConfigService.getConfig());
            });
        };

        var clearPatientSummary = function () {
            $scope.patientSummary = undefined;
        };

        $scope.showVisitSummary = function (visit) {
            clearPatientSummary();
            $scope.selectedVisit = visit;
            getEncountersForVisit($scope.selectedVisit.uuid);
        };

        $scope.getDiseaseTemplateSection = function(diseaseName){
            return _.find($scope.diseaseTemplates, function(diseaseTemplate){
                return diseaseTemplate.name === diseaseName;
            });
        };

    }]);