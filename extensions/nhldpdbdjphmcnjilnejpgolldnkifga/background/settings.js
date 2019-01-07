var Settings = BasicModel.extend({

    storageFlag: 'settings',
    console: 'SETTINGS',
    consoleColor: 'color:#62513d',

    defaults: {
        showSlider: true,
        showSerp: true
    },

    initialize: function () {
        log('%c' + this.console + '.JS: SETTINGS INIT', this.consoleColor);

        var self = this;
        this.setOptions();
        framework.extension.getItem(this.storageFlag,function(isSet){
            if (isSet) {
                self.fetchFromStorage();
            } else {
                self.save();
            }
        });
    },

    setOptions: function () {
        var self = this;
        this.options = {
            error: function () {
                log('%c' + self.console + '.JS: FETCH FAILED', self.consoleColor);
            },
            success: function (model) {
                log('%c' + self.console + '.JS: FETCH SUCCEEDED', self.consoleColor, self);
                model && model.save();
            },
            dataType: self.dataType,
            reset: true
        };
    }
});