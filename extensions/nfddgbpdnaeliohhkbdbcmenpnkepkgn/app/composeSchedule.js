
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
var scheduleMessage = function (composeView, timeUtc, sdk, creditOverride) {
    var overlay = displayProgress(sdk, 'Scheduling Email');
    var from = composeView.getFromContact();
    var threadId = composeView.getThreadID();
    var draftPromise = composeView.getDraftID();
    draftPromise.then(function (draftId) {
        auth.getToken(sdk, function (token) {
            if (!token) {
                overlay.close();
                return;
            }
            var payload = {
                client:     chrome.runtime.id,
                token:      token,
                sender:     from.emailAddress,
                draftId:    draftId,
                sendAt:     timeUtc
            };
            if (threadId)
                payload.threadId = threadId;
            if (composeView.track)
                payload.track = true;
            if (composeView.afuArm.sequence) {
                payload.track = true;
                payload.afuArm = composeView.afuArm;
            }
            if (creditOverride)
                payload.creditOverride = '1';
            var translated = null;
            if (composeView.bumpArm2) {
                // translate bump time to start from schedule time
                translated = timeInput.toPickerFormat(composeView.bumpArm2, new Date(timeUtc));
                translated.status = composeView.bumpArm2.status;
                payload.track = true;
                payload.bumpArm = {
                    sequence:   [translated]
                };
            }
            simpleXHR({
                url:        apis.gmail_schedule_message,
                payload:    payload
            }, function (status, response) {
                message.createScheduled(response.trackId, response.threadId, response.id, response.jobId, timeUtc, composeView.afuArm, translated, function () {
                    if (composeView.isReply())
                        gmailGoBack();
                    else
                        composeView.close();
                    poll.rearmSchedule();
                    gmailRefreshList();
                    overlay.close();
                    sdk.ButterBar.showMessage({
                        html: 'Your message has been scheduled. <a href="#label/Scheduled/' + response.id + '">View it</a>, or find it in <a href="#label/Scheduled">' + chrome.runtime.getManifest().name + '/Scheduled</a>',
                        className: 'net_butter-bar',
                        hideOnViewChanged: false
                    });
                    setTimeout(function () {
                        gmailRefreshList();
                    }, 5000);
                });
            }, function (status, response) {
                if (response &&
                    response.credits &&
                    response.credits.overLimit) {
                    showPayWall(sdk, response.credits, function () {
                        // purchase complete
                        scheduleMessage(composeView, timeUtc, sdk);
                    }, function () {
                        scheduleMessage(composeView, timeUtc, sdk, true);
                    }, function () {
                        overlay.close();
                    });
                } else {
                    displayError(sdk, 'Scheduling Error', 'Email scheduling has failed<br><br>' + '<pre>' + JSON.stringify(response, null, 4) + '</pre>');
                    overlay.close();
                }
            });
        });
    });
};


var sendLater = function (event, composeView, sdk, form) {
    var recipients = composeView.getToRecipients();
    if (recipients.length < 1) {
        window.alert('Please enter recipients of the message before scheduling.');
        return;
    }
    var modal = sdk.Widgets.showModalView({
        el:     form,
        title:  'Send Later',
        buttons: [
            {
                text:   'Schedule to Send',
                title:  'Schedule to Send',
                onClick: function () {
                    input = composeView.scheduleTimeInput.getInput();
                    timeList = composeView.scheduleTimeInput.getList();
                    if (!input ||
                        !input.time ||
                        input.time.length === 0) {
                        displayError(sdk, 'Cannot Schedule Message', 'Please specify a time for the message.');
                        return false;
                    } else {
                        timeList = timeInput.storeTime(input.time, input.format, timeList);
                        localStorage.NET_storedSendLaterTimes = JSON.stringify(timeList);
                    }

                    var scheduleTime = timeInput.toPickerFormat(input);
                    if (!scheduleTime)
                        return;
                    var target = new Date(scheduleTime.time);
                    var now = new Date();
                    if (target <= now) {
                        displayError(sdk, 'Cannot Schedule Message', 'The time you specified: "' + target.toLocaleString() + '" is in the past.');
                        return;
                    }
                    localStorage.NET_sendLaterTime = JSON.stringify(input);
                    scheduleMessage(composeView, scheduleTime.time, sdk);
                    modal.close();
                },
                type:   'PRIMARY_ACTION'
            }
        ]
    });
    composeView.scheduleTimeInput = new timeInput({
        composeView:        composeView,
        input:              composeView.sendLaterTime,
        timeList:           composeView.sendLaterTimes,
        pickerSwitchId:     'NET_SCHEDULE_PICKERSWITCH',
        naturalTimeId:      'NET_SCHEDULE_NATURALTIME',
        dateId:             'NET_SCHEDULE_DATE',
        timeId:             'NET_SCHEDULE_TIME',
        manualCheckId:      'NET_SCHEDULE_MANUALCHECK',
        choiceTimeId:       'NET_SCHEDULE_CHOICETIME'
    });
};