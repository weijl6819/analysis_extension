
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
(function() {
    'use strict';
    var readyStateCheckInterval,
        inputState = false,
        timerJob,
        timerUp = false,
        suspendTime,
        suspendedEl = document.getElementById('gsTopBar');
    //safety check here. don't load content script if we are on the suspended page
    if (suspendedEl) {
        return;
    }
    function init() {
        //do startup jobs
        reportState(false);
        requestPreferences(function(response) {
            //set timer job
            if (response && response.suspendTime > 0) {
                suspendTime = response.suspendTime * (1000 * 60);
                timerJob = setTimerJob(suspendTime);
            } else {
                suspendTime = 0;
            }
            // console.log(suspendTime);
            //add form input listener
            if (response && response.dontSuspendForms) {
                setFormInputJob();
            }
        });
    }
    function calculateState() {
        var status = inputState ? 'formInput' : 'normal';
        return status;
    }
    function reportState(state) {
        state = state || calculateState();
        chrome.runtime.sendMessage({
            action: 'reportTabState',
            status: state
        });
    }
   
    function setCookieValue(key, value) {
        document.cookie = key + '=' + value;
    }
    function getCookieValue(key) {
        var keyStart = document.cookie.indexOf(key + '='),
            keyEnd,
            value = false;
        if (keyStart >= 0) {
            keyEnd = document.cookie.indexOf(';', keyStart) > 0 ? document.cookie.indexOf(';', keyStart) : document.cookie.length;
            value = document.cookie.substring(keyStart + key.length + 1, keyEnd);
            value = value.length > 0 ? value : false;
        }
        return value;
    }
    
    
    function setTimerJob(timeToSuspend) {
        //slightly randomise suspension timer to spread the cpu load when multiple tabs all suspend at once
        if (timeToSuspend >= (1000 * 60)) {
            timeToSuspend = timeToSuspend + parseInt((Math.random() * 1000 * 60), 10);
        }
        //safety check to make sure timeToSuspend is reasonable
        if (timeToSuspend < (1000 * 10)) {
            timeToSuspend = (1000 * 60 * 60);
        }
        // console.log(timeToSuspend);
        timerUp = (new Date())
            .getTime() + timeToSuspend;
        return setTimeout(function() {
            //request suspension
            if (!inputState) {
                chrome.runtime.sendMessage({
                    action: 'suspendTab'
                });
            }
        }, timeToSuspend);
    }
    function setFormInputJob() {
        window.addEventListener('keydown', function(event) {
            if (!inputState) {
                if (event.keyCode >= 48 && event.keyCode <= 90 && event.target.tagName) {
                    if (event.target.tagName.toUpperCase() === 'INPUT' ||
                        event.target.tagName.toUpperCase() === 'TEXTAREA' ||
                        event.target.tagName.toUpperCase() === 'FORM') {
                        inputState = true;
                    }
                }
            }
        });
    }
    function requestPreferences(callback) {
        chrome.runtime.sendMessage({
            action: 'prefs'
        }, function(response) {
            callback(response);
        });
    }
    //listen for background events
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        var response = {},
            status,
            suspendDate;
        //console.dir('received contentscript.js message:' + request.action + ' [' + Date.now() + ']');
        switch (request.action) {
            case 'resetTimer':
                clearTimeout(timerJob);
                if (request.suspendTime > 0) {
                    suspendTime = request.suspendTime * (1000 * 60);
                    timerJob = setTimerJob(suspendTime);
                } else {
                    timerUp = false;
                    suspendTime = 0;
                }
                break;
                //listen for status request
            case 'requestInfo':
                status = calculateState();
                suspendDate = timerUp ? timerUp + '' : '-';
                response = {
                    status: status,
                    timerUp: suspendDate
                };
                sendResponse(response);
                break;
                //cancel suspension timer job
            case 'cancelTimer':
                clearTimeout(timerJob);
                timerUp = false;
                break;
            default:
                break;
        }
    });
    readyStateCheckInterval = window.setInterval(function() {
        if (document.readyState === 'complete') {
            window.clearInterval(readyStateCheckInterval);
            init();
        }
    }, 50);
}());