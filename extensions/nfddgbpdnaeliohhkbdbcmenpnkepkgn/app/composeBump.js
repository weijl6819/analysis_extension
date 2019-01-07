
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
var _choiceClicked = function (composeView) {
    return function (e) {
        var i, li, ul, idx;
        li = e.target.parentElement;
        ul = li.parentElement;
        timeInput.checkAll(ul, false);
        timeInput.check(e.target.children[0], true);
    };
};


var armBumpNotify = function (toArm, composeView, sdk) {
    // persist timeInput data
    var input, timeList;
    if (composeView.bumpTimeInput) {
        timeList = composeView.bumpTimeInput.getList();
        localStorage.NET_storedBumpTimes = JSON.stringify(timeList);
    }
    if (toArm) {
        var i, idx, date, time;
        var eMC = document.getElementById('NET_BUMP_MANUALCHECK');
        if (eMC) {
            // armed from an active reminder dialog
            input = composeView.bumpTimeInput.getInput();
            timeList = composeView.bumpTimeInput.getList();
            if (!input ||
                !input.time ||
                input.time.length === 0) {
                displayError(sdk, 'Cannot Arm Reminder', 'Please specify a time for the reminder.');
                return false;
            } else {
                timeList = timeInput.storeTime(input.time, input.format, timeList);
                localStorage.NET_storedBumpTimes = JSON.stringify(timeList);
                idx = timeInput.getChecked(document.getElementById('NET_BUMP_CHOICESTATUS'));
                composeView.bumpArm2 = {
                    time:   input.time,
                    format: input.format
                };
                switch (idx) {
                case 0:
                    composeView.bumpArm2.status = 'ANY';
                    break;
                case 1:
                    composeView.bumpArm2.status = 'NOT_REPLIED';
                    break;
                }
            }
        } else {
            // armed from persisted reminder
            // information already available in composeView.bumpArm2
        }
    } else {
        composeView.bumpArm2 = null;
    }
    // trigger reminder button status
    var btn = document.getElementById(composeView.id).querySelector('.net_bump-notify');
    var c = btn.parentElement.parentElement;
    if (composeView.bumpArm2) {
        btn.className = 'fa fa-fw fa-clock-o net_bump-notify net_on';
        c.dataset.tooltip = 'Reminder is armed: ' + timeInput.formatTime(composeView.bumpArm2.time, composeView.bumpArm2.format);
        c.classList.remove('net_off');
        c.classList.add('net_on');
        composeView.track = '1';
        toggleTrack(composeView, sdk);
        localStorage.NET_storedBumpArm2 = JSON.stringify(composeView.bumpArm2);
    } else {
        btn.className = 'fa fa-fw fa-clock-o net_bump-notify';
        c.dataset.tooltip = 'Reminder is off';
        c.classList.add('net_off');
        c.classList.remove('net_on');
        localStorage.removeItem('NET_storedBumpArm2');
    }
    // console.log('armBumpNotify', composeView.bumpArm2);
    return true;
};


var bumpNotify = function (event, composeView, sdk, form) {
    var modal = sdk.Widgets.showModalView({
        el:     form,
        title:  'Remind Yourself',
        buttons: [
            {
                text:   'Approve',
                title:  'Approve',
                onClick: function () {
                    if (armBumpNotify(true, composeView, sdk))
                        modal.close();
                },
                type:   'PRIMARY_ACTION'
            },
            {
                text:   'Cancel',
                title:  'Cancel',
                onClick: function () {
                    armBumpNotify(false, composeView, sdk);
                    modal.close();
                },
                type:   'SECONDARY'
            }
        ]
    });
    var e = document.getElementById('NET_BUMP_CHOICESTATUS');
    var CSs = e.children;
    for (i = 0; i < CSs.length; i++) {
        CSs[i].children[0].addEventListener('click', _choiceClicked(composeView));
    }
    e = document.getElementById('NET_BUMP_CHOICESTATUS');
    timeInput.check(e.children[0].children[0].children[0], true);
    if (composeView.bumpArm2) {
        if (composeView.bumpArm2.status === 'NOT_REPLIED') {
            timeInput.check(e.children[1].children[0].children[0], true);
            timeInput.check(e.children[0].children[0].children[0], false);
        }
    }
    e = document.getElementById('NET_BUMP_APPROVEBUTTON');
    e.style.display = 'none';
    composeView.bumpTimeInput = new timeInput({
        composeView:        composeView,
        input:              composeView.bumpArm2,
        timeList:           composeView.bumpTimes,
        pickerSwitchId:     'NET_BUMP_PICKERSWITCH',
        naturalTimeId:      'NET_BUMP_NATURALTIME',
        dateId:             'NET_BUMP_DATE',
        timeId:             'NET_BUMP_TIME',
        manualCheckId:      'NET_BUMP_MANUALCHECK',
        choiceTimeId:       'NET_BUMP_CHOICETIME'
    });
    initKeepOnCheckbox('BUMP');
    auth.getToken(sdk, function (token) {
        if (!token) {
            modal.close();
            return;
        }
    });
};
