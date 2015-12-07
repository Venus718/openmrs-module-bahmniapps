'use strict';

angular.module('bahmni.registration')
    .factory('patientService', ['$http', '$rootScope','$bahmniCookieStore','$q','patientServiceOffline', function ($http, $rootScope, $bahmniCookieStore, $q, patientServiceOffline) {
        var openmrsUrl = Bahmni.Registration.Constants.openmrsUrl;
        var baseOpenMRSRESTURL = Bahmni.Registration.Constants.baseOpenMRSRESTURL;
        var search = function (query, identifier, addressFieldName, addressFieldValue, customAttributeValue, offset, customAttributeFields) {

            var config = {
                params: {
                    q: query,
                    identifier:identifier,
                    s: "byIdOrNameOrVillage",
                    address_field_name: addressFieldName,
                    address_field_value: addressFieldValue,
                    custom_attribute: customAttributeValue,
                    startIndex: offset || 0,
                    patientAttributes: customAttributeFields
                },
                withCredentials: true
            };
            if($rootScope.offline){
                return patientServiceOffline.search(config.params);
            }
            var url = Bahmni.Common.Constants.bahmniSearchUrl + "/patient";
            var defer = $q.defer();
            $http.get(url, config).success(function(result) {
                defer.resolve(result);
            });
            return defer.promise;
        };

        var searchByIdentifier = function(identifier){
            return $http.get(Bahmni.Common.Constants.bahmniSearchUrl + "/patient", {
                method: "GET",
                params: {identifier: identifier},
                withCredentials: true
            });
        };

        var get = function (uuid) {
            if($rootScope.offline) {
                return patientServiceOffline.get(uuid);
            }
            var url = openmrsUrl + "/ws/rest/v1/patientprofile/" + uuid;
            var config = {
                method: "GET",
                params: {v: "full"},
                withCredentials: true
            };

            var defer = $q.defer();
            $http.get(url, config).success(function(result) {
                defer.resolve(result);
            });
            return defer.promise;
        };

        var generateIdentifier = function (patient) {
            var data = {"identifierSourceName": patient.identifierPrefix ? patient.identifierPrefix.prefix : ""};
            var url = openmrsUrl + "/ws/rest/v1/idgen";
            var config = {
                withCredentials: true,
                headers: {"Accept": "text/plain", "Content-Type": "application/json"}
            };
            return $http.post(url, data, config);
        };

        var getLatestIdentifier = function (sourceName) {
            var url = openmrsUrl + "/ws/rest/v1/idgen" + "/latestidentifier";
            var config = {
                method: "GET",
                withCredentials: true,
                params: {"sourceName": sourceName},
                headers: {"Accept": "text/plain", "Content-Type": "application/json"}
            };
            return $http.get(url, config);
        };

        var setLatestIdentifier = function (sourceName, identifier) {
            var url = openmrsUrl + "/ws/rest/v1/idgen" + "/latestidentifier";
            var data = {
                sourceName: sourceName,
                identifier: identifier
            };
            return $http.post(url, data);
        };

        var create = function (patient) {
            var data = new Bahmni.Registration.CreatePatientRequestMapper(moment()).mapFromPatient($rootScope.patientConfiguration.personAttributeTypes, patient);
            var url = baseOpenMRSRESTURL + "/patientprofile";
            var config = {
                withCredentials: true,
                headers: {"Accept": "application/json", "Content-Type": "application/json"}
            };
            return $http.post(url, data, config);
        };

        var update = function (patient, openMRSPatient) {
            var data = new Bahmni.Registration.UpdatePatientRequestMapper(moment()).mapFromPatient($rootScope.patientConfiguration.personAttributeTypes, openMRSPatient, patient);
            var url = baseOpenMRSRESTURL + "/patientprofile/" + openMRSPatient.uuid;
            var config = {
                withCredentials: true,
                headers: {"Accept": "application/json", "Content-Type": "application/json"}
            };
            return $http.post(url, data, config);
        };

        var updateImage = function (uuid, image) {
            var url = baseOpenMRSRESTURL + "/personimage/";
            var data = {
                "person": {"uuid": uuid},
                "base64EncodedImage": image
            };
            var config = {
                withCredentials: true,
                headers: {"Accept": "application/json", "Content-Type": "application/json"}
            };
            return $http.post(url, data, config);
        };

        return {
            search: search,
            searchByIdentifier: searchByIdentifier,
            create: create,
            generateIdentifier: generateIdentifier,
            getLatestIdentifier: getLatestIdentifier,
            setLatestIdentifier: setLatestIdentifier,
            update: update,
            get: get,
            updateImage: updateImage
        };
    }]);
