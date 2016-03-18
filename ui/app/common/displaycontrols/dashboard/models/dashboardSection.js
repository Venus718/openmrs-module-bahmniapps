'use strict';

Bahmni.Common.DisplayControl.Dashboard.Section = function (section) {
    angular.extend(this, section);
    this.displayOrder = section.displayOrder;
    this.data = section.data || {};
    this.isObservation = section.isObservation || false;
    this.patientAttributes = section.patientAttributes || [];
    var commonDisplayControlNames = [
        "admissionDetails",
        "bacteriologyResultsControl",
        "chronicTreatmentChart",
        "custom",
        "diagnosis",
        "disposition",
        "drugOrderDetails",
        "forms",
        "observationGraph",
        "obsToObsFlowSheet",
        "pacsOrders",
        "patientInformation"
    ];
    if (this.isObservation === true) {
        this.viewName = "../common/displaycontrols/dashboard/views/sections/observationSection.html";
    } else if (commonDisplayControlNames.some(function (name) {
            return name == section.type
        })) {
        this.viewName = "../common/displaycontrols/dashboard/views/sections/" + this.type + ".html";
    } else {
        this.viewName = "../clinical/dashboard/views/dashboardSections/" + this.type + ".html";
    }
};

Bahmni.Common.DisplayControl.Dashboard.Section.create = function (section) {
    return new Bahmni.Common.DisplayControl.Dashboard.Section(section);
};
