var memory = 0;
var vm = new Vue({
    el: '#wrapper',
    data: {
        count: 0,
        distinct: 0,
        week_count: 0,
        week_distinct: 0,
        month_count: 0,
        month_distinct: 0,
        nicking: !1,
        error: !1,
        facebook: !1,
        enabled: !0,
        mem_use: '9%',
        cpu_use: '9%',
    },
    ready: function() {
        this.getAdCount();
    },
    methods:{
        getAdCount:function() {
            Ext.getCurrentTab(function (tab) {
                var domain = Ext.getDomain(tab.url);
                if(domain == 'facebook')
                    vm.$set("facebook", !0);
                else
                    vm.$set("facebook", !1);
                var ads = Ext.getStorage(Ext.col.AD) || {};
                var ad = ads[domain];
                if(isEmpty(ad))
                    return;
                vm.$set("count", parseInt(ad["_ad_total"]));
                vm.$set("distinct", parseInt(ad["_ad_distinct"]));
                vm.$set("week_count", parseInt(ad["_week_total"]));
                vm.$set("week_distinct", parseInt(ad["_week_distinct"]));
                vm.$set("month_count", parseInt(ad["_month_total"]));
                vm.$set("month_distinct", parseInt(ad["_month_distinct"]));
            });
            this.calc_mem_use();
            this.calc_cpu_use();
            this.getMemory();

        },
        like: function() {
            var like = Ext.api.LIKE;
            window.open(like, "_blank");
        },
        shareit: function() {
            window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent("https://chrome.google.com/webstore/detail/greenboost-boost-clean-ad/nihmbbcpceihmejjmbfhenfobdhdabng"), "facebook-share", "menubar=no,location=no,resizable=yes,scrollbars=yes,toolbar=no,width=600,height=650,top=50,left=50");
        },
        home: function() {
            window.open('home.html', '_blank');
        },
        setting: function() {
            window.open('settings.html', '_blank');
        },
        calc_mem_use: function() {
            calc_mem_ratio();
        },
        calc_cpu_use: function() {
            calc_cpu_ratio();
        },
        oneTab: function(){
            oneTab();
        },
        getMemory: function(){
            chrome.system.memory.getInfo(function callback(info){
                memory = parseInt(info.capacity);
            });
        }
    }
});

(function() {
    var statsStr = vAPI.i18n('totalBlockedStats');
    var scopeToSrcHostnameMap = {
        '/': '*',
        '.': ''
    };
    var messaging = vAPI.messaging;
    var formatNumber = function(count) {
        return typeof count === 'number' ? count.toLocaleString() : '';
    };

    function calc_speed(){
        var speed = calc_average_speed(memory);
        speed = isNaN(speed) ? 0 : speed.toFixed(0);
        speed = speed >= 80 ? '≥80' : speed;
        uDom.nodeFromId('stats-speed').textContent = speed + '%';
    }

    var renderBlocked = function() {
        totalBlocked = popupData.globalBlockedRequestCount;
        uDom.nodeFromId('stats-total').textContent = totalBlocked;

        var spaces = getNormalizedSpace(totalBlocked * 5 + getTotalTabs() * 2);
        uDom.nodeFromId('stats-space').textContent = spaces;
        
        if(memory == 0){
            chrome.system.memory.getInfo(function callback(info){
                memory = parseInt(info.capacity);
                calc_speed();
            });
        } else {
            calc_speed();
        }
    };

    var cachePopupData = function(data) {
        popupData = {};
        scopeToSrcHostnameMap['.'] = '';
        hostnameToSortableTokenMap = {};

        if ( typeof data !== 'object' ) {
            return popupData;
        }
        popupData = data;
        scopeToSrcHostnameMap['.'] = popupData.pageHostname || '';
        var hostnameDict = popupData.hostnameDict;
        if ( typeof hostnameDict !== 'object' ) {
            return popupData;
        }
        var domain, prefix;
        for ( var hostname in hostnameDict ) {
            if ( hostnameDict.hasOwnProperty(hostname) === false ) {
                continue;
            }
            domain = hostnameDict[hostname].domain;
            prefix = hostname.slice(0, 0 - domain.length);
            if ( domain === popupData.pageDomain ) {
                domain = '\u0020';
            }
            hostnameToSortableTokenMap[hostname] = domain + prefix.split('.').reverse().join('.');
        }
        return popupData;
    };

    var getPopupData = function(tabId) {
        var onDataReceived = function(response) {
            cachePopupData(response);
            renderBlocked();
        };
        messaging.send(
            'popupPanel',
            { what: 'getPopupData', tabId: tabId },
            onDataReceived
        );
    };

    (function() {
        // add google analytics event
        addAnalytics('onetab');
        addAnalytics('home');
        addAnalytics('setting');
        addAnalytics('shareit');

        var tabId = null;
        var matches = window.location.search.match(/[\?&]tabId=([^&]+)/);
        if ( matches && matches.length === 2 ) {
            tabId = matches[1];
        }
        getPopupData(tabId);
    })();
})();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', Ext.analytics_code]);
_gaq.push(['_trackPageview']);

function addAnalytics(ducid){
    document.getElementById(ducid).addEventListener('click', trackButtonClick);
}

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = Ext.ga_src;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

function trackButtonClick(e) {
    _gaq.push(['_trackEvent', e.target.id, 'clicked']);
}