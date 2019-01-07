var settingsController = (function () {

    var localStorageClient = chrome.extension.getBackgroundPage().localStorageClient;
    var cniApiClient = chrome.extension.getBackgroundPage().cniApiClient;

    function init() {
        $(document).ready(function () {
            refreshList();
        });
    }

    function refreshList() {
        cniApiClient.getUserAllSites(function (sites) {

            showSelectableForRemove(sites, function () {
                refreshList();
            }, function () {
                displayError('Ooops, we\'ve got some problems!');
            });

        }, function (errors) {
            displayError('Ooops, we\'ve got some problems!');
        });


        cniApiClient.getUserData(function (authHeader) {

            if (authHeader == undefined) {
                localStorageClient.getAllValues(function (values) {
                    var allSites = [];

                    for (var key in values) {
                        if (values.hasOwnProperty(key) && key.startsWith('SiteId=')) {
                            allSites.push(values[key]);
                        }
                    }

                    showSelectableForRemove(allSites, function () {
                        refreshList();
                    }, function () {
                        displayError('Ooops, we\'ve got some problems!');
                    });
                });
            }
        });
    }

    function displayError(message) {
        var messageElement = $('#d-message');
        messageElement.addClass('d-error-message');
        messageElement.text(message);
        messageElement.show();
    }

    return {
        init: init
    };

})();

settingsController.init();





