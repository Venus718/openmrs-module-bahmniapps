'use strict';
angular.module('bahmni.clinical')
    .factory('DrugService', ['$http', function ($http) {

        var search = function (drugName) {
            return $http.get(Bahmni.Common.Constants.drugUrl,
                {
                    method: "GET",
                    params: {
                        v: 'custom:(uuid,name,doseStrength,units,dosageForm,concept:(uuid,name,names:(name)))',
                        q: drugName,
                        s: "ordered"
                    },
                    withCredentials: true
                }
            ).then(function (response) {
                    return response.data.results;
                });
        };

        var getSetMembersOfConcept = function (conceptSetFullySpecifiedName,searchTerm) {
            return $http.get(Bahmni.Common.Constants.drugUrl,
                {
                    method: "GET",
                    params: {
                        v: 'custom:(uuid,name,doseStrength,units,dosageForm,concept:(uuid,name,names:(name)))',
                        q: conceptSetFullySpecifiedName,
                        s: "byConceptSet",
                        searchTerm: searchTerm
                    },
                    withCredentials: true
                }
            ).then(function (response) {
                    return response.data.results;
                });
        };

        var getRegimen = function (patientUuid, drugs, startDate, endDate) {
            var params = {
                patientUuid: patientUuid,
                drugs: drugs,
                startDate: Bahmni.Common.Util.DateUtil.parseLongDateToServerFormat(startDate),
                endDate: Bahmni.Common.Util.DateUtil.parseLongDateToServerFormat(endDate)
            };

            return $http.get(Bahmni.Common.Constants.bahmniRESTBaseURL + "/drugOGram/regimen", {
                params: params,
                withCredentials: true
            });
        };

        return {
            search: search,
            getRegimen: getRegimen,
            getSetMembersOfConcept: getSetMembersOfConcept
        };
    }]);