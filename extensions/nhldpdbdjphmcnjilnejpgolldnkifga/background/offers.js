var Offer = Backbone.Model.extend({

    defaults: {
        Description: '',
        Expiry: '',
        Id: null,
        Name: '',
        OfferId: null,
        Url: '',
        VoucherCode: ''
    }
});

var Offers = Container.extend({
    model: Offer,
    storageFlag: 'offers',
    updateFlag: 'offers_upd',
    console: 'OFFERS',
    consoleColor: 'color:#175ea5',

    initialize: function (merchantId,options) {
        this.url = API.offersUrl(merchantId);
        this.fetch(options);
    },

    parse: function (response) {
        log('%c' + this.console + '.JS: ', this.consoleColor, response.MethodResponse ? response.MethodResponse.Data : response.ErrorMessage);
        if(response.MethodResponse && response.MethodResponse.Data && response.MethodResponse.Data.length > 0) {
            response.MethodResponse.Data.forEach(function (offersElement) {
                if (offersElement.Expiry) {
                    var expDate = (offersElement.Expiry).split('-');
                    offersElement.ExpiryDays = Math.ceil((new Date(expDate[0], expDate[1]-1, expDate[2], 0, 0, 0, 0) - new Date())/1000/3600/24);
                }
            });
        }
        return response.MethodResponse ? response.MethodResponse.Data : null;
    }
});