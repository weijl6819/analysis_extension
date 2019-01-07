var Survey = Backbone.Model.extend({

    defaults: {
        Logo: '',
        PointsValue: '',
        SurveyLength: null,
        SurveyRef: null,
        Url: ''
    }

});

var Surveys = Container.extend({
    model: Survey,
    updatePeriod: null,
    storageFlag: 'surveys',
    updateFlag: 'surveysUpd',
    console: 'SURVEYS',
    consoleColor: 'color:#d38d0a',

    initialize: function () {},

    parse: function (response) {
        log('%c' + this.console + '.JS: ', this.consoleColor, response.MethodResponse ? response.MethodResponse.Data : response.ErrorMessage);
        return response.MethodResponse ? response.MethodResponse.Data : null;
    }
});