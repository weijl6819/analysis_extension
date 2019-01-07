function clickHandler(href){
    chrome.tabs.create({url: href+'?utm_medium=chrome&utm_source=notifier'});
}

$(document).ready(function() {
    var bg = chrome.extension.getBackgroundPage();
    
    var items = [];
    
    var max = 10;
    var count = 0;
    
    for (var i in bg.messages){
        if (count < max) {
            items.push('<li>'+ bg.messages[i] +'<span class="notTimestamp">'+bg.whens[i]+'</span></li>');
            count++;
        }
    }

    $('<ul/>', {'class': 'my-new-list', html: items.join('')}).appendTo('body');

    chrome.browserAction.setBadgeText({'text': ''});
    
    $('a').live('click', function() {
         clickHandler(this.href);
         return false;
    });
});