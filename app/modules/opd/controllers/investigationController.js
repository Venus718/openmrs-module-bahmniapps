'use strict';

angular.module('opd.investigationController', [])
    .controller('InvestigationController', ['$scope', 'selectedNodeService', function ($scope, selectedNodeService) {

        $scope.tabs = [
            {name: 'Lab', template: 'LabTreeSelect'},
            {name: 'Radiology', template: 'RadiologyTreeSelect'},
            {name: 'Endoscopy', template: 'EndoscopyTreeSelect'},
            {name: 'Others', template: 'OthersTreeSelect'},
        ]

        $scope.activateTab = function(tab){
            $scope.activeTab && ($scope.activeTab.klass="");
            $scope.activeTab = tab;
            $scope.activeTab.klass="active";
        }

        $scope.selectedNodes = selectedNodeService.getAllNodes();

        $scope.activateTab($scope.tabs[0]);
    }]);
