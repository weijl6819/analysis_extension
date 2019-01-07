
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
var _statusMap = {
    'ANY': 'no matter what',
    'NOT_OPENED': 'if not opened',
    'NOT_CLICKED': 'if not clicked',
    'NOT_REPLIED': 'if not replied'
};


var _buildFollowUpLabel = function(info) {
    var time = new Date(info.timeUtc);
    var label = 'Follow ';
    if (info.count > 0)
        label += '(' + info.count + ') ';
    label += moment(time).calendar() + ' ';
    label += ', ' + _statusMap[info.status];
    return label;
};


var _buildBumpLabel = function(info) {
    var label = 'Remind ';
    if (info.hasOwnProperty('timeUtc')) {
        var time = new Date(info.timeUtc);
        if (info.count > 1)
            label += '(' + info.count + ') ';
        label += moment(time).calendar() + ' ';
    }
    label += ', ' + _statusMap[info.status];
    return label;
};

var tagThread = function(task, listView) {
    if (task.step === 4) {
        //console.log(task);

        if (task.labels.length > 0) {
            listView.addLabel({
                'title': task.labels.join('\n')
            });
        }
        if (task.hasOwnProperty('dateReplacement') &&
            task.dateReplacement) {
            listView.replaceDate({
                text: task.dateReplacement,
                textColor: '#d14836'
            });
        }
        return;
    }
    if (task.step === 0) {
        message.isScheduled(task.id, function(info) {
            if (!info) {
                task.step++;
                tagThread(task, listView);
                return;
            }
            var time = new Date(info.timeUtc);
            task.labels.push('Scheduled ' + moment(time).calendar());
            //Added tooltip for schedule messages
            //listView.addImage({
            //    'imageUrl':"https://i.imgsafe.org/580256e106.png",
            //    'tooltip':'Scheduled ' + moment(time).calendar()
            //});
            task.dateReplacement = moment(time).calendar();
            if (info.autoFollowUps) {
                // console.log(info);
                task.labels.push(_buildFollowUpLabel(info.autoFollowUps));
            }
            if (info.bump) {
                task.labels.push(_buildBumpLabel(info.bump));
            }
            task.step++;
            tagThread(task, listView);
        });
    } else if (task.step === 1) {
        message.isTracked(task.id, function(tracked) {
            if (!tracked) {
                task.step++;
                //listView.addImage({
                    //'imageUrl': chrome.extension.getURL('assets/untracked.png'), //"https://i.imgsafe.org/00f5b20364.png",
                    //'tooltip': 'Sent without tracking'
                //});
                tagThread(task, listView);
                return;
            }
            message.getStatus(task.id, function(status) {
                var open = false;
                if (status.replied) {
                    task.labels.push('Replied');
                    //icon for replied
                    if (!open) {
                        listView.addImage({
                            'imageUrl': chrome.extension.getURL('assets/opened.png'),
                            'tooltip': status.tooltip
                        });
                        open = true;
                    }
                }
                if (status.clicked) {
                    task.labels.push('Clicked');
                    // If there is a click
                    if (!open) {
                        listView.addImage({
                            'imageUrl': chrome.extension.getURL('assets/opened.png'),
                            'tooltip': status.tooltip
                        });
                        open = true;
                    }
                } else if (status.opened) {
                    if (!open) {
                        listView.addImage({
                            'imageUrl': chrome.extension.getURL('assets/opened.png'),
                            'tooltip': status.tooltip
                        });
                        open = true;
                    }
                } else if (!status.replied) {
                    if (!open) {
                        listView.addImage({
                            'imageUrl': chrome.extension.getURL('assets/unopened.png'),
                            'tooltip': 'Not Opened yet'
                        });
                    }
                }
                task.step++;
                tagThread(task, listView);
            });
        });
    } else if (task.step === 2) {
        message.isBump(task.id, function(info) {
            if (!info) {
                task.step++;
                tagThread(task, listView);
                return;
            }
            task.labels.push(_buildBumpLabel(info));
            task.step++;
            tagThread(task, listView);
        });
    } else if (task.step === 3) {
        message.isFollowUp(task.id, function(info) {
            if (!info) {
                task.step++;
                tagThread(task, listView);
                return;
            }
            task.labels.push(_buildFollowUpLabel(info));
            //console.log(task.step, task.id, task.labels);
            task.step++;
            tagThread(task, listView);
        });
    }
};



var listViewHandler = function(listView) {

    var threadId = listView.getThreadIDIfStable();
    var task = {
        labels: [],
        step: 0,
        id: null
    };

    if (threadId) {
        // regular message
        task.id = threadId;
        tagThread(task, listView);
    }

};
