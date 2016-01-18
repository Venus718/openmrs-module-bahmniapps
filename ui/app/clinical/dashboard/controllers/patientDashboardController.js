'use strict';

angular.module('bahmni.clinical')
    .controller('PatientDashboardController', ['$rootScope', '$scope', 'clinicalAppConfigService', 'clinicalDashboardConfig', 'printer',
        '$state', 'spinner', 'visitSummary', 'appService', '$stateParams', 'diseaseTemplateService',
        function ($rootScope, $scope, clinicalAppConfigService, clinicalDashboardConfig, printer,
                  $state, spinner, visitSummary, appService, $stateParams, diseaseTemplateService) {

            $scope.activeVisit = $scope.visitHistory.activeVisit;
            $scope.activeVisitData = {};
            $scope.obsIgnoreList = clinicalAppConfigService.getObsIgnoreList();
            $scope.clinicalDashboardConfig = clinicalDashboardConfig;
            $scope.visitSummary = visitSummary;
            var programConfig = appService.getAppDescriptor().getConfigValue("program") || {};

            $scope.stateChange = function () {
                return $state.current.name === 'patient.dashboard.show'
            };

            $scope.$on("event:switchDashboard", function (event, dashboard) {
                $scope.init(dashboard);
            });

            $scope.$on("event:printDashboard", function (event) {
                printer.printFromScope("dashboard/views/dashboardPrint.html", $scope);
            });

            $scope.init = function (dashboard) {
                dashboard.startDate = null;
                dashboard.endDate = null;
                if (programConfig.showDashBoardWithinDateRange) {
                    dashboard.startDate = $stateParams.dateEnrolled;
                    dashboard.endDate = $stateParams.dateCompleted;
                }
                clinicalDashboardConfig.switchTab(dashboard);
                $scope.dashboard = Bahmni.Common.DisplayControl.Dashboard.create(dashboard || {});
                spinner.forPromise(diseaseTemplateService.getLatestDiseaseTemplates(
                    $stateParams.patientUuid, clinicalDashboardConfig.getDiseaseTemplateSections(), dashboard.startDate, dashboard.endDate).then(function (diseaseTemplate) {
                        $scope.diseaseTemplates = diseaseTemplate;
                        $scope.sectionGroups = $scope.dashboard.getSections($scope.diseaseTemplates);
                    }));
                $scope.currentDashboardTemplateUrl = $state.current.views['dashboard-content'] ?
                    $state.current.views['dashboard-content'].templateUrl : $state.current.views['dashboard-content'];
            };

            $scope.init(clinicalDashboardConfig.currentTab);
        }]);
