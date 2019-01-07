var Application = Backbone.Model.extend({

    initialize: function () {
        log('%cAPPLICATION.JS: INITIALIZE APPLICATION', 'color: #a924d6');
        this.firstOpening();

        framework.extension.getItem('USER_TOKEN', function (cookie) {
            if (cookie) {
                log('%cAPPLICATION.JS: USER LOGGED IN EXTENSION', 'color: #a924d6');
            }
        });

        var self = this;
        var merchantsOptions = {
            success: function () {
                if (self.get("merchants")) {
                    if (self.get("merchants").gotCashback) {
                        self.get("merchants").gotCashback.forEach(function (gotCashbackElement) {
                            var gotCashback = self.get("merchants").findWhere({"Id" : +gotCashbackElement});
                            if (gotCashback) {
                                gotCashback.set("isActivated", true);
                            }
                        });
                    }
                    if (self.get("merchants").closed) {
                        self.get("merchants").closed.forEach(function (closedElement) {
                            var sliderClosed = self.get("merchants").findWhere({"Id" : +closedElement});
                            if (sliderClosed) {
                                sliderClosed.set("isClosed", true);
                            }
                        });
                    }
                }
            },
            error: function () {}
        };

        this.set({
            user: new User(),
            merchants: new Merchants(merchantsOptions),
            featuredMerchants: new FeaturedMerchants(),
            surveys: new Surveys(),
            gamesDraw: new Game(),
            suppressions: API.suppressions,
            settings: new Settings(),
            currentMerchant: {}
    	});

        this.activatedMerchantId = -1;
        this.activatedOffertId = -1;
        this.goThroughThirdLink = -1;
        this.lastActiveTab = '';

        this.eventsHandler();
        this.initPopup();

        this.on({
            'document-complete': function (event) {
                log('%cAPPLICATION.JS: document-complete', 'color: #ff0000', event);

                if (this.activatedMerchantId >= 0) {
                    var activatedMerchant = this.get("merchants").findWhere({"Id" : +this.activatedMerchantId});
                    if (activatedMerchant &&
                        (
                            activatedMerchant.get("Domain") && activatedMerchant.get("Domain") === extractDomain(event.url) ||
                            activatedMerchant.get("Pattern") && extractDomain(event.url).match(activatedMerchant.get("Pattern"))
                        ) &&
                        !activatedMerchant.get("isActivated")
                    ) {
                        activatedMerchant.set("isActivated", true);
                        if (activatedMerchant.get && activatedMerchant.get("isClosed")){
                            activatedMerchant.set("isClosed", false);
                        }

                        if (!this.get("merchants").gotCashback) {
                            this.get("merchants").gotCashback = [this.activatedMerchantId];
                        } else {
                            this.get("merchants").gotCashback.push(this.activatedMerchantId);//this.get("merchants").gotCashback = _.union(this.get("merchants").gotCashback, [this.activatedMerchantId]);
                        }

                        this.activatedMerchantId = -1;
                    }

                    //this.activatedMerchantId = -1; // because of Lacoste
                }

                if (this.activatedOffertId >= 0) {
                    if (!this.get("merchants").gotTheCode) {
                        this.get("merchants").gotTheCode = [this.activatedOffertId];
                    } else {
                        this.get("merchants").gotTheCode.push(this.activatedOffertId);//this.get("merchants").gotTheCode = _.union(this.get("merchants").get("gotTheCode"), [this.activatedOffertId]);
                    }
                    var self = this;
                    var activatedOfferMerchant = {};
                    this.get("merchants").forEach(function (merchant) {
                        if (merchant.get("Offers")) {
                            var activatedOffer  = merchant.get("Offers").findWhere({"OfferId" : +self.activatedOffertId});
                            if (activatedOffer && activatedOffer.toJSON) {
                                activatedOfferMerchant = merchant;
                            }
                        }
                    });
                    if (activatedOfferMerchant.get && activatedOfferMerchant.get("isClosed")) {
                        activatedOfferMerchant.set("isClosed", false);
                    }
                    this.activatedOffertId = -1;
                }
                /*this.activatedMerchantId = -1;
                this.activatedOffertId = -1;*/
            },
            'before-navigate': function(event) {
                log('%cAPPLICATION.JS: before-navigate', 'color: #a924d6', event);

                if(event.url.indexOf('http') === 0 || (event.data && event.data.url.indexOf('http') === 0)) {
                    log('%cHandle activation before-navigate (http)', 'color:#ff0000', event.url, API.auth.domain);
                    if (event.url.indexOf(API.auth.domain + '/offer-splash?') >= 0){
                        log('%cHandle activation before-navigate (/offer-splash?)', 'color:#ff0000');
                        this.activatedMerchantId = -1;
                        this.activatedOffertId = -1;
                        var typeActivation = event.url.match(/\d+/g);
                        if (typeActivation) {
                            if (typeActivation[0] == 1) {
                                this.activatedMerchantId = typeActivation[1];
                                log('%cHandle CASHBACK activation', 'color:#00ff00', this.activatedMerchantId);
                            } else {
                                this.activatedOffertId = typeActivation[1];
                                log('%cHandle OFFER activation', 'color:#00ff00', this.activatedOffertId);
                            }
                        }
                    }

                    if (this.activatedMerchantId < 0 && this.activatedOffertId < 0) {
                        var self = this;
                        this.get("suppressions").forEach(function (thirdLink) {
                            if (extractDomain(event.url) === thirdLink){
                                log('%cHandle 3d party affilate links', 'color:#ff0000', {thirdLink: thirdLink, currentMerch: self.get("currentMerchant")});
                                framework.extension.fireEvent('CLOSE_SLIDER', {data: true}, function(){});
                            }
                        });
                    }

                    if (this.get("tabId") === event.tabId) {
                        this.set({
                            url: event.url,
                            tabId: event.tabId
                        });

                        this.set("currentMerchant", this.getCurrentMerchant());
                    }
                }
            },

            'tab-change': function(event) {
                log('%cAPPLICATION.JS: tab-change', 'color: #a924d6', event);

                this.set({
                    url: event.url,
                    tabId: event.tabId
                });
                this.set("currentMerchant", this.getCurrentMerchant());

				var self = this;

                if (this.get("currentMerchant")) {
                	var isOffers = this.get("currentMerchant").get("Offers");
                	if (isOffers) {
                        isOffers.length ? framework.ui.button.setBadgeText(isOffers.length) : framework.ui.button.setBadgeText('');
					} else {
                        framework.ui.button.setBadgeText('');
                        var optionsOffers = {
                            success: function(){
                                isOffers = self.get("currentMerchant").get("Offers");
                                isOffers.length ? framework.ui.button.setBadgeText(isOffers.length) : framework.ui.button.setBadgeText('');
                            },
                            error: function(){}
                        };

                        this.get("currentMerchant").getOffers(optionsOffers);
					}
				} else {
                    framework.ui.button.setBadgeText('');
				}
            }
		});
    },

    initPopup: function () {
        log('%cAPPLICATION.JS: INITIALIZE POPUP', 'color: #a924d6');

        framework.ui.button.setPopup({
            'url': 'popup/popup.html',
            'width': POPUP_WIDTH,
            'height': POPUP_HEIGHT
        });
    },

    firstOpening: function () {
        var self = this;
        framework.extension.getItem('EXTENSION_FIRST_START', function (data) {
            if (!data) {
                self.uid = guid();
                EXTENSION_ID = self.uid;
                framework.extension.setItem('EXTENSION_ID', self.uid);
                framework.extension.setItem('EXTENSION_FIRST_START', true);
                googleAnalytics('ExtensionActivity', 'Install');
                framework.browser.navigate({
                    tabId: framework.browser.NEWTAB,
                    url: API.afterInstallPage.url
                });
            } else {
                framework.extension.getItem('EXTENSION_ID',  function (data) {
                    if (!data) {
                        self.uid = guid();
                        framework.extension.setItem('EXTENSION_ID', self.uid);
                    } else {
                        self.uid = data;
                    }
                    EXTENSION_ID = self.uid;
                });
            }
        });
    },

    eventsHandler: function () {
        log('%cAPPLICATION.JS: EVENTS HANDLER', 'color: #a924d6');
        var self = this;

        framework.extension.attachEvent('GET_MERCHANT', function(event, callback) {
        	if(event.url.indexOf('http') === 0 || (event.data && event.data.url.indexOf('http') === 0)) {

                var currentMerchant;// = self.get("merchants").findWhere({"Domain" : extractDomain(event.data.url || event.url)});
                //var currentMerchant = self.get("currentMerchant");
                self.get("merchants").forEach(function (elem, key) {
                    if (extractDomain(event.data.url || event.url).match(elem.get("Pattern"))) {
                        currentMerchant = elem;
                    }
                });

                if (currentMerchant) {
                    var optionsOffers = {
                        success: function(){
                            log("%cGOT OFFERS!!!", 'color: #a924d6');
                            isOffers = currentMerchant.get("Offers");
                            isOffers.length ? framework.ui.button.setBadgeText(isOffers.length) : framework.ui.button.setBadgeText('');
                            callback && callback({
                                currentMerchant: currentMerchant.toJSON(),
                                user: self.get("user").toJSON(),
                                settings: self.get("settings").toJSON(),
                                gotTheCode: self.get("merchants").gotTheCode
                            });
                        },
                        error: function(){
                            callback && callback(currentMerchant.toJSON());
                        }
                    };

                    var isOffers = currentMerchant.get("Offers");
                    if (isOffers) {
                        optionsOffers.success();
                    } else {
                        currentMerchant.getOffers(optionsOffers);
                    }
                } else {
                    framework.ui.button.setBadgeText('');
                    callback && callback(self.toJSON());
                }
			}
		});

        framework.extension.attachEvent('CLOSE_SLIDER', function(closeSlider, callback) {
            log("%cCLOSE_SLIDER", 'color: #550000');
            if (closeSlider.data) {
                self.get("currentMerchant").set("isClosed", true);
			}
            if (!self.get("merchants").closed) {
                self.get("merchants").closed = [self.get("currentMerchant").get("Id")];
            } else {
                self.get("merchants").closed.push(self.get("currentMerchant").get("Id")); //self.get("merchants").closed = _.union(self.get("merchants").closed, [self.get("currentMerchant").get("Id")]);
            }
        });
    },

    getCurrentMerchant: function() {
        //return this.get("merchants").findWhere({"Domain" : extractDomain(this.get('url'))});
        var currentMerchant;
        var self = this;
        this.get("merchants").forEach(function (elem, key) {
            if (extractDomain(self.get('url')).match(elem.get("Pattern"))) {
                currentMerchant = elem;
            }
        });
        return currentMerchant
    }
});


$(function () {
	if (framework.browser.name === 'Firefox' || navigator.userAgent.indexOf("Firefox") != -1) {
        framework.ui.button.setIcon("images/48x48-gpt-icon.png");
	}

	// CHRISTMAS
	var currentData = new Date();
    if (
        (// browser Firefox or Chromium
            framework.browser.name === 'Firefox' || navigator.userAgent.indexOf("Firefox") != -1 ||
            framework.browser.name === 'Chrome' || navigator.userAgent.indexOf("Chrome") != -1
        )
        &&
        (// from November 25 to January 1
            (currentData.getUTCDate() > 24 && currentData.getUTCMonth() === 10) ||
            (currentData.getUTCMonth() === 11) ||
            (currentData.getUTCDate() < 2 && currentData.getUTCMonth() === 0)
        )
    ) {
        framework.ui.button.setIcon("images/48x48-gpt-xmas-icon.png");
    }
    //

    window.app = new Application();

    framework.browser.attachEvent(framework.browser.TABCHANGED, function(event) {
        window.app.trigger('tab-change', event);
    });
    framework.browser.attachEvent(framework.browser.BEFORENAVIGATE, function(event) {
        window.app.trigger('before-navigate', event);
    });
    framework.browser.attachEvent(framework.browser.DOCUMENTCOMPLETE, function(event) {
        window.app.trigger('document-complete', event);
    });
    framework.extension.attachEvent('USER_LOGIN_LOGOUT', function() {
        log("%cUSER_LOGIN_LOGOUT", 'color: #aabbcc');
        if (window.app) {
            window.app.get('merchants').fetchFromServer();
            window.app.get('featuredMerchants').fetchFromServer();
            window.app.get('gamesDraw').fetchFromServer();
            if (window.app.get('merchants').gotCashback) {
                window.app.get('merchants').gotCashback = [];
            }
            if (window.app.get('merchants').gotTheCode) {
                window.app.get('merchants').gotTheCode = [];
            }
            if (window.app.get('merchants').closed) {
                window.app.get('merchants').closed = [];
            }
        }
    });
});