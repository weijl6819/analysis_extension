(function () {
    log('POPUP.JS: INJECT CSS');
    injectCSS();
})();

$(function init() {
    if (typeof framework === "undefined") {
        setTimeout(init, 100);
        return;
    }
    log('POPUP.JS: CREATE POPUP MODEL');
    window.popup = new Popup({
        bg: framework.extension.getBackgroundPage()
    });

});

var Popup = Backbone.Model.extend({

    initialize: function () {
        log('POPUP.JS: INITIALIZE POPUP', this);

        _.extend(this, _.object(
            [
                "app",
                "user",
                "merchants",
                "featuredMerchants",
                "surveys",
                "gamesDraw",
                "currentMerchant",
                "settings"
            ],
            [
                this.get("bg").app,
                this.get("bg").app.get('user'),
                this.get("bg").app.get('merchants'),
                this.get("bg").app.get('featuredMerchants'),
                this.get("bg").app.get('surveys'),
                this.get("bg").app.get('gamesDraw'),
                this.get("bg").app.get('currentMerchant'),
                this.get("bg").app.get('settings')
            ]
        ));

        var self = this;

        if (this.currentMerchant !== undefined && this.currentMerchant.attributes !== undefined) {
            var optionsOffers = {
                success: function () {
                    if (self.app.get("merchants").gotTheCode) {
                        self.app.get("merchants").gotTheCode.forEach(function (element) {
                            var gotCode = self.currentMerchant.get("Offers").findWhere({"OfferId": +element});
                            if (gotCode) {
                                gotCode.set("getTheCode", true);
                            }
                        });
                    }
                    self.layout = new PopupView({
                        model: {
                            merchants: self.merchants.toJSON(),
                            featuredMerchants: self.featuredMerchants.toJSON(),
                            surveys: self.surveys,
                            gamesDraw: self.gamesDraw.toJSON(),
                            user: self.user.toJSON(),
                            currentMerchant: self.currentMerchant.toJSON(),
                            offers: self.currentMerchant.get("Offers").toJSON(),
                            app: self.app,
                            settings: self.settings
                        }
                    }).render();
                },
                error: function () {
                    self.layout = new PopupView({
                        model: {
                            merchants: self.merchants.toJSON(),
                            featuredMerchants: self.featuredMerchants.toJSON(),
                            surveys: self.surveys,
                            gamesDraw: self.gamesDraw.toJSON(),
                            user: self.user.toJSON(),
                            currentMerchant: self.currentMerchant.toJSON(),
                            app: self.app,
                            settings: self.settings
                        }
                    }).render();
                }
            };

            var isOffers = self.currentMerchant.get("Offers");
            if (isOffers) {
                optionsOffers.success();
            } else {
                this.currentMerchant.getOffers(optionsOffers);
            }
        } else {
            this.layout = new PopupView({
                model: {
                    merchants: this.merchants.toJSON(),
                    featuredMerchants: this.featuredMerchants.toJSON(),
                    surveys: this.surveys,
                    gamesDraw: this.gamesDraw.toJSON(),
                    user: this.user.toJSON(),
                    app: this.app,
                    settings: this.settings
                }
            }).render();
        }
    }
});