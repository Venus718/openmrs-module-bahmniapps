'use strict';

angular.module('registration.createPatient', ['resources.patientService', 'resources.preferences'])
    .controller('CreateNewPatientController', ['$scope', 'patientService', '$location', 'Preferences',
        function ($scope, patientService, $location, preferences) {

            (function () {
                $scope.patient = patientService.getPatient();
                $scope.centers = [
                    {name: 'GAN'},
                    {name: 'SEM'},
                    {name: 'SHI'},
                    {name: 'BAH'}
                ];
                $scope.patient.centerID = $scope.centers.filter(function (center) {
                    return center.name === preferences.centerID
                })[0];
                $scope.hasOldIdentifier = preferences.hasOldIdentifier;
            })();

            $scope.clearPatientIdentifier = function () {
                $scope.patientIdentifier = "";
            };

            var setPreferences = function () {
                preferences.centerID = $scope.patient.centerID.name;
                preferences.hasOldIdentifier = $scope.hasOldIdentifier;
            };

            $scope.create = function () {
                setPreferences();
                patientService.create($scope.patient).success(function (data) {
                    $scope.patient.identifier = data.identifier;
                    $scope.patient.uuid = data.uuid;
                    $scope.patient.name = data.name;
                    patientService.rememberPatient($scope.patient);
                    $location.path("/visitinformation");
                });
            };


            $scope.setCasteAsLastName = function() {
                $scope.patient.caste = "";
                if($scope.sameAsLastName) {
                    $scope.patient.caste = $scope.patient.familyName;
                }
            }

            $scope.$watch('patient.familyName', function() {
                if($scope.sameAsLastName) {
                    $scope.patient.caste = $scope.patient.familyName;
                }
            })
        }])

    .directive('nonBlank', function ($parse) {
        return function ($scope, element, attrs) {
            var addNonBlankAttrs = function(){
                element.attr({'required': 'required', "pattern": '^.*[^\\s]+.*'});
            }

            var removeNonBlankAttrs = function() {
                element.removeAttr('required').removeAttr('pattern');
            };

            if(!attrs.nonBlank) return addNonBlankAttrs(element);

            $scope.$watch(attrs.nonBlank, function(value){
                return value ? addNonBlankAttrs() : removeNonBlankAttrs();
            });
        }
    })

    .directive('datepicker', function ($parse) {
        return function ($scope, element, attrs) {
            var ngModel = $parse(attrs.ngModel);
            $(function () {
                var today = new Date();
                element.datepicker({
                    changeYear: true,
                    changeMonth: true,
                    maxDate: today,
                    minDate: "-120y",
                    yearRange: 'c-120:c',
                    dateFormat: 'dd-mm-yy',
                    onSelect: function (dateText) {
                        $scope.$apply(function (scope) {
                            ngModel.assign(scope, dateText);
                            $scope.$eval(attrs.ngChange);
                        });
                    }
                });
            });
        }
    });