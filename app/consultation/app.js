'use strict';

angular.module('consultation', ['opd.consultation', 'bahmni.common.infrastructure'])
angular.module('consultation').config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patient/:patientUuid/', {templateUrl: 'modules/consultation/views/consultation.html', controller: 'ConsultationController', resolve: {initialization: 'initialization'}});
        $routeProvider.when('/patient/:patientUuid/diagnosis', {templateUrl: 'modules/consultation/views/addObservation.html', controller: 'DiagnosisController', resolve: {initialization: 'initialization'}});
        $routeProvider.when('/patient/:patientUuid/treatment', {templateUrl: 'modules/consultation/views/addObservation.html', controller: 'TreatmentController', resolve: {initialization: 'initialization'}});
        $routeProvider.when('/patient/:patientUuid/investigation', {templateUrl: 'modules/consultation/views/investigations.html', controller: 'InvestigationController', resolve: {initialization: 'initialization'}});
        $routeProvider.when('/patient/:patientUuid/notes', {templateUrl: 'modules/consultation/views/notes.html'});
        $routeProvider.when('/patient/:patientUuid/templates', {templateUrl: 'modules/consultation/views/comingSoon.html'});
        $routeProvider.otherwise({redirectTo: Bahmni.Opd.Constants.activePatientsListUrl});
}]).run(['$rootScope', function($rootScope){
  $rootScope.currentConsultation = {tests: []};
  $rootScope.currentPatient = Bahmni.Opd.dummyPatient(); // TODO: Set it to null once mapping patient story is palyed
}]);