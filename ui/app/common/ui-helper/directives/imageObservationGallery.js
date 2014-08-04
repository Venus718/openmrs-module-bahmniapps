angular.module('bahmni.common.uiHelper')
    .directive('imageObservationGallery', ['ngDialog', function (ngDialog) {

        var controller = function ($scope) {
            $scope.photos = [];
            $scope.imageIndex = 0;

            this.image = function (record) {
                return {
                    src: Bahmni.Common.Constants.documentsPath + '/' + record.imageObservation.value,
                    title: record.concept.name,
                    desc: record.imageObservation.comment,
                    date: record.imageObservation.observationDateTime,
                    uuid: record.imageObservation.uuid
                };
            };

            this.addImageObservation = function (record) {
                $scope.photos.push(this.image(record));
            };

            this.addImage = function (image) {
                $scope.photos.push(image);
            };

            this.setIndex = function (uuid) {
                $scope.imageIndex = _.findIndex($scope.photos, function (photo) {
                    return uuid === photo.uuid;
                })
            };

            this.open = function () {
                ngDialog.open({
                    template: '../common/ui-helper/views/imageObservationGallery.html',
                    className: undefined,
                    scope: $scope
                })
            };
        };

        return {
            controller: controller,
            scope: {
                imageIndex: "=?",
                patient: "="
            }
        }
    }])
    .directive('galleryItem', function () {
        var link = function ($scope, element, attrs, imageGalleryController) {
            var image = {
                src: $scope.image.encodedValue,
                title: $scope.image.concept ? $scope.image.concept.name : "",
                date: $scope.image.obsDatetime,
                uuid: $scope.image.obsUuid
            };
            imageGalleryController.addImage(image);
            element.click(function (e) {
                e.stopPropagation();
                imageGalleryController.setIndex($scope.image.obsUuid);
                imageGalleryController.open();
            });
        };
        return {
            link: link,
            image: '=',
            require: '^imageObservationGallery'
        };
    })
    .directive('imageObservation', function () {
        
        var link = function ($scope, element, attrs, imageGalleryController) {
            var mapImageObservation = function (observation) {
                return {concept: observation.concept, imageObservation: observation };
            };
            var imageObservation = mapImageObservation($scope.observation);

            imageGalleryController.addImageObservation(imageObservation);
            element.click(function (e) {
                e.stopPropagation();
                imageGalleryController.setIndex(imageObservation.imageObservation.uuid);
                imageGalleryController.open();
            });
        };

        return {
            link: link,
            observation: '=',
            require: '^imageObservationGallery'
        };
    })
    .directive('imageObservationObservation', function () {
        var link = function (scope, element, attrs, imageGalleryController) {
            imageGalleryController.addImageObservation(scope.observation);
            element.click(function (e) {
                e.stopPropagation();
                imageGalleryController.setIndex(scope.observation.uuid);
                imageGalleryController.open();
            });
        };
        return {
            link: link,
            scope: {
                observation: '='
            },
            require: '^imageObservationGallery'
        };
    })
    .directive("imageObservationList", function () {
        var link = function (scope, elem, attrs, imageGalleryController) {
            $(elem).click(function () {
                angular.forEach(scope.list, function (record) {
                    imageGalleryController.addImageObservation(record);
                });
                imageGalleryController.open();
            });
        };
        return {
            link: link,
            scope: {
                list: "="
            },
            require: '^imageObservationGallery'
        }
    })
    .directive("lazyImageList", ['$rootScope', 'encounterService', function ($rootScope, encounterService) {
        var link = function (scope, elem, attrs, imageGalleryController) {
            $(elem).click(function () {
                var encounterTypeUuid = $rootScope.encounterConfig.getPatientDocumentEncounterTypeUuid();
                var promise = encounterService.getEncountersForEncounterType($rootScope.patient.uuid, encounterTypeUuid);
                promise.then(function (response) {
                    var records = new Bahmni.Clinical.PatientFileObservationsMapper().map(response.data.results);
                    angular.forEach(records, function (record) {
                        imageGalleryController.addImageObservation(record);
                    });
                    if (scope.current != null) {
                        imageGalleryController.setIndex(scope.currentObservation.imageObservation.uuid);
                    }
                    imageGalleryController.open();
                });
            });
        };
        return {
            link: link,
            scope: {
                currentObservation: "=?index"
            },
            require: '^imageObservationGallery'
        }
    }]);