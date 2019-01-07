
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
var editMessage = function (messageId, threadId, sdk) {
    message.isScheduled(messageId, function (info) {
        if (info) {
            var overlay = displayProgress(sdk, 'Loading ...');
            auth.getToken(sdk, function (token) {
                if (!token) {
                    overlay.close();
                    displayError(sdk, 'Authentication Error', 'Permission is not granted.');
                    return;
                }
                var payload = {
                    client:     chrome.runtime.id,
                    token:      token,
                    messageId:  messageId,
                    threadId:   threadId
                };
                simpleXHR({
                    url:        apis.gmail_edit_message,
                    payload:    payload
                }, function (status, response) {
                    // make Gmail load draft, for some reason messageId is used instead of draftId
                    window.NET_EDITING_SCHEDULED = response;
                    window.NET_EDITING_SCHEDULED.returnTo = document.location.hash;
                    window.NET_EDITING_SCHEDULED.info = info;
                    document.location.hash += '?compose=' + response.editMessageId;
                    setTimeout(function () {
                        // delay one sec
                        overlay.close();
                    }, 1000);
                }, function (status, response) {
                    displayError(sdk, 'Failed to Edit Message', 'Failed to load the message for editing.<br><br>' + '<pre>' + JSON.stringify(response, null, 4) + '</pre>');
                    overlay.close();
                });
            });
        }
    });
};


var saveMessage = function (composeView, sdk) {
    var overlay = displayProgress(sdk, 'Saving ...');
    auth.getToken(sdk, function (token) {
        if (!token)
            return;
        var payload = {
            client:     chrome.runtime.id,
            token:      token,
            messageId:  composeView.editingScheduled.origMessageId,
            threadId:   composeView.editingScheduled.origThreadId,
            draftId:    composeView.editingScheduled.draftId
        };
        simpleXHR({
            url:        apis.gmail_save_message,
            payload:    payload
        }, function (status, response) {

            message.modifyScheduledMessageId(
                composeView.editingScheduled.origMessageId,
                response.id, function () {
                composeView.close();
                // console.log('saveMessage', response);
                sdk.Router.goto('label/Scheduled', {});
                setTimeout(function () {
                    gmailRefreshList();
                }, 2000);
                setTimeout(function () {
                    sdk.Router.goto('label/Scheduled/' + response.id, {});
                    //document.location.hash = 'label/Scheduled/' + response.id;
                    overlay.close();
                }, 4000);
            });

        }, function (status, response) {
            displayError(sdk, 'Saving Error', 'Saving an edited message has failed<br><br>' + '<pre>' + JSON.stringify(response, null, 4) + '</pre>');
            overlay.close();
        });
    });
};


