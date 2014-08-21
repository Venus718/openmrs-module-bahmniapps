'use strict';

angular.module('bahmni.clinical')
    .controller('ConsultationController', ['$scope', '$rootScope', function ($scope, $rootScope) {
        var geEditedDiagnosesFromPastEncounters = function () {
            var editedDiagnosesFromPastEncounters = [];
            $rootScope.consultation.pastDiagnoses.forEach(function (pastDiagnosis) {
                if (pastDiagnosis.isDirty && pastDiagnosis.encounterUuid !== $rootScope.consultation.encounterUuid) {
                    editedDiagnosesFromPastEncounters.push(pastDiagnosis);
                }
            });
            return editedDiagnosesFromPastEncounters;
        };
        $scope.editedDiagnosesFromPastEncounters = geEditedDiagnosesFromPastEncounters();

        $scope.onNoteChanged = function () {
//        TODO: Mihir, D3 : Hacky fix to update the datetime to current datetime on the server side. Ideal would be void the previous observation and create a new one.
            $scope.consultation.consultationNote.observationDateTime = null;
        };

        var groupedObservations = function(){
            var groupedObservationsArray = [];
            $scope.consultation.observations.forEach(function(observation){
                var temp =[];
                temp[0]=observation;
                var observationsByGroup={
                    "conceptSetName": observation.concept.name,
                    "groupMembers": new Bahmni.ConceptSet.ObservationMapper().getObservationsForView(temp)
                };
                if(observationsByGroup.groupMembers.length){
                    groupedObservationsArray.push(observationsByGroup);
                }
            });
            return groupedObservationsArray;
        };
        $scope.groupedObservations = groupedObservations();
        $scope.disposition = $rootScope.consultation.disposition;
    }]);

