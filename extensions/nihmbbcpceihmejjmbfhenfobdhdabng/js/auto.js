var debug = false;
var suspendMin = '360';//自动关闭Tab时间间隔，6小时:360,

function reinjectContentScripts() {
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(currentTab) {
            initTabTimer(currentTab);
            if (!isSpecialTab(currentTab)) {
                var tabId = currentTab.id;
                chrome.tabs.executeScript(tabId, {
                    file: 'js/contentscript.js'
                }, function() {
                    if (chrome.runtime.lastError) {
                        if(debug) console.log(chrome.runtime.lastError.message);
                        if(debug) console.log("URL :" + currentTab.url);
                    } else {
                        sendMessageToTab(tabId, {
                            action: 'resetTimer',
                            suspendTime: suspendMin
                        });
                    }
                });
            }
        });
    });
}

reinjectContentScripts();

function sendMessageToTab(tabId, message, callback) {
    try {
        if(debug) console.log(tabId);
        chrome.tabs.sendMessage(tabId, message, {
            frameId: 0
        }, callback);
    } catch (e) {
        if(debug) console.log(e);
        chrome.tabs.sendMessage(tabId, message, callback);
    }
}

chrome.runtime.onMessage.addListener(messageRequestListener);
chrome.runtime.onMessageExternal.addListener(messageRequestListener);
chrome.tabs.onActivated.addListener(function callback(activeInfo){
    sendMessageToTab(activeInfo.tabId, {
        action: 'resetTimer',
        suspendTime: suspendMin
    });
});

function requestTabSuspension(tab) {
    if (typeof(tab) === 'undefined') return;
    if (isSpecialTab(tab)) return;
    
    confirmTabSuspension(tab);
}

function isSpecialTab(tab) {
    var url = tab.url;

    if (url.indexOf('chrome-extension:') === 0 && url.indexOf(Ext.ID) < 0)
        return true;
    else
        return false;
}


function confirmTabSuspension(tab) {
    if(debug) 
        console.log("Close Tab ===> " + tab.url);
    autoCloseTab(tab);
}

function messageRequestListener(request, sender, sendResponse) {
    if (debug) {
        console.log('listener fired:', request.action);
        console.dir(sender);
    }
    switch (request.action) {
        case 'prefs':
            sendResponse({
                dontSuspendForms: true,
                suspendTime: suspendMin,
                tabId: sender.tab.id
            });
            break;
        case 'suspendTab':
            requestTabSuspension(sender.tab);
            break;
        default:
            break;
    }
}

function requestTabInfoFromContentScript(tab, callback) {
    sendMessageToTab(tab.id, {
        action: 'requestInfo'
    }, function(response) {
        if (response) {
            var tabInfo = {};
            tabInfo.status = response.status;
            tabInfo.timerUp = response.timerUp;
            callback(tabInfo);
        } else {
            callback(false);
        }
    });
}

function rescueContentTimer(){
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(currentTab) {
            if (!isSpecialTab(currentTab)) {
                requestTabInfoFromContentScript(currentTab, function(tabInfo){
                    var timerUp = tabInfo.timerUp || false;
                    if(timerUp){
                        if(Ext.getNow() - timerUp > 1000 * 60 * 3)
                            autoCloseTab(currentTab);
                            // chrome.tabs.remove(currentTab.id);
                    }
                });
            }
        });
    });
}
