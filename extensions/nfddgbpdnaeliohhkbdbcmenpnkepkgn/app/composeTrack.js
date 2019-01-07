
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
// similar function at net-back/lib/gmail.js
var injectTracker = function (composeView) {
    var body = composeView.getHTMLContent();
    // remove existing open tracker
    if (body.match('<img id="nathansemailtooltracker" src="')) {
        body = body.replace(/<img id="nathansemailtooltracker" src="[^>]+>/, '');
    }
    // remove existing link tracker
    var linkTrackerP = new RegExp('<a(.+?)href=["\']+' + apis.track_link + '\\?id=[^&]+&url=([^"\']+)["\']+', 'g');
    body = body.replace(linkTrackerP, function (match, p1, p2) {
        return '<a' + p1 + 'href="' + decodeURIComponent(p2) + '"';
    });
    // set open tracker
    var trackId = getUniqueId();
    var tracker = '<img id="nathansemailtooltracker" src="' + apis.track_open + '?id=' + trackId + '" width="1" height="1" border="0" style="position: absolute; left: 0; top: 0; width: 1px; height: 1px; opacity: 0.01;">';
    // setup link tracking
    /*
    linkTrackerP = new RegExp('<a(.+?)href=["\']+([^"\']+)["\']+', 'g');
    body = body.replace(linkTrackerP, function (match, p1, p2) {
        if (p2.indexOf('http') !== 0)
            return '<a' + p1 + 'href="' + p2 + '"';
        return '<a' + p1 + 'href="' + apis.track_link + '?id=' + trackId + '&amp;url=' + encodeURIComponent(p2) + '"';
    });*/
    // compose
    body += tracker;
    composeView.setBodyHTML(body);
    return trackId;
};


var toggleTrack = function (composeView, sdk, event) {
    var track = composeView.track;
    if (!event) {
        // initialize
    } else {
        // toggle
        if (composeView.afuArm &&
            composeView.afuArm.sequence &&
            composeView.afuArm.name) {
            displayError(sdk, 'Cannot Disable Tracking', 'Tracking is mandatory for auto-followups to work.');
            return;
        }
        if (composeView.bumpArm2) {
            displayError(sdk, 'Cannot Disable Tracking', 'Tracking is mandatory for reminders to work.');
            return;
        }
        if (track) {
            localStorage.setItem('NET_track', '0');
            track = null;
        } else {
            localStorage.setItem('NET_track', '1');
            track = '1';
        }
    }
    composeView.track = track;
    var btn = document.getElementById(composeView.id).querySelector('.net_track-opens');
    var c = btn.parentElement.parentElement;
    if (track) {
        btn.className = 'fa fa-fw fa-eye net_track-opens net_on';
        c.dataset.tooltip = 'Track opens and clicks: On';
        c.classList.remove('net_off');
        c.classList.add('net_on');
    } else {
        btn.className = 'fa fa-fw fa-eye-slash net_track-opens';
        c.dataset.tooltip = 'Track opens and clicks: Off';
        c.classList.remove('net_on');
        c.classList.add('net_off');
    }
    auth.getToken(sdk, function (token) {
        if (!token) {
            displayError(sdk, 'Incomplete Authorization', '<p>' + chrome.runtime.getManifest().name + ' requires access to your Gmail account to function properly.<br>Please refresh the page to retry authorization.</p>');
            return;
        }
    });
};
