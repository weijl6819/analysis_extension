var Merchant = Backbone.Model.extend({

    defaults: {
        Description: '',
        Domain: '',
        Id: null,
        Logo: '',
        Name: '',
        Pattern: '',
        Reward: '',
        Url: '',
        isActivated: false,
        isClosed: false
    },

    initialize: function () {},

    getOffers: function(options) {

        var self = this;
        var offersOptions = {
            success: function () {
                /*if(self.get("Offers")) {
                    self.get("Offers").each(function (offersElement) {
                        if (offersElement.get("Expiry")) {
                            var expDate = (offersElement.get("Expiry")).split('-');
                            offersElement.set("ExpiryDays", Math.ceil((new Date(expDate[0], expDate[1]-1, expDate[2], 0, 0, 0, 0) - new Date())/1000/3600/24));
                        }
                    });
                }*/
            },
            error: function () {}
        };
        var thisOffersOptions = {};
        if (options) {
            thisOffersOptions.success = function () {
                options.success && options.success();
                (offersOptions && offersOptions.success) && offersOptions.success();
            };
            thisOffersOptions.error = function () {
                options.error && options.error();
                (offersOptions && offersOptions.error) && offersOptions.error();
            };
        } else {
            thisOffersOptions = offersOptions;
        }

        this.set({
            Offers: new Offers(this.get('Id'),thisOffersOptions)
        });
    }
});

var Merchants = Container.extend({
    model: Merchant,
    url: API.merchants.url,
    updatePeriod: API.merchants.period,
    storageFlag: 'merchants',
    updateFlag: 'merchants_upd',
    console: 'MERCHANTS',
    consoleColor: 'color:#17a584',

    currentMerchant: function () {
        return this.merchants.match(getDomain(this.get('url')));
    },

    parse: function (response) {
        log('%c' + this.console + '.JS: ' + this.console, this.consoleColor, response.MethodResponse ? response.MethodResponse.Data : response.ErrorMessage);
        return response.MethodResponse ? response.MethodResponse.Data : response.ErrorMessage;
    }
});

var FeaturedMerchants = Merchants.extend({
    model: Merchant,
    url: API.featuredMerchants.url,
    updatePeriod: API.featuredMerchants.period,
    storageFlag: 'featuredMerchants',
    updateFlag: 'featuredMerchantsUpd',
    console: 'FEATUREDMERCHANTS',
    consoleColor: 'color:#32dbb3'
});