framework.extension.attachEvent('GOOGLE_ANALYTICS_EVENT', function(event) {
    var query = 'https://www.google-analytics.com/collect?v=1&t=event&tid='+ GA_SAND_BOX_ID
        + '&cid=' + EXTENSION_ID
        + '&ec=' + event.data.eventCategory
        + '&ea=' + event.data.eventAction
        + '&el=extension';

    log('%cGA.JS: GA-QUERY', 'color: #6824d6', query);

    $.post(query);
});
