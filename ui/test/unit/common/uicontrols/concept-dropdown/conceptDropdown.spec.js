'use strict';

describe('conceptDropdown', function () {
    var conceptService, compile, scope, $q;
    beforeEach(function () {
        module("bahmni.common.uicontrols");
        module('ngHtml2JsPreprocessor');
        module(function ($provide) {
            conceptService = jasmine.createSpyObj('conceptService', ['getConceptByQuestion', 'getAnswers']);
            $provide.value('conceptService', conceptService);
        });

        inject(function ($compile, $rootScope, _$q_) {
            compile = $compile;
            scope = $rootScope.$new();
            $q = _$q_;
        });
    });

    var generateElement = function () {
        var unCompiledHtml =
            '<concept-dropdown ' +
            'on-change="handleUpdate" ' +
            'model="observation.value" ' +
            'coded-concept-name="observation.conceptUIConfig.answersConceptName" ' +
            'default-concept="observation.concept" ' +
            'on-invalid-class="\'illegalValue\'" ' +
            'is-valid="observation.isValid(atLeastOneValueIsSet,conceptSetRequired)"' +
            '></concept-dropdown>';
        var element = compile(angular.element(unCompiledHtml))(scope);
        scope.$digest();
        return element;
    };

    it("should load answers with given conceptName", function () {
        scope.observation = {
            conceptUIConfig: {
                answersConceptName: 'answersConcept'
            }
        };

        var data = [
            {uuid: "uuid1", name: 'name1'},
            {uuid: "uuid2", name: 'name2'}
        ];
        var response = specUtil.respondWithPromise($q, data);
        conceptService.getConceptByQuestion.and.returnValue(response);

        var element = generateElement();

        expect(conceptService.getConceptByQuestion).toHaveBeenCalledWith({
            codedConceptName: 'answersConcept'
        });

        var compiledElementScope = element.isolateScope();
        scope.$digest();

        expect(compiledElementScope).toBeTruthy();
        expect(compiledElementScope.answers[0].uuid).toEqual("uuid1");
        expect(compiledElementScope.answers[1].uuid).toEqual("uuid2");
    });

    it("should load answers from given concept", function () {
        var data = [
            {uuid: "uuid1", name: 'name1'},
            {uuid: "uuid2", name: 'name2'}
        ];

        scope.observation = {
            concept: {
                answers: data
            }
        };

        var response = specUtil.respondWithPromise($q, data);
        conceptService.getAnswers.and.returnValue(response);

        var element = generateElement();

        expect(conceptService.getAnswers).toHaveBeenCalledWith(scope.observation.concept);

        var compiledElementScope = element.isolateScope();
        scope.$digest();

        expect(compiledElementScope).toBeTruthy();
        expect(compiledElementScope.answers[0].uuid).toEqual("uuid1");
        expect(compiledElementScope.answers[1].uuid).toEqual("uuid2");

    });

    it("should load saved answer when default-concept is given", function () {
        var data = [
            {uuid: "uuid1", name: 'name1'},
            {uuid: "uuid2", name: 'name2'}
        ];

        scope.observation = {
            value: {
                uuid: 'uuid2'
            },
            concept: {
                answers: data
            }
        };

        var response = specUtil.respondWithPromise($q, data);
        conceptService.getAnswers.and.returnValue(response);

        var element = generateElement();
        var compiledElementScope = element.isolateScope();
        scope.$digest();

        expect(compiledElementScope).toBeTruthy();
        expect(compiledElementScope.selectedAnswer.uuid).toEqual("uuid2");
    });

    it("should load saved answer when default-concept is not given", function () {
        scope.observation = {
            value: {
                uuid: 'uuid2'
            },
            conceptUIConfig: {
                answersConceptName: 'answersConcept'
            }
        };

        var data = [
            {uuid: "uuid1", name: 'name1'},
            {uuid: "uuid2", name: 'name2'}
        ];
        var response = specUtil.respondWithPromise($q, data);
        conceptService.getConceptByQuestion.and.returnValue(response);

        var element = generateElement();
        var compiledElementScope = element.isolateScope();
        scope.$digest();

        expect(compiledElementScope).toBeTruthy();
        expect(compiledElementScope.selectedAnswer.uuid).toEqual("uuid2");

    });
});