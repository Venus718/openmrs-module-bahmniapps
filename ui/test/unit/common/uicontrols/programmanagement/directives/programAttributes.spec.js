'use strict';

describe("ensure that the directive program-attributes works properly", function () {

    var scope,filter;

    beforeEach(module('bahmni.common.uicontrols.programmanagment'));

    beforeEach(inject(function ($controller, $rootScope,$filter) {
        scope = $rootScope.$new();
        scope.program = program;
        scope.programAttributeTypes = attributeTypes;
        filter = $filter;
        $controller('ProgramAttributesController', {
            $scope: scope
        });
    }));



    it("Get program attributes map from program", function () {
        var dateUtil = Bahmni.Common.Util.DateUtil;
        var programAtrributeMap = scope.program.patientProgramAttributes;
        expect(programAtrributeMap["Sample regex attribute"]).toBe("123");
        expect(dateUtil.isSameDateTime(programAtrributeMap["Sample date attribute"], dateUtil.parseServerDateToDate("2016-01-13T00:00:00.000+0000"))).toBeTruthy();
    });

    it("Get the converted Date value for an Attribute Type of Date", function (){
        var dateUtil = Bahmni.Common.Util.DateUtil;
        var attributeType = {
                "uuid" : "uuid1",
                "name" : "Sample date attribute",
                "description" : "Date Attribute",
                "datatypeClassname" : "org.openmrs.customdatatype.datatype.DateDatatype",
                "format" : "org.openmrs.customdatatype.datatype.DateDatatype"
        };

        expect(dateUtil.isSameDateTime(scope.getValueForAttributeType(attributeType),Bahmni.Common.Util.DateUtil.formatDateWithoutTime("2016-01-13T00:00:00.000+0000"))).toBeTruthy();
    });

    it("Get the value for an Attribute Type", function (){
        var dateUtil = Bahmni.Common.Util.DateUtil;
        var attributeType = {
            "uuid" : "uuid2",
            "description" : "Sample regex attribute",
            "name" : "Sample regex attribute",
            "format" : "org.openmrs.customdatatype.datatype.RegexValidationDatatype"
        };

        expect(dateUtil.isSameDateTime(scope.getValueForAttributeType(attributeType),"123")).toBeTruthy();
    });

    var program = {
        "uuid": "01f3f8c7-28cc-4771-b466-ec77f39601ae",
        "patient": {
            "uuid": "ad95e200-6196-4438-a078-16ad0506a473",
            "display": "GAN200019 - Test Radiology"
        },
        "program": {
            "uuid": "bf477b31-dd0d-49ac-b862-e1bb3523772d",
            "name": "Cancer",
            "display": "Cancer",
            "resourceVersion": "1.8"
        },
        "dateEnrolled": "2016-01-12T04:55:45.000+0000",
        "dateCompleted": null,
        "location": null,
        "voided": false,
        "outcome": null,
        "attributes": [
            {
                "uuid": "6ccf5c9c-9f8c-4e46-b40b-c203b033f6d7",
                "name": "Sample Regex attribute" ,
                "value": "123",
                "attributeType" : {
                    "uuid" : "uuid2"
                }
            },
            {
                "uuid": "12cac096-ac84-419f-88c3-f140a3c13d98",
                "name": "Sample date attribute",
                "value": "2016-01-13T00:00:00.000+0000",
                "attributeType" : {
                    "uuid" : "uuid1"
                }
            }
        ],
    };

    var attributeTypes = [
        {
            "uuid" : "uuid1",
            "description" : "Sample date attribute",
            "name" : "Sample date attribute",
            "format" : "org.openmrs.customdatatype.datatype.DateDatatype"
        },
        {
            "uuid" : "uuid2",
            "description" : "Sample regex attribute",
            "name" : "Sample regex attribute",
            "format" : "org.openmrs.customdatatype.datatype.RegexValidationDatatype"
        }
    ];

});
