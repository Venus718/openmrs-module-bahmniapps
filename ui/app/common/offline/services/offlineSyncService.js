'use strict';

angular.module('bahmni.common.offline')
    .service('offlineSyncService', ['eventLogService', 'offlinePatientDao', '$interval', '$q',
        function (eventLogService, offlinePatientDao, $interval, $q) {
            var scheduler;
            var sync = function () {
                offlinePatientDao.getMarker().then(function (marker) {
                    if (marker == undefined) {
                        //todo: Hemanth|Santhosh get catchment number from login location
                        marker = {catchmentNumber: 202020}
                    }
                    syncForMarker(marker);

                });
            };

            var syncForMarker = function (marker) {
                eventLogService.getEventsFor(marker.catchmentNumber, marker.lastReadUuid).then(function (response) {
                    if (response.data == undefined || response.data.length == 0) {
                        scheduleSync();
                        return;
                    }
                    readEvent(response.data, 0).then(sync);
                });
            };

            var scheduleSync = function () {
                scheduler = $interval(function () {
                    $interval.cancel(scheduler);
                    sync();
                }, 300000, false);
            };

            var readEvent = function (events, index) {
                if (events.length == index)
                    return;

                var event = events[index];
                return eventLogService.getDataForUrl(event.object).then(function (response) {
                    return saveData(event, response).then(updateMarker(event).then(function () {
                        return readEvent(events, ++index);
                    }));
                });
            };

            var saveData = function (event, response) {
                var deferrable = $q.defer();
                switch (event.category) {
                    case 'patient':
                        offlinePatientDao.createPatient({patient: response.data});
                        deferrable.resolve();
                        break;
                    case 'Encounter':
                        deferrable.resolve();
                        break;
                }
                deferrable.resolve();
                return deferrable.promise;
            };

            var updateMarker = function (event) {
                return offlinePatientDao.insertMarker(event.uuid, 202020);
            };

            return {
                sync: sync
            }
        }
    ]);