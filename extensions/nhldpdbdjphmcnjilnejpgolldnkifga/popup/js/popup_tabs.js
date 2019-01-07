var PopupTabView = Backbone.View.extend({
    el: '',
    template: null,
    events: {

    },
    render: function (data) {
        _.extend(this, data);

        log('POPUP.JS: RENDER TAB', this);

        this.$el.empty().prepend(this.template(data)).css({
            'width': POPUP_WIDTH
        });

        return this;
    }
});

var RetailerTab = PopupTabView.extend({
    el: "#retailer-tab-view",
    template: Handlebars.templates.retailer,
    events: {
        'click .btn-get-code': function (event) {
            googleAnalytics('UserActivityInPopup', 'GetTheCode');
            framework.browser.navigate({
                tabId: framework.browser.CURRENTTAB,
                url: event.currentTarget.dataset.url
            });
            window.close();
        },
        'click .btn-get-cashback': function (event) {
            log('popup: GET CASHBACK', event,  framework.browser.CURRENTTAB, event.currentTarget.dataset.url);
            googleAnalytics('UserActivityInPopup', 'GetCashbackClick');
            framework.browser.navigate({
                tabId: framework.browser.CURRENTTAB,
                url: event.currentTarget.dataset.url
            });
            log('popup: GET CASHBACK', event,  framework.browser.CURRENTTAB, event.currentTarget.dataset.url);
            window.close();
        },
        'click .btn-copy-code': function (event) {
            googleAnalytics('UserActivityInPopup', 'CopyTheCode');
            copyToClipboard($(event.currentTarget).find('.copy_text').text());
        }
    },
    initialize: function (data) {
        _.extend(this, data);
    }
});
var SearchTab = PopupTabView.extend({
    el: "#search-tab-view",
    template: Handlebars.templates.search,
    events: {
        'focus #tags': function (event) {
            googleAnalytics('UserActivityInPopup', 'Search');
            var self = this;
            this.searchResults = new SearchTabResults();
            $("#tags")
                .on("input", function (event) {
                    var inputValue = event.currentTarget.value.replace(/\s{2,}/g, ' ').replace(/(^\s*)|(\s*)$/g, '').toLowerCase();
                    var searchResult;
                    if (inputValue !== '') {
                        searchResult = _.filter(self.merchantsList, function (merchant) {
                            return (merchant.Name.toLowerCase()).indexOf(inputValue) > -1;
                        });
                        self.searchResults.render({
                            foundMerchants: searchResult
                        });
                    } else {
                        self.searchResults.render({
                            foundMerchants: self.featuredMerchants
                        });
                    }
                });
        }
    },
    initialize: function (data) {
        _.extend(this, data);
    }

});
var SearchTabResults = PopupTabView.extend({
    el: "#search-results",
    template: Handlebars.templates.searchResults,
    initialize: function (data) {
        _.extend(this, data);
    }

});
var SurveysTab = PopupTabView.extend({
    el: "#survey-tab-view",
    template: Handlebars.templates.surveys,
    events: {
        'click #go-to-surveys-page': function (event) {
            googleAnalytics('UserActivityInPopup', 'GoToSurveyPage');
            framework.browser.navigate({
                tabId: framework.browser.NEWTAB,
                url: SURVEYS_PAGE
            });
            window.close();
        }
    }
});
var GameTab = PopupTabView.extend({
    el: "#game-tab-view",
    template: Handlebars.templates.game,
    events: {

    }
});
var UserTab = PopupTabView.extend({
    el: "#user-tab-view",
    template: Handlebars.templates.user,
    events: {
        'click #logout-from-ext': function (event) {
            googleAnalytics('UserActivityInPopup', 'LogoutClick');
            framework.browser.navigate({
                tabId: framework.browser.NEWTAB,
                url: LOG_OUT_OF_EXTENSION
            });
            window.close();
        }
    }
});
var SettingsTab = PopupTabView.extend({
    el: "#settings-tab-view",
    template: Handlebars.templates.settings,
    events: {
        'click #save-settings': function (event) {
            var showSerp = $('#toggle-serp')[0].checked,
                showSlider = $('#toggle-slider')[0].checked;
            if (this.settings.get('showSerp') !== showSerp) {
                if (showSerp) {
                    googleAnalytics('UserActivity', 'SerpTurnedOn');
                } else {
                    googleAnalytics('UserActivity', 'SerpTurnedOff');
                }
                this.settings.set('showSerp', $('#toggle-serp')[0].checked);
            }
            if (this.settings.get('showSlider') !== showSlider) {
                if (showSlider) {
                    googleAnalytics('UserActivity', 'NotificationTurnedOn');
                } else {
                    googleAnalytics('UserActivity', 'NotificationTurnedOff');
                }
                this.settings.set('showSlider', $('#toggle-slider')[0].checked);
            }
            this.settings.save();
            setTimeout(function (event) {
                $('.js-settings')[0].click();
            }, 200);
        }
    },
    initialize: function (data) {
        _.extend(this, data);
    }
});