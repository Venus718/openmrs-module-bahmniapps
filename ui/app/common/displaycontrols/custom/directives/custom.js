'use strict';

angular.module('bahmni.common.displaycontrol.custom',[])
    .directive('custom',['observationsService',function(observationsService){
	    
	    var controller = function($scope){
		//		observationsService.fetch($scope.patient.uuid,$scope.config.conceptNames,$scope.config.scope,$scope.config.numberOfVisits,$scope.visitUuid,$scope.config.obsIgnoreList);
	    }

	    var linkFunction = function(scope,elem,attr) {
		scope.getContentUrl = function() {
		    return "../../bahmni_config/openmrs/customHTMLTemplates/" + attr.templateurl;
		}
	    }

	    return {
		restrict: 'E',
		controller: controller,
		link: linkFunction,
		template: '<div ng-include="getContentUrl()"></div>'
	    };
    }]);