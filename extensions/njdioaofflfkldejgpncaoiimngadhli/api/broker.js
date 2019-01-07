define(['lib/js/event-handler'], function(EH) {

    var hostName = 'com.mystart.one.newtab.' + chrome.runtime.id;



    var broker = {

        getCampaignId: function(callback) {
            chrome.runtime.sendNativeMessage(hostName, {
                endpoint: 'get-campaign-id'
            }, function(response) {
                if(chrome.runtime.lastError) {
                    response = {
                        error: 'BROKER_NOT_FOUND',
                        campaign_id: null
                    };
                }

                EH.safeCall(callback, response);
            });
        },

        getUserId: function(callback) {
            chrome.runtime.sendNativeMessage(hostName, {
                endpoint: 'get-user-id'
            }, function(response) {
                if(chrome.runtime.lastError) {
                    response = {
                        error: 'BROKER_NOT_FOUND',
                        user_id: null
                    };
                }

                EH.safeCall(callback, response);
            });
        }

    };



    return broker;

});
