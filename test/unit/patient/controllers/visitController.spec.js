'use strict';

describe('VisitController', function () {
    var scope = { "$watch": jasmine.createSpy() }, $controller, conceptService, success, visitService, patientService, patient, date, $location;

    var sampleConcepts={
        "results": [
            {
                "setMembers": [
                    {
                        "uuid": "d7c66ef3-1f55-4b83-8f10-009e4acec1e3",
                        "name": {
                            "name": "CHIEF COMPLAINT"
                        }
                    },
                    {
                        "uuid": "8032ad29-0591-4ec6-9776-22e7a3062df8",
                        "name": {
                            "name": "REGISTRATION FEES"
                        }
                    }
                ]
            }
        ]
    }

    beforeEach(angular.mock.module('registration.visitController'));
    beforeEach(angular.mock.inject(['$injector', 'date', '$location', function ($injector, dateModule, location) {
        $controller = $injector.get('$controller');
        patientService = jasmine.createSpyObj('patientService', ['getPatient', 'clearPatient']);
        date = dateModule;
        patient = {};
		$location = location;
        patientService.getPatient.andReturn(patient);
        success = jasmine.createSpy();
        conceptService = {
            getRegistrationConcepts: function () {
                return {
                    success: function (callBack) {
                        callBack(sampleConcepts);
                    }
                }
            }
        };

    }]));

    describe('initialization', function () {
        it('should set the patient from patient data and the default registration fee', function () {
            $controller('VisitController', {
                $scope: scope,
                concept: conceptService,
                patientService: patientService
            });

           expect(scope.obs.registration_fees).toBe(defaults.registration_fees);
           expect(scope.patient).toBe(patient);
        });
    });

    describe("create", function(){
			var createPromise;

			beforeEach(function(){
		    visitService = jasmine.createSpyObj('visit', ['create']);
				createPromise = jasmine.createSpyObj('createPromise', ['success'])
		         $controller('VisitController', {
		             $scope: scope,
		             concept: conceptService,
		             patientService: patientService,
		             visitService: visitService,
							$location: $location,
		             date: date
		         });
				visitService.create.andReturn(createPromise)
		    scope.patient = {uuid: "21308498-2502-4495-b604-7b704a55522d"}
			});
	
	    it("should create visit", function(){
	        var now = new Date();
	        spyOn(date, "now").andReturn(now)
	        scope.obs.chief_complaint = "ache";
	        scope.obs.registration_fees = "100";

	        scope.create();

	        expect(scope.visit.patient).toBe(scope.patient.uuid);
	        expect(scope.visit.startDatetime).toBe(now.toISOString());
	        expect(scope.visit.visitType).toBe(constants.visitType.registration);
	        expect(scope.encounter.patient).toBe(scope.patient.uuid);
	        expect(scope.encounter.encounterDatetime).toBe(now.toISOString());
	        expect(scope.encounter.encounterType).toBe(constants.visitType.registration);
	        expect(scope.encounter.obs).toEqual([{concept: "d7c66ef3-1f55-4b83-8f10-009e4acec1e3",value: "ache"},{concept: "8032ad29-0591-4ec6-9776-22e7a3062df8",value: "100"}])
	        expect(scope.visit.encounters).toEqual([scope.encounter]) ;
	        expect(visitService.create).toHaveBeenCalledWith(scope.visit);
	    });

		 it("should go to search on succesful creation of visit", function(){
				spyOn($location, 'path');
	     	scope.create();
	     	expect(createPromise.success).toHaveBeenCalled();

				createPromise.success.mostRecentCall.args[0]();
			
	      expect($location.path).toHaveBeenCalledWith('/search');
 	   });

		 it("should clear the stored patient on success", function(){
	     	scope.create();
				
				createPromise.success.mostRecentCall.args[0]();
			
	      expect(patientService.clearPatient).toHaveBeenCalled();
 	   });
	});

    describe("calculateBMI", function(){
        beforeEach(function(){
            $controller('VisitController', {
                $scope: scope,
                concept: conceptService
            });
        });

        it("should set bmi, bmi_status and bmi_error when height and weight are present", function(){
            scope.obs.height = 50;
            scope.obs.weight = 100;

            scope.calculateBMI();

            expect(scope.obs.bmi).toBe(400);
            expect(scope.obs.bmi_error).toBe(true);
            expect(scope.obs.bmi_status).toBe("Invalid");

        });

        it("should clear the bmi, bmi_status when height is not present", function(){
            scope.obs.bmi = 200;
            scope.obs.bmi_status = "Invalid";
            scope.obs.bmi_error = true;
            scope.obs.height = null;
            scope.obs.weight = 100;


            scope.calculateBMI();

            expect(scope.obs.bmi).toBe(null);
            expect(scope.obs.bmi_error).toBe(false);
            expect(scope.obs.bmi_status).toBe(null);
        });

        it("should clear the bmi, bmi_status when weight is not present", function(){
            scope.obs.bmi = 200;
            scope.obs.bmi_status = "Invalid";
            scope.obs.bmi_error = true;
            scope.obs.height = 100;
            scope.obs.weight = null;


            scope.calculateBMI();

            expect(scope.obs.bmi).toBe(null);
            expect(scope.obs.bmi_error).toBe(false);
            expect(scope.obs.bmi_status).toBe(null);
        });
    });
});