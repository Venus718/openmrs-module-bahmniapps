'use strict';

angular.module('bahmni.clinical').factory('patientInitialization',
    ['$rootScope', '$q', 'patientService', 'spinner', 'configurations',
        function ($rootScope, $q, patientService, spinner, configurations) {

            return function (patientUuid) {
                var getPatient = function () {
                    var patientMapper = new Bahmni.PatientMapper(configurations.patientConfig());
                    return patientService.getPatient(patientUuid).then(function (openMRSPatientResponse) {
                        var patient = patientMapper.map(openMRSPatientResponse.data);
                        return {"patient": patient};
                    })
                };

                return getPatient();
            }
        }]
);
