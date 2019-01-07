var Game = BasicModel.extend({

    url: API.gamesDraw.url,
    updatePeriod: API.gamesDraw.period,
    updateInterval: null,
    lastUpdated: 0,
    storageFlag: 'gamesDraw',
    updateFlag: 'gamesDrawUpd',
    periodUpdateFlag: 'gamesDrawUpdPeriod',
    console: 'GAME',
    consoleColor: 'color:#1ea517',

    defaults: {
        Bonus: '',
        CanClaim: false,
        ClaimUrl: '',
        Claimed: false,
        DrawActive: false,
        Jackpot: '',
        Username: ''
    },

    initialize: function() {
        if (this.url) {
            this.setOptions();
            var self = this;
            framework.extension.getItem(this.updateFlag,function(timeLastUpdate){
                framework.extension.getItem(self.periodUpdateFlag,function(timeLastPeriodUpdate) {
                    if (_.now() - timeLastUpdate >= timeLastPeriodUpdate) {
                        self.fetchFromServer(self.options);
                    } else {
                        self.fetch();
                    }
                });
            });
        }
    },

    setOptions: function () {
        var self = this;
        this.options = {
            error: function () {
                log('%c' + self.console + '.JS: FETCH FAILED', self.consoleColor);
                setTimeout(function () {
                    self.fetch();
                }, FETCH_TIMEOUT_IN_CASE_OF_ERROR);
            },
            success: function (model) {
                if (self.get("Bonus")) {
                    log('%c' + self.console + '.JS: FETCH SUCCEEDED', self.consoleColor, self);
                    framework.extension.setItem(self.updateFlag, _.now());

                    var timeNowUTC = (new Date().getTime() + (new Date()).getTimezoneOffset() * 1000 * 60);
                    var timeUpdate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 18, 5, 0, 0) - timeNowUTC;
                    if (timeUpdate <= 0) {
                        timeUpdate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate() + 1, 18, 5, 0, 0) - timeNowUTC;
                    } else if (timeUpdate > 24 * 1000 * 3600) {
                        timeUpdate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate() - 1, 18, 5, 0, 0) - timeNowUTC;
                    }
                    self.updatePeriod = timeUpdate;
                    framework.extension.setItem(self.periodUpdateFlag, self.updatePeriod);
                    log('%cThe game will be updated after ' + timeUpdate / 1000 / 3600 + ' h', self.consoleColor);

                    if (self.fetchTimeout) {
                        window.clearTimeout(self.fetchTimeout);
                        self.fetchTimeout = null;
                    }
                    self.fetchTimeout = window.setTimeout(function () {
                        log('%c' + self.console + '.JS: PERIODICAL FETCH', self.consoleColor);
                        self.fetch();
                    }, self.updatePeriod);
                    model && model.save();
                }
            },
            dataType: self.dataType,
            reset: true
        };
    }

});