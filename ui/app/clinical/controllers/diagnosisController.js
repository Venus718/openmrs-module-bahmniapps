'use strict';

angular.module('bahmni.clinical')
    .controller('DiagnosisController', ['$scope', '$rootScope', '$stateParams', 'diagnosisService', 'contextChangeHandler',
        function ($scope, $rootScope, $stateParams, diagnosisService, contextChangeHandler) {

            $scope.placeholder = "Add Diagnosis";
            $scope.hasAnswers = false;

            // TODO : Mujir/Sushmita - remove this hard coding. 'Ruled Out' would not be configured as certainty in OpenMRS.
            $scope.orderOptions = ['PRIMARY', 'SECONDARY'];
            $scope.certaintyOptions = ['CONFIRMED', 'PRESUMED'];
            $scope.diagnosisStatuses = ['RULED OUT'];

            $scope.getDiagnosis = function (searchTerm) {
                return diagnosisService.getAllFor(searchTerm);
            };

            var _canAdd = function (diagnosis) {
                var canAdd = true;
                $scope.newlyAddedDiagnoses.forEach(function (observation) {
                    if (observation.conceptName === diagnosis.conceptName) {
                        canAdd = false;
                    }
                });
                return canAdd;
            };

            // TODO : edited scenario is not valid anymore : need to remove : shruthi
            var addDiagnosis = function (concept, index) {
                var diagnosisBeingEdited = $scope.newlyAddedDiagnoses[index];
                if (diagnosisBeingEdited) {
                    var diagnosis = new Bahmni.Clinical.Diagnosis(concept, diagnosisBeingEdited.order,
                        diagnosisBeingEdited.certainty, diagnosisBeingEdited.existingObs);
                }
                else {
                    var diagnosis = new Bahmni.Clinical.Diagnosis(concept);
                }
                if (_canAdd(diagnosis)) {
                    $scope.newlyAddedDiagnoses.splice(index, 1, diagnosis);
                }
            };

            var addPlaceHolderDiagnosis = function () {
                var diagnosis = new Bahmni.Clinical.Diagnosis('');
                $scope.newlyAddedDiagnoses.push(diagnosis);
            };

            var init = function () {
                $scope.newlyAddedDiagnoses = $rootScope.consultation.newlyAddedDiagnoses;
                addPlaceHolderDiagnosis();
                contextChangeHandler.add(allowContextChange);
            };

            var allowContextChange = function () {
                var invalidnewlyAddedDiagnoses = $scope.newlyAddedDiagnoses.filter(function (diagnosis) {
                    return !$scope.isValid(diagnosis);
                });
                var invalidPastDiagnoses = $rootScope.consultation.pastDiagnoses.filter(function (diagnosis) {
                    return !$scope.isValid(diagnosis);
                });
                return invalidnewlyAddedDiagnoses.length === 0 || invalidPastDiagnoses.length === 0;
            };

            $scope.cleanOutDiagnosisList = function (data) {
                var mappedResponse = data.map(
                    function (concept) {
                        if (concept.conceptName === concept.matchedName) {
                            return {
                                'value': concept.matchedName,
                                'concept': {
                                    'name': concept.conceptName,
                                    'uuid': concept.conceptUuid
                                },
                                lookup: {
                                    'name': concept.conceptName,
                                    'uuid': concept.conceptUuid
                                }
                            }
                        }
                        return {
                            'value': concept.matchedName + "=>" + concept.conceptName,
                            'concept': {
                                'name': concept.conceptName,
                                'uuid': concept.conceptUuid
                            },
                            lookup: {
                                'name': concept.conceptName,
                                'uuid': concept.conceptUuid
                            }
                        }
                    }
                );
                return filterOutSelectedDiagnoses(mappedResponse);
            };

            var filterOutSelectedDiagnoses = function (allDiagnoses) {
                return allDiagnoses.filter(function (diagnosis) {
                    return !alreadyAddedToDiagnosis(diagnosis);
                });
            };

            var alreadyAddedToDiagnosis = function (diagnosis) {
                var isPresent = false;
                $scope.newlyAddedDiagnoses.forEach(function (d) {
                    if (d.codedAnswer.uuid == diagnosis.concept.uuid) {
                        isPresent = true;
                    }
                });
                return isPresent;
            };

            $scope.selectItem = function (index, selectedConcept) {
                addDiagnosis(selectedConcept, index);
            };
            
            $scope.removeObservation = function (index) {
                if (index >= 0) {
                    $scope.newlyAddedDiagnoses.splice(index, 1);
                }
            };

            $scope.$on('$destroy', function () {
                $rootScope.consultation.newlyAddedDiagnoses = $scope.newlyAddedDiagnoses.filter(function (diagnosis) {
                    return !diagnosis.isEmpty();
                });
            });

            $scope.processDiagnoses = function (data) {
                data.map(
                    function (concept) {
                        if (concept.conceptName === concept.matchedName) {
                            return {
                                'value': concept.matchedName,
                                'concept': concept
                            }
                        }
                        return {
                            'value': concept.matchedName + "=>" + concept.conceptName,
                            'concept': concept
                        }
                    }
                );
            };

            $scope.clearEmptyRows = function (index) {
                var iter;
                for (iter = 0; iter < $scope.newlyAddedDiagnoses.length; iter++) {
                    if ($scope.newlyAddedDiagnoses[iter].isEmpty() && iter !== index) {
                        $scope.newlyAddedDiagnoses.splice(iter, 1)
                    }
                }
                var emptyRows = $scope.newlyAddedDiagnoses.filter(function (diagnosis) {
                        return diagnosis.isEmpty();
                    }
                );
                if (emptyRows.length == 0) {
                    addPlaceHolderDiagnosis();
                }
            };

            $scope.isValid = function (diagnosis) {
                return diagnosis.isValidAnswer() && diagnosis.isValidOrder() && diagnosis.isValidCertainty();
            };

            init();

        }]);
