var _info;

function extractAsin() {
    var matches = window.location.href.match(/\/(dp|product|asin)\/([0-9A-Za-z]{10,})/);
    if (!matches || matches.length === 0)
        return false;
    return matches[2];
}

function getInfo() {
    console.log('here');
    var trs = document.querySelectorAll('#reviewsMedley #reviewSummary #histogramTable tr');
    if (!trs.length)
        trs = document.querySelectorAll('#histogramTable tr');
    var info = {};
    info.rating = [];
    info.url = '';
    info.asin = extractAsin();
    info.total = '';
    try {
        for (var i = 0; i < trs.length; ++i) {
            var percent = trs[i].querySelector('td:last-child>a');
            info.rating[i] = percent ? percent.innerText : '0%';
        }
        info.rating.reverse();
        info.url = document.querySelector('#dp-summary-see-all-reviews');
        if (info.url)
            info.url = info.url.getAttribute('href');
        else if (document.location.href.indexOf('/product-reviews/') !== -1)
            info.url = document.location.href;
        if (info.url && info.url.indexOf('http') !== 0)
            info.url = document.location.origin + info.url;
        info.total = (document.querySelector('#reviewsMedley [data-hook=total-review-count]') || document.querySelector('[data-hook=total-review-count]')).innerText;
        try {
            info.avg = (document.querySelector('#reviewsMedley [data-hook=rating-out-of-text]') || document.querySelector('[data-hook=rating-out-of-text]')).innerText.replace(/(\s+.*)/g, '');
        } catch (e) { }
        info.title = (document.querySelector('#productTitle') || document.querySelector('#ebooksProductTitle') || document.querySelector('[data-hook=product-link]')).innerText;
        info.image = (document.querySelector('#imgTagWrapperId>img') || document.querySelector('#ebooks-img-canvas>img') || document.querySelector('img[alt=\'' + info.title + '\']')).getAttribute('src');
    } catch (e) {
        console.log(e);
    }
    return info;
}

_info = getInfo();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message['action'] == 'getInfo') {
        if (sendResponse)
            sendResponse({ info: (_info.url ? _info : null) });
    }
});
