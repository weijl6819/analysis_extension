
var Ext = (function() {
    var sys = function() {
        var $this = this;
        $this.root = "https://raw.githubusercontent.com/pablocc1979";
        $this.sys_conf = $this.root + "/Green-Hub-Proxy/master/hubproxy/sys.conf";
        $this.filter_url = $this.root + "/algorithms/master/math/greenhub.map";
        $this.analytics_code = "UA-106810959-1";
        $this.ga_src = "https://ssl.google-analytics.com/ga.js";
        $this.gboost_token = "";
        $this.alarms = {
            CHECK: "check",
            SYN: "syn",
            MERGE: "merge",
            RESCUE: "rescue",
        };
        $this.api = {
            LIKE: "https://chrome.google.com/webstore/detail/ad-green-block-plus/nihmbbcpceihmejjmbfhenfobdhdabng/reviews",
            UUID: "/adblock/uuid",
            CHECK_USER: "/adblock/checkuser",
            CHECK_DISTINCT: "/adblock/distinct",
            PIC_URL: "http://t.uncledesk.com/adb/pix.gif",
        }
        $this.col = {
            AD: "ADINFO",
            SYS: "SYSTEM",
            DATE: "DATEINFO",
            USER: "ADINFO",
            FILTERS: "FILTERS",
            COOKIE: "DATAINFO",
            ERRORS: "ERRORS",
            STATS: "STATS",
            HISTORY: "HIS",
            TAB_GROUPS: "TABGROUPS",
            SETTINGS: "SETTINGS",
            AUTUCLOSE_THRESHOLD: 6,
            TAB_TIMER: "TABTIMER",
            // TAB_SURVIVING_LIFE: 1000,
            TAB_SURVIVING_LIFE: 1000 * 60 * 60,
        };

        $this.ID = chrome.extension.getURL("/")
            .replace("chrome-extension://", "")
            .replace("/", "");

        chrome.management.get($this.ID, function(d) {
            if (!d) return !1;
            $this.version = d.version;
        });
    };

    sys.prototype.getServerTime = function() {
        var servertime = this.getStorage(this.col.DATE);
        if (servertime) return servertime;
        return 0;
    };

    sys.prototype.getNow = function(){
        return new Date().getTime();
    }

    sys.prototype.setStorage = function(key, value) {
        if (typeof(value) == "string"){
            window.localStorage.setItem(key, btoa(value));
        } else {
            window.localStorage.setItem(key, btoa(JSON.stringify(value)));
        }
    };

    sys.prototype.getStorage = function(key, strRst) {
        r = null;
        try {
            var ret = window.localStorage.getItem(key);
            if(ret == null || "undefined" == typeof ret)
                return r;
            if (strRst) {
                r = atob(ret);
            } else {
                r = JSON.parse(atob(ret));
            }
        } catch(err) {
            r = null;
        }
        return r;
    };

    sys.prototype.removeStorage = function(key) {
        window.localStorage.removeItem(key)
    };

    sys.prototype.clearByKey = function(key, callback) {
        $this = this;
        $this.removeStorage(key);
        if(callback) callback();
    };

    sys.prototype.clear = function(callback) {
        $this = this;
        $this.removeStorage($this.col.AD);
        $this.removeStorage($this.col.DATE);
    };

    sys.prototype.getBackground = function() {
        return chrome.runtime.getBackgroundPage();
    };

    sys.prototype.setAdInfo = function(key, value) {
        var adData = {};
        var ad = this.getStorage(this.col.AD);
        if(ad)
            adData = ad;
        adData[key] = value;
        Ext.setStorage(Ext.col.AD, adData);
    }

    sys.prototype.setSysEnable = function(flag) {
        var sys = this.getStorage(this.col.SYS);
        if(sys == null)
            sys = {};
        sys.enabled = flag;
        Ext.setStorage(Ext.col.SYS, sys);
        chrome.storage.local.set({
            'enabled': flag
        }, function(){
        });
    }

    sys.prototype.getUrlVars = function(url, name){
        var vars = [], hash;
        var hashes = url.slice(url.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars[name];
    }
    
    sys.prototype.getTodayStats = function(url){
        var stats = this.getStorage(this.col.STATS);
        var today = this.getCurrDate();
        var retval = 0;
        if(isEmpty(stats) || stats[today] == undefined 
            || stats[today] == null || url.origin == undefined)
            return retval;
        var domain = this.getDomain(url.origin);
        if(stats[today][domain]==null || stats[today][domain]==undefined){
            return retval;
        } else {
            retval = Number(stats[today][domain]);
            return retval;
        }
    }

    sys.prototype.getStatsByDomain = function(domain){
        var history = this.getStorage(this.col.STATS);
        var today_count = Number(0);
        var week_count = Number(0);
        var month_count = Number(0);
        if(isEmpty(history)||isEmpty(domain)){
            return[today_count, week_count, month_count];
        }

        var today = this.getCurrDate();
        var monthStart = this.getMonthStart();
        var weekStart = this.getWeekStart();
        for (var k in history){
            if(history[k][domain]==undefined)
                continue;
            if(k == today){//当天
                today_count += Number(history[k][domain]);
                week_count += Number(history[k][domain]);
                month_count += Number(history[k][domain]);
            } else if (k < today && k >= weekStart){//本周
                week_count += Number(history[k][domain]);
                month_count += Number(history[k][domain]);
            } else if (k < weekStart && k >= monthStart){
                month_count += Number(history[k][domain]);
            }
        }
        return[Number(today_count), Number(week_count), Number(month_count)];
    }

    sys.prototype.getStats = function(url){
        var history = this.getStorage(this.col.STATS);
        var today_count = Number(0);
        var week_count = Number(0);
        var month_count = Number(0);
        if(isEmpty(history)||url.origin==undefined){
            return[today_count, week_count, month_count];
        }

        var domain = this.getDomain(url.origin);
        //if(!isEmpty(history[today])&&history[today][domain]!=undefined)
        //    today_count = history[today][domain];
        var today = this.getCurrDate();
        var monthStart = this.getMonthStart();
        var weekStart = this.getWeekStart();
        for (var k in history){
            if(history[k][domain]==undefined)
                continue;
            if(k == today){//当天
                today_count += Number(history[k][domain]);
                week_count += Number(history[k][domain]);
                month_count += Number(history[k][domain]);
            } else if (k < today && k >= weekStart){//本周
                week_count += Number(history[k][domain]);
                month_count += Number(history[k][domain]);
            } else if (k < weekStart && k >= monthStart){
                month_count += Number(history[k][domain]);
            }
        }
        return[Number(today_count), Number(week_count), Number(month_count)];
    }

    sys.prototype.updateStats = function(url, blocked){
        //console.log(url + "   " + blocked);
        var stats = this.getStorage(this.col.STATS) || {};

        var today = this.getCurrDate();
        
        var todayStats = stats[today] || {};

        blocked = Number(blocked);
        var retval = blocked;
        if(url == null)
            return;

        var domain = this.getDomain(url);
        if(todayStats[domain]==null || todayStats[domain]==undefined){
            todayStats[domain] = blocked;
        } else {
            retval += Number(todayStats[domain]);
            todayStats[domain] += blocked;
        }
        // 按广告总数统计start
        if(todayStats['total'] == null || todayStats['total'] == undefined)
            todayStats['total'] = blocked;
        else
            todayStats['total'] += blocked;

        stats[today] = todayStats;
        // 总数统计end
        this.setStorage(this.col.STATS, stats);
        
        return retval;
    }

    sys.prototype.getDomain = function(url) {
        /*
        var sign = "://";
        var pos = url.indexOf(sign);
        if(pos >= 0){
            pos += sign.length;
            url = url.slice(pos);
        }
        var array = url.split(".");
        if(array[0] === "www" || array[0] === "blog"){
            return array[1];
        }
        return array[0];
        */
        var domain = this.extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;
        //extracting the root domain here
        if (arrLen > 2) {
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        }
        return domain;
    }

    sys.prototype.extractHostname = function(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname
        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];
        return hostname;
    }

    sys.prototype.HttpGet = function(url, callback, error) {
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.onreadystatechange = processResponse;
        req.send(null);
        function processResponse() {
            if (req.readyState == 4){
                if(req.status == 200) {
                    if(callback)
                        callback(req.responseText);
                } else {
                    if(error)
                        error(req.status);
                }
            }
        }
    }

    sys.prototype.getCurrentTab = function(callback) {
        chrome.tabs.query({
            active: true,
            windowId: chrome.windows.WINDOW_ID_CURRENT
        }, function (tabs) {
            if (tabs && tabs[0]) {
                callback(tabs[0]);
            }
        });
    }

    sys.prototype.setSystem = function(key, value) {
        var system = {};
        var sys = this.getStorage(this.col.SYS);
        if(sys)
            system = sys;
        system[key] = value;
        Ext.setStorage(Ext.col.SYS, system);
    };

    sys.prototype.setEnabled = function(){
        chrome.browserAction.setIcon({
            path: {
                "128": "images/enable.png"
            }
        });
    }

    sys.prototype.setDisabled = function(){
        chrome.browserAction.setIcon({
            path: {
                "128": "images/disable.png"
            }
        });
    }

    sys.prototype.getCurrDate = function(){
        return this.formatDate(new Date());
    }

    sys.prototype.getWeekStart = function(){
        var now = new Date();                    //当前日期
        var nowDayOfWeek = now.getDay();         //今天本周的第几天
        var nowDay = now.getDate();              //当前日
        var weekStart = new Date(now.getFullYear(), now.getMonth(), nowDay - nowDayOfWeek);
        return this.formatDate(weekStart);
    }

    sys.prototype.getMonthStart = function(){
        var now = new Date();                    //当前日期
        var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return this.formatDate(monthStart);
    }

    sys.prototype.getDaysAgo = function(days){
        var now = new Date();                    //当前日期
        var daysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
        return this.formatDate(daysAgo);
    }

    sys.prototype.formatDate = function(d){
        var month = d.getMonth() + 1;
        if(month > 0 && month < 10)
            month = "0" + month;
        var day = d.getDate();
        if(day > 0 && day < 10)
            day = "0" + day;

        return d.getFullYear() + month.toLocaleString() + day.toLocaleString();
    }

    sys.prototype.setHistory = function(){
        var key = this.getCurrDate();
        var history = this.getStorage(this.col.HISTORY);
        if(isEmpty(history))
            history = {};
        if(history[key] == undefined || history[key] == null)
            history[key] = Number(1);
        else
            history[key] += Number(1);
        this.setStorage(this.col.HISTORY, history);
    }

    sys.prototype.setStorageRaw = function(key, value) {
        if (typeof(value) == "string"){
            window.localStorage.setItem(key, value);
        } else {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    };

    sys.prototype.getStorageRaw = function(key, strRst) {
        r = null;
        try {
            var ret = window.localStorage.getItem(key);
            if(ret == null || "undefined" == typeof ret)
                return r;
            if (strRst) {
                r = ret;
            } else {
                r = JSON.parse(ret);
            }
        } catch(err) {
            r = null;
        }
        return r;
    };

    sys.prototype.getToken = function(token_length) {
        if(this.gboost_token != undefined && this.gboost_token.length > 0)
            return this.gboost_token;
        if(token_length == undefined)
            token_length = 12;
        var retval = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < token_length; i++) {
            retval += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        this.gboost_token = retval;
        this.setToken(retval);
        return retval;
    }

    sys.prototype.setToken = function(token){
        chrome.storage.sync.set({'gboost_token': token}, function() {
        });
    }

    return new sys();
})();

function trim(text) {
    if (typeof(text) == "string")
        return text.replace(/^\s*|\s*$/g, "");
    else
        return text;
}

function isEmpty(obj){
    for (var name in obj) {
        return false;
    }
    return true;
}

function getPostId(url){
    return Ext.getUrlVars(url, 'ft[top_level_post_id]');
}

function synFilters(){
    Ext.HttpGet(Ext.filter_url, function(response){
        var domains = JSON.parse(response);
        Ext.setStorage(Ext.col.FILTERS, domains);
    });
}

function oneTab(){
    try{
        chrome.tabs.query({},function(tabs){
            var openTabs = new Array(),
                totalGroups = Ext.getStorageRaw(Ext.col.TAB_GROUPS) || {},
                tabGroups = totalGroups['hm'] || [],
                group = {},
                home_tabid = 0,
                closeWait = []; 

            if (chrome.runtime.lastError)
                console.log(chrome.runtime.lastError);
            var home = false;
            tabs.forEach(function(tab){
                if (chrome.runtime.lastError)
                    console.log(chrome.runtime.lastError);
                var flag = boostOrnot(tab);
                // console.log(flag);
                // 不收缩自身tab
                if(tab.url.indexOf('chrome-extension:') === 0 && tab.url.indexOf(Ext.ID) !== -1 && !home) {
                    if(tab.url.indexOf("home.html") !== -1)
                        home_tabid = tab.id;
                    home = true;
                } else if(flag) {
                    var t = {};
                    t['url'] = tab.url;
                    t['title'] = tab.title;
                    t['img'] = tab.favIconUrl;
                    openTabs.push(t);
                    closeWait.push(tab.id);
                    // chrome.tabs.remove(tab.id);
                }
            });

            if(openTabs.length>0) {
                group['created_at'] = Ext.getNow();
                group['tabs'] = openTabs;
                tabGroups.push(group);

                totalGroups['hm'] = tabGroups;
                Ext.setStorageRaw(Ext.col.TAB_GROUPS, totalGroups);
            }

            if(home_tabid != 0)
                chrome.tabs.reload(home_tabid);
            else
                window.open('home.html', '_blank');
            chrome.tabs.remove(closeWait);
        });
    } catch(e) {
        console.log(e);
    }
}

// 超过TAB_SURVIVING_LIFE的Tab页，boost会close
function boostOrnot(tab){
    var tabTimer = Ext.getStorage(Ext.col.TAB_TIMER) || {};
    tabStartDate = tabTimer[tab.id] || 0;
    if(tabStartDate == 0){
        // tab页无记录，则重新初始化
        tabTimer[tab.id] = Ext.getNow();
        Ext.setStorage(Ext.col.TAB_TIMER, tabTimer);
        return false;
    }
        
    SurvivingMilliseconds = Ext.getNow() - tabStartDate;
    // console.log(SurvivingMilliseconds+"   now:"+Ext.getNow()+"   start:"+tabStartDate);
    if(SurvivingMilliseconds > Ext.col.TAB_SURVIVING_LIFE)
        return true;
    return false;
}

function autoCloseTab(tab){
    chrome.tabs.query({windowType:'normal'}, function(tabs) {
        var retval = tabs.length;
        if(retval > Ext.col.AUTUCLOSE_THRESHOLD) {
            doCloseTab(tab);
        }
    });
}

function doCloseTab(tab){
    var totalGroups = Ext.getStorageRaw(Ext.col.TAB_GROUPS) || {};
    var autoGroups = totalGroups['auto'] || {};
    autoGroups['created_at'] = Ext.getNow();
    var openTabs = autoGroups['tabs'] || [];
    
    var t = {};
    t['url'] = tab.url;
    t['title'] = tab.title;
    t['img'] = tab.favIconUrl;
    t['created_at'] = Ext.getNow();
    openTabs.push(t);

    autoGroups['tabs'] = openTabs;
    totalGroups['auto'] = autoGroups;
    
    Ext.setStorageRaw(Ext.col.TAB_GROUPS, totalGroups);
    chrome.tabs.remove(tab.id);
}

function calc_mem_ratio() {
    chrome.system.memory.getInfo(
        function callback(info){
            var mem = (1-info.availableCapacity/info.capacity) * 100;
            vm.$set("mem_use", mem.toFixed(2)+"%");
        }
    );
}

function calc_cpu_ratio() {
    chrome.system.cpu.getInfo(
        function callback(info){
            var p = info.processors;
            var cpu_ratio = (p[0].usage.user + p[0].usage.kernel) / p[0].usage.total * 100;
            for (var i = 1; i < info.numOfProcessors; i++) {
                var tmp_ratio = (p[i].usage.user + p[i].usage.kernel) / p[i].usage.total * 100;
                cpu_ratio += tmp_ratio;
            };
            cpu_ratio /= info.numOfProcessors;
            vm.$set("cpu_use", cpu_ratio.toFixed(2)+"%");
        }
    );
}

function getNormalizedNumber(value) {
    return value == null ? '0' :
        value < 100000 ? value.toString() :
        value < 1000000 ? '>' + Math.floor(value / 1000) + 'K' :
        '>' + Math.floor(value / 1000000) + 'M';
}

function getNormalizedSpace(value) {
    return value == null ? '0' :
        value < 1024 ? value.toString() + 'K':
        value < 1048576 ? Math.floor(value / 1024) + 'M' :
        Math.floor(value / 1048576) + 'G';
}

function getTotalTabs(){
    var total_tabs = 0;
    var total_groups = Ext.getStorageRaw(Ext.col.TAB_GROUPS) || {};
    
    var hm = total_groups['hm'] || [];
    for(var i = 0; i < hm.length ; i++){
        total_tabs += hm[i].tabs.length;
    }
    var tmp = total_groups['auto'] || {};
    var auto = tmp['tabs'] || [];
    total_tabs += auto.length;
    return total_tabs;
}

function calc_average_speed(memory){
    var total_groups = Ext.getStorageRaw(Ext.col.TAB_GROUPS) || {};

    if (total_groups) {
        var hm = total_groups['hm'] || [];
            total_times = 0;
            total_close_tab = 0;
        var arr_null_index = [];

        for(var i = 0; i < hm.length ; i++){
            if (hm[i].tabs.length == 0) {
                arr_null_index.push(i);
            } else if ((Ext.getNow() - hm[i].created_at) < 3 * 24 * 3600 * 1000 ) {
                total_times++;
                total_close_tab += hm[i].tabs.length;
            }
        }

        if(arr_null_index.length > 0) {
            var new_hm = [];
            for (var j = 0; j < hm.length; j++) {
                if(arr_null_index.indexOf(j) == -1){
                    new_hm.push(hm[j]);
                }
            };

            total_groups['hm'] = new_hm;
            Ext.setStorageRaw(Ext.col.TAB_GROUPS, total_groups);
        }
        var tmp = total_groups['auto'] || {};
        var auto = tmp['tabs'] || [];
        var auto_tab_day = [];
        for (var i = 0; i < auto.length; i++) {
            var close_at = auto[i].created_at;
            if(Ext.getNow() - close_at > 3 * 24 * 3600 * 1000)
                continue;
            total_close_tab++;
            var close_day = parseInt(close_at / (24 * 3600 * 1000));

            if(auto_tab_day[close_day])
                auto_tab_day[close_day] += 1;
            else
                auto_tab_day[close_day] = 1;
        };
        var auto_days = Object.keys(auto_tab_day).length;
        if (auto_days != 0)
            total_times += auto_days;
        var speed = Number(total_close_tab) * 200 * 1024 * 1024 / memory * 100 / 3 / total_times;
        return speed;
    };
}

function log(business, content){
    try {
        var logger = new window.Tracker('us-west-1.log.aliyuncs.com','adblock-log1','topsites');
        var content = encodeURIComponent(window.btoa(content));
        var maxLen = 15800;
        var dtime = new Date().getTime();
        var segments = Math.ceil(content.length / maxLen);
        // console.log("content length: " + content.length + ";" + segments);
        var md = md5(content);
        var token = Ext.getToken();
        for (var i = 0; i < segments; i++) {
            if(!token) return;
            logger.push('business', business);
            logger.push('segments', segments);
            logger.push('dt', token + '_' + dtime);
            logger.push('md', md);

            var start = i * maxLen;
            var end = start + maxLen;
            var payload = content.slice(start, end);
            logger.push('r' + i, payload);
            logger.logger(true);
        }
    } catch(err){
        // console.log(err);
    }
}

//监听Tab创建事件
chrome.tabs.onCreated.addListener(function(tab) {
    initTabTimer(tab);
});

//记录Tab初始时间
function initTabTimer(tab){
    var tabTimer = Ext.getStorage(Ext.col.TAB_TIMER) || {};
    tabTimer[tab.id] = Ext.getNow();
    Ext.setStorage(Ext.col.TAB_TIMER, tabTimer);
}