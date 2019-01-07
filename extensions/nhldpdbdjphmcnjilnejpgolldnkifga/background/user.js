var User = BasicModel.extend({

    url: API.user.url,
    updatePeriod: API.user.period,
    updateInterval: null,
    lastUpdated: 0,
    storageFlag: 'userInfo',
    updateFlag: 'userInfoUpd',
    console: 'USER',
    consoleColor: 'color:#62513d',

    defaults: {
        Username: '',
        CashBalance: '',
        LifetimeCashback: '',
        LifetimePoints: '',
        PointsBalance: '',
        AccountUrl: ACCOUNT_URL
    },

    initialize: function () {
        log('%c' + this.console + '.JS: USER INIT', this.consoleColor);

        this.basicInitialize();
        this.eventsHandler();

        var self = this;

        framework.extension.getItem('USER_TOKEN', function (cookie) {
            if (cookie) {
                log('%c' + self.console + '.JS: USER LOGGED IN EXTENSION', self.consoleColor); //self.login(cookie);
            }
        });

        this.on('change', function(model, options) {
            if (options.unset) {
                self.lastUpdated = 0;
            }
        });
    },

    eventsHandler: function () {
        var self = this;

        framework.extension.attachEvent('USER_LOGIN', _.bind(function (event) {
            self.login(event.data.cookie);
        }, self));

        framework.extension.attachEvent('USER_LOGOUT', _.bind(function (event) {
            self.logout(event.data.cookie);
        }, self));
    },

    login: function (cookie) {
        var self = this;
        framework.extension.getItem('USER_TOKEN', function (cookieLoginValue) {
            if (cookieLoginValue !== cookie) {
                log('%c' + self.console + '.JS: NEW USER LOGIN', self.consoleColor, ' with cookie ' + cookie + ' (before ' + cookieLoginValue + ')');
                googleAnalytics('UserActivity', 'LoginToExt');
                self.fetchFromServer();
                framework.extension.fireEvent('USER_LOGIN_LOGOUT', {}, function () {});
                framework.extension.setItem('USER_TOKEN', cookie);
            }
        });
    },

    logout: function (cookie) {
        var self = this;
        framework.extension.getItem('USER_TOKEN', function (cookieLoginValue) {
            if (cookieLoginValue !== cookie) {
                log('%c' + self.console + '.JS: USER LOGOUT', self.consoleColor, cookieLoginValue);
                if (cookieLoginValue) {
                    googleAnalytics('UserActivity', 'LogoutFromExt');
                }
                self.set(self.defaults);
                self.save();
                framework.extension.fireEvent('USER_LOGIN_LOGOUT', {}, function () {});
                framework.extension.setItem('USER_TOKEN', '');
            }
        }); 
    }
});