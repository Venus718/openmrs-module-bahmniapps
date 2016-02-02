angular.module('bahmni.common.displaycontrol.programs')
    .directive('programs', ['programService',
        function (programService) {
            'use strict';
            var controller = function ($scope) {
                programService.getPatientPrograms($scope.patient.uuid, true).then(function (patientPrograms) {
                    $scope.activePrograms = patientPrograms.activePrograms;
                    $scope.pastPrograms = patientPrograms.endedPrograms;
                });
                $scope.hasPatientAnyActivePrograms = function(){
                    return !_.isEmpty($scope.activePrograms);
                };
                $scope.hasPatientAnyPastPrograms = function(){
                    return !_.isEmpty($scope.pastPrograms);
                };
                $scope.hasPatientAnyPrograms = function(){
                    return $scope.hasPatientAnyPastPrograms() || $scope.hasPatientAnyActivePrograms();
                };
                $scope.showProgramStateInTimeline = function () {
                    return programService.getProgramStateConfig();
                };
                $scope.hasStates = function (program) {
                    return !_.isEmpty(program.states);
                };
                $scope.getAttributeValue = function (attribute) {
                    if(isDateFormat(attribute.attributeType.format)){
                        return Bahmni.Common.Util.DateUtil.formatDateWithoutTime(attribute.value);
                    }
                    else if(isCodedConceptFormat(attribute.attributeType.format)) {
                        var mrsAnswer = attribute.value;
                        var displayName = attribute.display;
                        if (mrsAnswer.names && mrsAnswer.names.length == 2) {
                            if (mrsAnswer.name.conceptNameType == 'FULLY_SPECIFIED') {
                                if (mrsAnswer.names[0].display == displayName)
                                    displayName = mrsAnswer.names[1].display;
                                else
                                    displayName = mrsAnswer.names[0].display;
                            }
                        }
                        return displayName;
                    }
                    else
                        return attribute.value;
                };
                var isDateFormat = function(format){
                    return format == "org.openmrs.customdatatype.datatype.DateDatatype";
                };
                var isCodedConceptFormat = function(format){
                    return format == "org.bahmni.module.bahmnicore.customdatatype.datatype.CodedConceptDatatype";
                };
            };
            return {
                restrict: 'E',
                controller: controller,
                templateUrl: "../common/displaycontrols/programs/views/programs.html",
                scope: {
                    patient: "="
                }
            }
        }]);
