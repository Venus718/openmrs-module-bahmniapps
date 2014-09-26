'use strict';

describe("drugOrderViewModel", function () {
    var sampleTreatment = function (extensionParams, routes, durationUnits) {
        var sampleTreatment = new Bahmni.Clinical.DrugOrderViewModel(extensionParams, {routes:routes, durationUnits: durationUnits});
        sampleTreatment.drugName = "calpol 500mg(tablets)";
        sampleTreatment.instructions = "Before Meals";
        sampleTreatment.duration = "10";
        sampleTreatment.scheduledDate = "21/12/2014";
        sampleTreatment.quantity = "12";
        sampleTreatment.quantityUnit = "Capsule";
        return sampleTreatment;
    };

    it("should get the text to be displayed in the treatment list", function () {
        var treatment = sampleTreatment({}, []);
        treatment.durationUnit = {name: "Days"};
        treatment.route = {name: "Orally"};
        treatment.uniformDosingType.dose = "1";
        treatment.uniformDosingType.doseUnits = "Capsule";
        treatment.uniformDosingType.frequency = {name: "Once a day"};
        treatment.frequencyType = Bahmni.Clinical.Constants.dosingTypes.uniform;
        expect(treatment.getDescription()).toBe("1 Capsule, Once a day, Before Meals, Orally - 10 Days");

        treatment.uniformDosingType.frequency = null;
        expect(treatment.getDescription()).toBe("1 Capsule, Before Meals, Orally - 10 Days");
    });

    it("should get the text to be displayed in the treatment list with dosage instructions", function () {
        var treatment = sampleTreatment({}, []);
        treatment.frequencyType = "variable";
        treatment.route = {name: "Orally"};
        treatment.durationUnit = {name: "Days"};
        treatment.variableDosingType = {
            morningDose: 1,
            afternoonDose: 1,
            eveningDose: 1
        };

        expect(treatment.getDescription()).toBe("1-1-1, Before Meals, Orally - 10 Days")
    });

    it("should get the text to be displayed in the treatment list without dosage instructions if the instruction is as directed", function () {
        var treatment = sampleTreatment({}, []);
        treatment.frequencyType = "variable";
        treatment.route = {name: "Orally"};
        treatment.durationUnit = {name: "Days"};
        treatment.instructions = 'As directed';
        treatment.variableDosingType = {
            morningDose: 1,
            afternoonDose: 1,
            eveningDose: 1
        };

        expect(treatment.getDescription()).toBe("1-1-1, Orally - 10 Days")
    });

    it("should get the default route from the config", function() {
        var treatment = sampleTreatment({defaultRoute: "Orally"}, [{name: "Intramuscular"}, {name: "Orally"}]);
        expect(treatment.route).toEqual({name: "Orally"});
    });

    it("should get default durationUnit from config if available", function() {
        var treatment = sampleTreatment({defaultDurationUnit: "Months"}, [], [{name: "Days"}, {name: "Months"}]);
        expect(treatment.durationUnit).toEqual({name: "Months"});
    });

    it("should reset uniformDosingType and noFrequencyDosingType when changing frequency type to variable", function() {
        var sampleTreatment = new Bahmni.Clinical.DrugOrderViewModel({});
        sampleTreatment.uniformDosingType = {
            dose: 1,
            doseUnits: "Tablets",
            frequency: "Once a Day"
        };
        sampleTreatment.setFrequencyType(Bahmni.Clinical.Constants.dosingTypes.variable);
        expect(sampleTreatment.uniformDosingType).toEqual({});
        expect(sampleTreatment.noFrequencyDosingType).toEqual({});
        expect(sampleTreatment.variableDosingType).not.toBe({});
    });

    it("should reset variableDosingType and noFrequencyDosingType when changing frequency type to uniform", function() {
        var sampleTreatment = new Bahmni.Clinical.DrugOrderViewModel({});
        sampleTreatment.variableDosingType = {
            morningDose: 1,
            afternoonDose: 1,
            eveningDose: 1,
            doseUnits: "Once a Day"
        };
        sampleTreatment.setFrequencyType(Bahmni.Clinical.Constants.dosingTypes.uniform);
        expect(sampleTreatment.uniformDosingType).not.toBe({});
        expect(sampleTreatment.variableDosingType).toEqual({});
        expect(sampleTreatment.noFrequencyDosingType).toEqual({});
    });

    it("should reset variableDosingType and uniformDosingType when changing frequency type to noFrequency", function() {
        var sampleTreatment = new Bahmni.Clinical.DrugOrderViewModel({});
        sampleTreatment.noFrequencyDosingType = {
            dose: 1,
            doseUnits: "Once a Day"
        };
        sampleTreatment.setFrequencyType(Bahmni.Clinical.Constants.dosingTypes.noFrequency);
        expect(sampleTreatment.noFrequencyDosingType).not.toBe({});
        expect(sampleTreatment.variableDosingType).toEqual({});
        expect(sampleTreatment.uniformDosingType).toEqual({});
    });

    it("should change duration unit based on frequency factor", function() {
        var sampleTreatment = new Bahmni.Clinical.DrugOrderViewModel({}, {durationUnits: [{name: "Hours"}, {name: "Days"}, {name: "Weeks"}]});
        sampleTreatment.frequencyType = Bahmni.Clinical.Constants.dosingTypes.uniform;

        sampleTreatment.uniformDosingType.frequency = {name: "Every Hour", frequencyPerDay: 24};
        sampleTreatment.calculateDurationUnit();
        expect(sampleTreatment.durationUnit.name).toBe("Hours");

        sampleTreatment.uniformDosingType.frequency = {name: "Every Two Hour", frequencyPerDay: 12};
        sampleTreatment.calculateDurationUnit();
        expect(sampleTreatment.durationUnit.name).toBe("Hours");

        sampleTreatment.uniformDosingType.frequency = {name: "Every Five Hour", frequencyPerDay: 24/5};
        sampleTreatment.calculateDurationUnit();
        expect(sampleTreatment.durationUnit.name).toBe("Hours");

        sampleTreatment.uniformDosingType.frequency = {name: "Every Six Hour", frequencyPerDay: 4};
        sampleTreatment.calculateDurationUnit();
        expect(sampleTreatment.durationUnit.name).toBe("Days");

        sampleTreatment.uniformDosingType.frequency = {name: "Four times a Day", frequencyPerDay: 4};
        sampleTreatment.calculateDurationUnit();
        expect(sampleTreatment.durationUnit.name).toBe("Days");

        sampleTreatment.uniformDosingType.frequency = {name: "Once a Day", frequencyPerDay: 1};
        sampleTreatment.calculateDurationUnit();
        expect(sampleTreatment.durationUnit.name).toBe("Days");

        sampleTreatment.uniformDosingType.frequency = {name: "Once a Week", frequencyPerDay: 1/7};
        sampleTreatment.calculateDurationUnit();
        expect(sampleTreatment.durationUnit.name).toBe("Weeks")
    });

    describe("calculateDurationInDays", function() {
        it("should convert duration to days", function() {
            var treatment = sampleTreatment({}, []);
            treatment.duration = 6;
            treatment.durationUnit = {name: "Weeks", factor: 7};
            treatment.calculateDurationInDays();
            expect(treatment.durationInDays).toBe(42);

            treatment.durationUnit = {name: "Months", factor: 30};
            treatment.calculateDurationInDays();
            expect(treatment.durationInDays).toBe(180);

            treatment.durationUnit = {name: "Days", factor: 1};
            treatment.calculateDurationInDays();
            expect(treatment.durationInDays).toBe(6);

            treatment.durationUnit = {name: "Hours", factor: 1/24};
            treatment.calculateDurationInDays();
            expect(treatment.durationInDays).toBe(0.25);
        });

        it("should default units to days", function() {
            var treatment = sampleTreatment({}, []);
            treatment.duration = 6;
            treatment.durationUnit = "Random";
            treatment.calculateDurationInDays();
            expect(treatment.durationInDays).toBe(6);
        });
    });

    describe("calculateQuantity", function() {
        var sampleTreatmentWithUniformDosing = function(dose, doseUnits, frequency, duration, durationUnit, factor) {
            var treatment = sampleTreatment({}, []);
            treatment.quantity = null;
            treatment.quantityUnit = null;
            treatment.uniformDosingType.dose = dose;
            treatment.uniformDosingType.doseUnits = doseUnits;
            treatment.uniformDosingType.frequency = frequency;
            treatment.duration = duration;
            treatment.durationUnit = {name: durationUnit, factor: factor};
            treatment.frequencyType = Bahmni.Clinical.Constants.dosingTypes.uniform;
            return treatment;
        };

        var sampleTreatmentWithVariableDosing = function(morningDose, afternoonDose, eveningDose, doseUnits, duration, durationUnit, factor) {
            var treatment = sampleTreatment({}, []);
            treatment.quantity = null;
            treatment.quantityUnit = null;
            treatment.frequencyType = Bahmni.Clinical.Constants.dosingTypes.variable;
            treatment.variableDosingType = {
                morningDose: morningDose,
                afternoonDose: afternoonDose,
                eveningDose: eveningDose,
                doseUnits: doseUnits
            };
            treatment.duration = duration;
            treatment.durationUnit = {name: durationUnit, factor: factor};
            return treatment;
        };

        it("should calculate for uniform dose, frequency and duration", function() {
            var treatment = sampleTreatmentWithUniformDosing(3, "Capsule", {name: "Twice a Day", frequencyPerDay: 2}, 5, "Days");
            treatment.calculateQuantity();
            expect(treatment.quantity).toBe(30);
        });

        it("should convert duration units to days for calulation", function() {
            var treatment = sampleTreatmentWithUniformDosing(3, "Capsule", {name: "Twice a Day", frequencyPerDay: 2}, 5, "Weeks", 7);
            treatment.calculateQuantity();
            expect(treatment.quantity).toBe(210);
        });

        it("should calculate for variable dose and duration", function() {
            var treatment = sampleTreatmentWithVariableDosing(1, 2, 1.5, "Capsule", 4, "Days");
            treatment.calculateQuantity();
            expect(treatment.quantity).toBe(18);
        });

        it("should result in 0 for uniform dose when dose is not available", function() {
            var treatment = sampleTreatmentWithUniformDosing(null, "Capsule", {name: "Twice a Day", frequencyPerDay: 2}, 5, "Days");
            treatment.calculateQuantity();
            expect(treatment.quantity).toBe(0);

            treatment = sampleTreatmentWithVariableDosing(0, 0, null, "Capsule", 4, "Days");
            treatment.calculateQuantity();
            expect(treatment.quantity).toBe(0);
        });

        it("should result in 0 for uniform dose when duration is not available", function() {
            var treatment = sampleTreatmentWithUniformDosing(3, "Capsule", {name: "Twice a Day", frequencyPerDay: 2}, null, "Days");
            treatment.calculateQuantity();
            expect(treatment.quantity).toBe(0);

            treatment = sampleTreatmentWithVariableDosing(1, 0, 1, "Capsule", null, "Days");
            treatment.calculateQuantity();
            expect(treatment.quantity).toBe(0);
        });

        it("should result in 0 for uniform dose when frequency is not available", function() {
            var treatment = sampleTreatmentWithUniformDosing(3, "Capsule", null, 5, "Days");
            treatment.calculateQuantity();
            expect(treatment.quantity).toBe(0);
        });

        it("should not calculate quantity and quantityUnit if entered manually", function() {
            var treatment = sampleTreatmentWithUniformDosing(3, "Capsule", {name: "Twice a Day", frequencyPerDay: 2}, 5, "Days");
            treatment.quantity = 100;
            treatment.quantityUnit = "not Capsule";
            treatment.setQuantityEnteredManually();
            treatment.calculateQuantity();
            expect(treatment.quantity).toBe(100);
            expect(treatment.quantityUnit).toBe("not Capsule");
        });

        it("should be active if the effective stop date is in future", function(){
            var treatment = sampleTreatmentWithUniformDosing(3, "Capsule", {name: "Twice a Day", frequencyPerDay: 2}, 5, "Days");
            treatment.effectiveStopDate = getFutureDate();
            expect(treatment.isActive()).toBe(true);
        });

        it("should be active if the effective stop date is null", function(){
            var treatment = sampleTreatmentWithUniformDosing(3, "Capsule", {name: "Twice a Day", frequencyPerDay: 2}, 5, "Days");
            treatment.effectiveStopDate = undefined;
            expect(treatment.isActive()).toBe(true);
        });

        it("should be active if the effective stop date is today", function(){
            var treatment = sampleTreatmentWithUniformDosing(3, "Capsule", {name: "Twice a Day", frequencyPerDay: 2}, 5, "Days");
            treatment.effectiveStopDate = new Date();
            expect(treatment.isActive()).toBe(true);
        });

        it("should be inActive if the date_stopped is set", function(){
            var treatment = sampleTreatmentWithUniformDosing(3, "Capsule", {name: "Twice a Day", frequencyPerDay: 2}, 5, "Days");
            treatment.dateStopped = new Date();

            expect(treatment.isActive()).toBe(false);
        })
    });

    describe("Discontinued", function(){
        it("should return true if the action is discontinue", function(){
            var treatment = sampleTreatment({}, []);
            treatment.action = 'DISCONTINUE';

            expect(treatment.discontinued()).toBe(true);
        });

        it("should return false if the action is new", function(){
            var treatment = sampleTreatment({}, []);
            treatment.action = 'NEW';

            expect(treatment.discontinued()).toBe(false);
        });

        it("should return false if the action is Revise", function(){
            var treatment = sampleTreatment({}, []);
            treatment.action = 'REVISE';

            expect(treatment.discontinued()).toBe(false);
        });
    });

    function getFutureDate() {
        var today = new Date();
        today.setDate(today.getDate() + 7);
        return today;
    }

    describe("createFromContract", function(){
        var drugOrder =   {
                "uuid": null,
                "action": "NEW",
                "careSetting": "Outpatient",
                "orderType": "Drug Order",
                "autoExpireDate": null,
                "scheduledDate": null,
                "dateStopped": null,
                "instructions": null,
                "visit": {
                    "startDateTime": 1397028261000,
                    "uuid": "002efa33-4c4f-469f-968a-faedfe3a5e0c"
                },
                "drug": {
                    "form": "Injection",
                    "uuid": "8d7e3dc0-f4ad-400c-9468-5a9e2b1f4230",
                    "strength": null,
                    "name": "Methylprednisolone 2ml"
                },
                "dosingInstructions": {
                    "quantity": 100,
                    "route": "Intramuscular",
                    "frequency": "Twice a day",
                    "doseUnits": "Tablespoon",
                    "asNeeded": false,
                    "quantityUnits": "Tablet",
                    "dose": 5,
                    "administrationInstructions": "{\"instructions\":\"In the evening\",\"additionalInstructions\":\"helylo\"}",
                    "numberOfRefills": null
                },
                "durationUnits": "Days",
                "dateActivated": 1410322624000,
                "commentToFulfiller": null,
                "effectiveStartDate": 1410322624000,
                "effectiveStopDate": null,
                "orderReasonConcept": null,
                "dosingInstructionType": "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FlexibleDosingInstructions",
                "previousOrderUuid": null,
                "orderReasonText": null,
                "duration": 10,
                "provider": {name: "superman"}
            };

        it("should map fields correctly from Drug Order", function(){
            var drugOrderViewModel = Bahmni.Clinical.DrugOrderViewModel.createFromContract(drugOrder);
            expect(drugOrderViewModel.asNeeded).toBe(drugOrder.dosingInstructions.asNeeded);
            expect(drugOrderViewModel.route).toBe(drugOrder.dosingInstructions.route);
            expect(drugOrderViewModel.duration).toBe(drugOrder.duration);
            expect(drugOrderViewModel.durationUnit.name).toBe(drugOrder.durationUnits);
            expect(drugOrderViewModel.scheduledDate).toBe(drugOrder.effectiveStartDate);
            expect(drugOrderViewModel.frequencyType).toBe("uniform");
            expect(drugOrderViewModel.uniformDosingType.dose).toBe(drugOrder.dosingInstructions.dose);
            expect(drugOrderViewModel.uniformDosingType.doseUnits).toBe(drugOrder.dosingInstructions.doseUnits);
            expect(drugOrderViewModel.uniformDosingType.frequency.name).toBe(drugOrder.dosingInstructions.frequency);
            expect(drugOrderViewModel.quantity).toBe(drugOrder.dosingInstructions.quantity);
            expect(drugOrderViewModel.quantityUnit).toBe(drugOrder.dosingInstructions.quantityUnits);
            expect(drugOrderViewModel.drugName).toBe(drugOrder.drug.name);
            expect(drugOrderViewModel.effectiveStartDate).toBe(drugOrder.effectiveStartDate);
            expect(drugOrderViewModel.effectiveStopDate).toBe(drugOrder.effectiveStopDate);
            expect(drugOrderViewModel.provider).toBe(drugOrder.provider.name);
        });

    });

    describe("revise", function() {

        it ("should not change scheduled date", function() {
            var treatment = sampleTreatment({}, []);
            var now = Bahmni.Common.Util.DateUtil.now();
            treatment.scheduledDate = Bahmni.Common.Util.DateUtil.subtractDays(now, 2);
            treatment.drug = { form: undefined };

            var revisedTreatment = treatment.revise({});
            expect(revisedTreatment.scheduledDate).toBe(treatment.scheduledDate);
        });

        it ("should map uuid to previousOrderUuid", function() {
            var treatment = sampleTreatment({}, []);
            treatment.drug = {  form: undefined };
            treatment.uuid = "previous-order-uuid";

            var revisedTreatment = treatment.revise({});
            expect(revisedTreatment.previousOrderUuid).toBe(treatment.uuid);
            expect(treatment.previousOrderUuid).not.toBe(treatment.uuid);
        });

        it ("should set action as REVISE", function() {
            var treatment = sampleTreatment({}, []);
            treatment.drug = { form: undefined };

            var revisedTreatment = treatment.revise({});
            expect(revisedTreatment.action).toBe(Bahmni.Clinical.Constants.orderActions.revise);
            expect(treatment.action).not.toBe(Bahmni.Clinical.Constants.orderActions.revise);
        });

    });

});
