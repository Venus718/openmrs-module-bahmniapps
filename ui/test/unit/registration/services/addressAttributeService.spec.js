'use strict';

describe('addressAttributeService', function () {
    var resultList = [
        {
            "name": "Semi",
            "parent": {
                "name": "Bilaspur",
                "parent": {
                    "name": "Distr",
                    "parent": {
                        "name": "Chattisgarh",
                        "parent": {
                            "name": "India"
                        }
                    }
                }
            }
        },
        {
            "name": "Semi",
            "parent": {
                "name": "Semariya",
                "parent": {
                    "name": "Distr",
                    "parent": {
                        "name": "Chattisgarh",
                        "parent": {
                            "name": "India"
                        }
                    }
                }
            }
        }
    ];
    var mockHttp = {defaults:{headers:{common:{'X-Requested-With':'present'}} },
        get:jasmine.createSpy('Http get').and.returnValue(resultList)
    };

    beforeEach(module('bahmni.registration'));
    beforeEach(module(function ($provide) {
        $provide.value('$http', mockHttp);
    }));

    describe("search", function () {
        it('Should get list of addresses from address hierarchy service', inject(['addressAttributeService', function (addressAttributeService) {
            Bahmni.Registration.Constants.openmrsUrl = 'http://blah.com/openmrs';
            var query = "bilas";
            var fieldName = "Village";

            var results = addressAttributeService.search(fieldName,query);

            expect(mockHttp.get).toHaveBeenCalled();
            expect(mockHttp.get.calls.mostRecent().args[0]).toBe('http://blah.com/openmrs/module/addresshierarchy/ajax/getPossibleAddressHierarchyEntriesWithParents.form');
            expect(mockHttp.get.calls.mostRecent().args[1].params.searchString).toBe(query);
            expect(mockHttp.get.calls.mostRecent().args[1].params.addressField).toBe(fieldName);
            expect(results).toBe(resultList);
        }]));
    });
});
 