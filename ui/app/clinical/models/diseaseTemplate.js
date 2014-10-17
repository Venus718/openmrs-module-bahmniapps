Bahmni.Clinical.DiseaseTemplate = function (diseaseTemplateResponse) {

    var diseaseTemplate = {
        name: diseaseTemplateResponse.name,
        obsTemplates: []
    };

    diseaseTemplateResponse.observationTemplates.forEach(function (obsTemplate) {
        if (obsTemplate.bahmniObservations.length > 0) {
            diseaseTemplate.obsTemplates.push(new Bahmni.Clinical.ObservationTemplate(obsTemplate));
        }
    });

    diseaseTemplate.notEmpty = function () {
        return diseaseTemplate.obsTemplates && diseaseTemplate.obsTemplates.length > 0;
    };

    return diseaseTemplate;
};

