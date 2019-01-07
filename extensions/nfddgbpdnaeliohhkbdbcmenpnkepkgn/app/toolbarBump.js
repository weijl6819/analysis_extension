
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
var toolbarBump = function (params) {

    var sdk = params.sdk;
    var stub = {};
    stub.bumpTimes = null;
    if (localStorage.NET_storedBumpTimes)
        stub.bumpTimes = JSON.parse(localStorage.NET_storedBumpTimes);
    stub.bumpArm2 = null;
    if (localStorage.NET_storedBumpArm2)
        stub.bumpArm2 = JSON.parse(localStorage.NET_storedBumpArm2);
    var html = params.html;
    html = html.replace(/net_wide-manual/g, 'net_narrow-manual');
    html = html.replace(/net_wide-choices/g, 'net_narrow-choices');
    html = html.replace(/<p id="NET_BUMP_PROMPT">.+<\/p>/, '<p>Set a reminder for this thread:</p>');


    var _choiceClicked = function (e) {
        var i, li, ul, idx;
        li = e.target.parentElement;
        ul = li.parentElement;
        timeInput.checkAll(ul, false);
        timeInput.check(e.target.children[0], true);
    };

    var _approved = function (e) {
        var input = stub.bumpTimeInput.getInput();
        var timeList = stub.bumpTimeInput.getList();
        if (!input ||
            !input.time ||
            input.time.length === 0) {
            displayError(sdk, 'Cannot Arm Reminder', 'Please specify a time for the reminder.');
            return false;
        } else {
            timeList = timeInput.storeTime(input.time, input.format, timeList);
            localStorage.NET_storedBumpTimes = JSON.stringify(timeList);
            idx = timeInput.getChecked(document.getElementById('NET_BUMP_CHOICESTATUS'));
            stub.bumpArm2 = {
                time:   input.time,
                format: input.format
            };
            switch (idx) {
            case 0:
                stub.bumpArm2.status = 'ANY';
                break;
            case 1:
                stub.bumpArm2.status = 'NOT_REPLIED';
                break;
            }
            stub.e.dropdown.close();
            var trackId = getUniqueId();
            // enable tracking: server-side
            simpleXHR({
                url: apis.track_enable + '?id=' + trackId
            }, function (status, response) {
                _armBump(stub, sdk, stub.e.threadView.getThreadID(), stub.e.threadView.getThreadID(), trackId, function (success) {
                    if (!success)
                        return;
                    // portions from app/thread.js
                    var messageView = stub.e.threadView.getMessageViewsAll()[0];
                    var task = {
                        messageId:      stub.e.threadView.getThreadID(),
                        messageView:    messageView,
                        lines:          [],
                        step:           1
                    };
                    tagMessage(task);
                });
            }, function (status, response) {
            });
        }
    };

    var _clicked = function (e) {
        stub.e = e;
        e.dropdown.el.innerHTML = html;
        e.dropdown.el.style.paddingRight = '4px';
        e.dropdown.el.style.paddingBottom = '12px';
        e.dropdown.el.style.paddingLeft = '14px';

        var el = document.getElementById('NET_BUMP_CHOICESTATUS');
        var CSs = el.children;
        for (i = 0; i < CSs.length; i++) {
            CSs[i].children[0].addEventListener('click', _choiceClicked);
        }
        el = document.getElementById('NET_BUMP_CHOICESTATUS');
        timeInput.check(el.children[0].children[0].children[0], true);
        if (stub.bumpArm2) {
            if (stub.bumpArm2.status === 'NOT_REPLIED') {
                timeInput.check(el.children[1].children[0].children[0], true);
                timeInput.check(el.children[0].children[0].children[0], false);
            }
        }
        stub.bumpTimeInput = new timeInput({
            composeView:        stub,
            input:              stub.bumpArm2,
            timeList:           stub.bumpTimes,
            pickerSwitchId:     'NET_BUMP_PICKERSWITCH',
            naturalTimeId:      'NET_BUMP_NATURALTIME',
            dateId:             'NET_BUMP_DATE',
            timeId:             'NET_BUMP_TIME',
            manualCheckId:      'NET_BUMP_MANUALCHECK',
            choiceTimeId:       'NET_BUMP_CHOICETIME'
        });
        el = document.getElementById('NET_BUMP_APPROVEBUTTON');
        el.addEventListener('click', _approved);
    };


    sdk.Toolbars.registerToolbarButtonForThreadView({
        title:          'Reminder',
        iconClass:      'fa fa-lg fa-clock-o net_bump-toolbar-button',
        section:        sdk.Toolbars.SectionNames.METADATA_STATE,
        onClick:        _clicked,
        hasDropdown:    true
    });

};
