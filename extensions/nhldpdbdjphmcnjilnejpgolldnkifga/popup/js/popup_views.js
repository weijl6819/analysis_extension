var PopupView = Backbone.View.extend({
    el: "body",
    template: Handlebars.templates.popup,

    initialize: function (options) {
        _.extend(this, options);
        log('POPUP.JS: INITIALIZE VIEW', this.model);

        $('body').on('click', '[data-href]', function (event) {
            var eventName = event.currentTarget.dataset.event;
            if (eventName === 'TargetedSurveyClick' ||  eventName === 'DailySurveyClick' ||
                eventName === 'GameDrawClaim' || eventName === 'GameDrawCheckResults' ||
                eventName === 'FeaturedMerchantClick' || eventName === 'SearchedMerchantClick') {
                googleAnalytics('UserActivityInPopup', eventName);
            }
            framework.browser.navigate({
                tabId: framework.browser.NEWTAB,
                url: event.currentTarget.dataset.href
            });
            window.close();
        });
    },

    events: {
        'click #login-to-ext-popup': function () {
            googleAnalytics('UserActivityInPopup', 'LoginClick');
            framework.browser.navigate({
                tabId: framework.browser.NEWTAB,
                url: LOG_INTO_EXTENSION
            });
            window.close();
        }
    },

    render: function () {
        var data = this.model;
        log('POPUP.JS: RENDER VIEW', data);
        this.$el.prepend(this.template(data)).css({
            'width': POPUP_WIDTH
        });

        // CHRISTMAS
        var currentData = new Date();
        if (// from November 25 to January 1
            (currentData.getUTCDate() > 24 && currentData.getUTCMonth() === 10) ||
            (currentData.getUTCMonth() === 11) ||
            (currentData.getUTCDate() < 2 && currentData.getUTCMonth() === 0)
        ) {
            $('.popup-header')[0].classList.add('xmas-header');
        }
        //

        if (this.model.merchants) {
            this.model.merchantsList = this.model.merchants;//_.pluck(this.model.merchants, 'Name'); //
        }

        this.model.retailerTab = new RetailerTab();
        this.model.searchTab = new SearchTab({merchantsList: this.model.merchantsList});
        this.model.surveysTab = new SurveysTab();
        this.model.gameTab = new GameTab();
        this.model.userTab = new UserTab();
        this.model.settingsTab = new SettingsTab();

        this.navigation = new PopupNavigation(this.model).render();

        if (this.model.currentMerchant) {
            googleAnalytics('UserActivityInPopup', 'RetailerTabOpened');
            //this.defaultTab =  new RetailerTab()
            this.model.retailerTab.render({
                merchant: this.model.currentMerchant,
                offers: this.model.offers
            });
            this.model.activeTab = '#retailer-tab';
            $(this.model.activeTab).addClass('active');
        } else {
            if (this.model.user.Username) {
                if(this.model.app.lastActiveTab !== '' && this.model.app.lastActiveTab !== 'retailer-tab') {
                    this.model.activeTab = '#' + this.model.app.lastActiveTab;
                    $(this.model.activeTab).click();
                } else {
                    $(".carousel-inner").css("top", -POPUP_CONTENT_HEIGHT + "px");
                    googleAnalytics('UserActivityInPopup', 'SearchTabOpened');
                    //this.defaultTab = new SearchTab({merchantsList: this.model.merchantsList})
                    this.model.searchTab.render({
                        featuredMerchants: this.model.featuredMerchants
                    });
                    this.model.activeTab = '#search-tab';
                    $(this.model.activeTab).addClass('active');
                }
            }
        }

        return this;
    }
});

var PopupNavigation = Backbone.View.extend({
    el: "#popup-navigation",
    template: Handlebars.templates.navigation,

    initialize: function (data) {
        _.extend(this, data);

        log('POPUP.JS: INITIALIZE NAV', data);

        /*this.retailerTab = new RetailerTab();
        this.searchTab = new SearchTab({merchantsList: this.merchantsList});
        this.surveysTab = new SurveysTab();
        this.gameTab = new GameTab();
        this.userTab = new UserTab();*/
    },

    events: {
        'click .navigation-tab': _.debounce(function (elem) {
            log('POPUP.JS: TABBB', elem);
            this.app.lastActiveTab = elem.currentTarget.id;
            $('.navigation-tab').removeClass('active');
            $(elem.currentTarget).addClass('active');
            var settings = $('.js-settings')[0];
            if(settings.classList.contains('opened')) {
                settings.classList.remove('opened');
            }
        }, 100),
        'click #retailer-tab': function () {
            googleAnalytics('UserActivityInPopup', 'RetailerTabOpened');
            $(".carousel-inner").css("top", 0 + "px");
            this.retailerTab.render({
                merchant: this.currentMerchant,
                offers: this.offers
            });
        },
        'click #search-tab': function () {
            googleAnalytics('UserActivityInPopup', 'SearchTabOpened');
            $(".carousel-inner").css("top", -POPUP_CONTENT_HEIGHT + "px");
            this.searchTab.render({
                featuredMerchants: this.featuredMerchants
            });
        },
        'click #survey-tab': function () {
            googleAnalytics('UserActivityInPopup', 'SurveyTabOpened');
            $(".carousel-inner").css("top", -2*POPUP_CONTENT_HEIGHT + "px");

            var self = this;
            function requestSurveys() {
                var optionsSurveys = {
                    success:  function(){
                        var newSurveys = {};
                        log('self.surveys.url', self.surveys.url);
                        if (self.surveys.url === API.surveys.urlUser) {
                            self.surveys.url = API.surveys.urlDaily;
                            self.surveys.fetch(optionsSurveys);

                            newSurveys = self.surveys.toJSON();
                            if (newSurveys.SurveyLength) { // if response contains SurveyLength - it is targeted
                                self.surveys.targeted = self.surveys.toJSON();
                                self.surveysTab.render({
                                    surveysTargeted: newSurveys
                                });
                            }
                        } else {
                            newSurveys = self.surveys.toJSON();
                            if (newSurveys[0]) {
                                self.surveys.common = self.surveys.toJSON();
                                self.surveysTab.render({
                                    surveysTargeted: self.surveys.targeted,
                                    surveysCommon: newSurveys
                                });
                            } else {
                                _.debounce(self.surveys.fetch(optionsSurveys),500);
                            }
                        }
                    }
                };
                if (self.surveys.common) {
                    self.surveysTab.render({
                        surveysTargeted: self.surveys.targeted,
                        surveysCommon: self.surveys.common
                    });
                }
                self.surveys.url = API.surveys.urlUser;
                self.surveys.fetch(optionsSurveys);
            }
            _.debounce(requestSurveys(),200);
        },
        'click #game-tab': function () {
            googleAnalytics('UserActivityInPopup', 'GameTabOpened');
            $(".carousel-inner").css("top", -3*POPUP_CONTENT_HEIGHT + "px");
            this.gameTab.render({gamesDraw: this.gamesDraw});
        },
        'click #user-tab': function () {
            googleAnalytics('UserActivityInPopup', 'UserTabOpened');
            $(".carousel-inner").css("top", -4*POPUP_CONTENT_HEIGHT + "px");
            this.userTab.render({user: this.user});
        },
        'click .js-settings': function (elem) {
            var domElement = elem.currentTarget;
            if (!domElement.classList.contains('opened')) {
                domElement.classList.add('opened');
                googleAnalytics('UserActivityInPopup', 'SettingsTabOpened');
                $(".carousel-inner").css("top", -5*POPUP_CONTENT_HEIGHT + "px");
                this.settingsTab.render({
                    settings: this.settings,
                    settingsVal: this.settings.toJSON()
                });
            } else {
                domElement.classList.remove('opened');
                $('.navigation-tab.active').click();
            }
        }
    },

    render: function () {
        log('POPUP.JS: RENDER NAVIGATION', this.currentMerchant);

        this.$el.empty().prepend(this.template(this.currentMerchant)).css({
            'width': POPUP_WIDTH
        });

        $(this.activeTab).addClass('active');

        return this;
    }
});