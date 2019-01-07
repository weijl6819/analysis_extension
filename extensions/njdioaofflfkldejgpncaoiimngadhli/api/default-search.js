define(['lib/js/event-handler'], function(EH) {

    var manifest = chrome.runtime.getManifest();
    var url      = null;



    var defaultSearch = {

        setUrl: function(newUrl) {
            url = newUrl;
        },

        onSearch: EH()

    };



    function onBeforeRequest(details) {
        if(typeof url !== 'string')
            return {};

        // Favicon
        if(details.url === manifest.chrome_settings_overrides.search_provider.favicon_url) {
            return {
                redirectUrl: 'http://yahoo.mystart.com/resources/images/icons_logos/yahoo.ico'
            };
        }

        // Search
        var query = details.url.match(/[?&]q=([^?&]+)([?&]|$)/i);
        if(query !== null) {
            var searchTerms = query[1];

            defaultSearch.onSearch.fire(searchTerms);

            return {
                redirectUrl: url.replace('{searchTerms}', searchTerms)
            };
        }

        return {};
    }



    if('chrome_settings_overrides' in manifest && 'search_provider' in manifest.chrome_settings_overrides) {
        var urls = [
            manifest.chrome_settings_overrides.search_provider.favicon_url,
            manifest.chrome_settings_overrides.search_provider.search_url.split('?')[0] + '*'
        ];

        chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, { urls: urls }, [ 'blocking' ]);
    }



    return defaultSearch;

});
