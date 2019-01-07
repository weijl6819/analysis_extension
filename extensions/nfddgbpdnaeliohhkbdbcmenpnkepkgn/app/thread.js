
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
var makeThreadViewHandler = function(sdk) {
    return function(threadView) {};
};

var tagMessage = function(task) {
    if (task.step === 1) {
        message.isScheduled(task.messageId, function(info) {
            if (info) {
                var time = new Date(info.timeUtc);
                var prompt =
                    '<strong>Send later</strong> ' + moment(time).calendar();
                task.lines.push(prompt);
                var body = task.messageView.getBodyElement();
                // white overlay on message
                // var overlay = document.createElement('div');
                // overlay.className = 'net_message-overlay';
                // body.insertBefore(overlay, body.childNodes[0]);
                // create an edit button
                var section = body.parentElement.querySelector('.hB')
                    .parentElement.parentElement;
                var editBtn = document.createElement('div');
                editBtn.className = 'T-I aaq net_message-edit';
                editBtn.setAttribute('role', 'button');
                editBtn.setAttribute('tabindex', '0');
                editBtn.setAttribute('data-tooltip', 'Edit');
                editBtn.setAttribute('aria-label', 'Edit');
                editBtn.style = '-webkit-user-select: none';
                editBtn.innerHTML = '<i class="fa fa-lg fa-edit"></i>';
                editBtn.addEventListener('click', function() {
                    editMessage(
                        task.messageId,
                        task.messageView.getThreadView().getThreadID(),
                        task.sdk
                    );
                });
                section.insertBefore(editBtn, section.childNodes[0]);
            }
            task.step++;
            tagMessage(task);
        });
    } else if (task.step === 2) {
        message.isFollowUp(task.messageId, function(info) {
            if (info) {
                var prompt;
                var time = moment(new Date(info.timeUtc)).calendar();
                var status = _statusMap[info.status];
                if (info.count > 0) {
                    prompt =
                        '<strong>Auto-followups</strong> sequence beginning ' +
                        time +
                        ', if ' +
                        status +
                        '.';
                    task.lines.push(prompt);
                } else {
                    prompt =
                        '<strong>Auto-followups</strong> will send if previous sequences are ' +
                        status +
                        ' by ' +
                        time +
                        '.';
                    task.lines.push(prompt);
                }
            }
            task.step++;
            tagMessage(task);
        });
    } else if (task.step === 3) {
        message.isBump(task.messageId, function(info) {
            if (info) {
                var prompt;
                var time = moment(new Date(info.timeUtc)).calendar();
                var status = _statusMap[info.status];
                prompt =
                    '<strong>Reminder</strong> ' + time + ', ' + status + '.';
                task.lines.push(prompt);
            }
            task.step++;
            tagMessage(task);
        });
    } else {
        if (task.lines.length > 0) {
            var bar = document.createElement('div');
            bar.className = 'net_send-later-prompt-container gt';
            bar.innerHTML =
                '<div class="net_send-later-prompt">' +
                task.lines.join('<br>') +
                '</div>';
            var messageBody = task.messageView.getBodyElement().parentElement;
            messageBody.insertBefore(bar, messageBody.childNodes[0]);
        }
    }
};

var makeMessageViewHandler = function(sdk) {
    return function(messageView) {
        messageView.getMessageIDAsync().then(
            messageId => {
                if (messageId) {
                    var task = {
                        sdk: sdk,
                        messageId: messageId,
                        messageView: messageView,
                        lines: [],
                        step: 1,
                    };
                    tagMessage(task);
                }
            },
            () => {}
        );
    };
};
