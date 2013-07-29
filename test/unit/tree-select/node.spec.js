'use strict';

describe("Bahmni.Opd.TreeSelect.Node", function () {

    var Node = Bahmni.Opd.TreeSelect.Node;

    describe("isSelectable", function () {
        it('should be true when conceptClass is LabSet', function() {
            var node_null_set = new Node({display: "default concept", conceptClass: {name: "LabSet"}});
            var node_true_set = new Node({display: "default concept", set: true, conceptClass: {name: "LabSet"}});
            
            expect(node_null_set.isSelectable()).toBe(true);
            expect(node_true_set.isSelectable()).toBe(true);
        });

        it('should be true when conceptClass is not a set', function() {
            var node_false_set = new Node({display: "default concept", set: false, conceptClass: {name: "Misc"}});
            var node_null_set = new Node({display: "default concept", set: null, conceptClass: {name: "Misc"}});
            var node_missing_set = new Node({display: "default concept", conceptClass: {name: "Misc"}});
            expect(node_false_set.isSelectable()).toBe(true);
            expect(node_null_set.isSelectable()).toBe(true);
            expect(node_missing_set.isSelectable()).toBe(true);
        });

        it('should be false when it is a set', function() {
            var node = new Node({display: "default concept", set: true, conceptClass: {name: "Misc"}});
            expect(node.isSelectable()).toBe(false);
        });
    });

    describe("shouldBeShown", function () {
        it('should be true when node is not a set', function() {
            var node = new Node({display: "default concept", set: false, conceptClass: {name: "Misc"}});

            expect(node.shouldBeShown()).toBeTruthy();
        });

        it('should be true when node is a set and has children', function() {
            var node = new Node({display: "default concept", set: true, conceptClass: {name: "Misc"}}, [new Node({})]);

            expect(node.shouldBeShown()).toBeTruthy();
        });

        it('should be false when node is a set and doesnot have children', function() {
            var node = new Node({display: "default concept", set: true, conceptClass: {name: "Misc"}});

            expect(node.shouldBeShown()).toBeFalsy();
        });
    });

    describe("toggleSelection", function () {
        it('should select a node', function() {
            var node = new Node({display: "default concept", conceptClass: {name: "Misc"}});
            
            node.toggleSelection();

            expect(node.isSelected()).toBeTruthy();
        });

        it('should deselect if node is already selected', function() {
            var node = new Node({display: "default concept", conceptClass: {name: "Misc"}});
            node.toggleSelection();
            expect(node.isSelected()).toBeTruthy();

            node.toggleSelection();

            expect(node.isSelected()).toBeFalsy();
        });

        it('should select its children and disable them', function() {
            var child1 = new Node({display: "child concept 1", conceptClass: {name: "Misc"}});
            var child2 = new Node({display: "child concept 2", conceptClass: {name: "Misc"}});  
            var node = new Node({display: "default concept", set: true, conceptClass: {name: "LabSet"}}, [child1, child2]);

            node.toggleSelection();

            expect(node.isSelected()).toBeTruthy();
            expect(child1.isSelected()).toBeTruthy();
            expect(child1.isDisabled()).toBeTruthy();
            expect(child2.isSelected()).toBeTruthy();
            expect(child2.isDisabled()).toBeTruthy();

        });

        it('should deselect its children and enable them', function() {
            var child1 = new Node({display: "child concept 1", conceptClass: {name: "Misc"}});
            var child2 = new Node({display: "child concept 2", conceptClass: {name: "Misc"}});
            var node = new Node({display: "default concept", set: true, conceptClass: {name: "LabSet"}}, [child1, child2]);

            node.toggleSelection();

            expect(node.isSelected()).toBeTruthy();
            expect(child1.isSelected()).toBeTruthy();
            expect(child2.isSelected()).toBeTruthy();

            node.toggleSelection();

            expect(node.isSelected()).toBeFalsy();
            expect(child1.isSelected()).toBeFalsy();
            expect(child1.isDisabled()).toBeFalsy();
            expect(child2.isSelected()).toBeFalsy();
            expect(child2.isDisabled()).toBeFalsy();
        });
    });

});