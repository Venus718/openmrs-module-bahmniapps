'use strict';


angular.module('bahmni.common.domain')
    .controller('OrderSetController', ['$scope', '$state', 'spinner', '$http', '$q', 'orderSetService', 'messagingService', 'orderTypeService',
        function ($scope, $state, spinner, $http, $q, orderSetService, messagingService, orderTypeService) {
            $scope.operators = ['ALL', 'ANY', 'ONE'];
            $scope.conceptNameInvalid = false;
            $scope.addOrderSetMembers = function (event) {
                event.preventDefault();
                $scope.orderSet.orderSetMembers.push(buildOrderSetMember());
            };

            $scope.removeOrderSetMember = function (index) {
                if ($scope.orderSet.orderSetMembers[index].orderSetMemberId) {
                    $scope.orderSet.orderSetMembers[index].voided = true;
                } else {
                    $scope.orderSet.orderSetMembers.splice(index, 1);
                }
            };

            $scope.getConcepts = function (request) {
                return $http.get(Bahmni.Common.Constants.conceptUrl, {
                    params: {
                        q: request.term,
                        v: "custom:(uuid,name:(uuid,name),conceptClass:(uuid,name,display))"
                    }
                }).then(function (result) {
                    return result.data.results;
                });
            };

            $scope.getNumber = function (num) {
                var sequence = [];
                for (var i = 1; i <= num; i++) {
                    sequence.push(i);
                }
                return sequence;
            };

            $scope.getDataResults = function (selectedOrderType) {
                return function (results) {
                    var orderType = $scope.orderTypes.filter(function (orderObj) {
                        return orderObj.uuid === selectedOrderType.uuid;
                    })[0];
                    var orderTypeNames = _.map(orderType.conceptClasses, 'name');
                    return results.filter(function (concept) {
                        return _.includes(orderTypeNames, concept.conceptClass.name);
                    }).map(function (concept) {
                        return {'concept': {uuid: concept.uuid, name: concept.name.name}, 'value': concept.name.name}
                    });
                }
            };

            $scope.onSelect = function (orderSetMember) {
                return function (selectedConcept) {
                    orderSetMember.concept.name = selectedConcept.concept.name;
                    orderSetMember.concept.uuid = selectedConcept.concept.uuid;
                };
            };

            $scope.toggleVoidOrderSetMember = function (orderSetMember) {
                orderSetMember.voided = !orderSetMember.voided;
            };

            $scope.clearConceptName = function (orderSetMember, orderSet) {
                orderSetMember.concept = {};
            };

            $scope.rearrangeSequence = function (orderSet, orderSetMember, oldValue, newValue, startIndex) {
                var numberOfOrderSetMembers = orderSet.orderSetMembers.length;
                var startIndex;
                for (var i = 0; i < numberOfOrderSetMembers; i++) {
                    if (orderSet.orderSetMembers[i] == orderSetMember) {
                        startIndex = i + 1;
                    }
                }
                var endIndex = orderSetMember.sortWeight;
                if (startIndex > endIndex) {
                    orderSet.orderSetMembers.splice(endIndex - 1, 0, orderSetMember);
                    for (var i = endIndex; i < startIndex; i++) {
                        orderSet.orderSetMembers[i].sortWeight += 1;
                    }
                    orderSet.orderSetMembers.splice(startIndex, 1);
                }
                else {

                    orderSet.orderSetMembers.splice(endIndex, 0, orderSetMember);
                    for (var i = startIndex; i < endIndex; i++) {
                        orderSet.orderSetMembers[i].sortWeight -= 1;
                    }
                    orderSet.orderSetMembers.splice(startIndex - 1, 1)
                }
            };

            $scope.save = function () {
                if (validationSuccess()) {
                    spinner.forPromise(orderSetService.saveOrderSet($scope.orderSet).then(function (response) {
                        $state.params.orderSetUuid = response.data.uuid;
                        return $state.transitionTo($state.current, $state.params, {
                            reload: true,
                            inherit: false,
                            notify: true
                        }).then(function () {
                            messagingService.showMessage('info', 'Saved');
                        });
                    }));
                }
            };

            var validationSuccess = function () {
                if (!$scope.orderSet.orderSetMembers || countActiveOrderSetMembers($scope.orderSet.orderSetMembers) < 2) {
                    messagingService.showMessage('error', 'Please enter a minimum of 2 order set to proceed with save.');
                    return false;
                }

                return true;
            };

            var countActiveOrderSetMembers = function (orderSetMembers) {
                var countActive = 0;
                orderSetMembers.forEach(function (orderSetMember) {
                    if (!orderSetMember.voided) {
                        countActive++;
                    }
                });
                return countActive;
            };

            var filterOutVoidedOrderSetMembers = function (orderSetResult) {
                orderSetResult.orderSetMembers = _.filter(orderSetResult.orderSetMembers, function (orderSetMemberObj) {
                    return !orderSetMemberObj.voided;
                });
                return orderSetResult;
            };

            var buildOrderSetMember = function () {
                return {
                    orderType: {uuid: $scope.orderTypes[0].uuid}
                };
            };

            var init = function () {
                var init = $q.all([
                    orderTypeService.loadAll(),
                    orderSetService.getDrugConfig()
                ]).then(function (results) {
                    $scope.orderTypes = results[0];
                    $scope.treatmentConfig = results[1];
                    if ($state.params.orderSetUuid !== "new") {
                        spinner.forPromise(orderSetService.getOrderSet($state.params.orderSetUuid).then(function (response) {
                            $scope.orderSet = filterOutVoidedOrderSetMembers(Bahmni.Common.OrderSet.create(response.data));
                        }));
                    }
                    else {
                        $scope.orderSet = Bahmni.Common.OrderSet.create();
                        $scope.orderSet.operator = $scope.operators[0];
                        $scope.orderSet.orderSetMembers.push(
                            Bahmni.Common.OrderSet.createOrderSetMember(buildOrderSetMember()),
                            Bahmni.Common.OrderSet.createOrderSetMember(buildOrderSetMember())
                        );
                    }
                });
                spinner.forPromise(init);
            };
            init();
        }]);
