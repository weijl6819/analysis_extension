
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

var _getJobs = function (scheduled) {
    var jobs = {};
    var timeNow = Date.now();
    var oldJobs = [];
    for (var messageId in scheduled) {
        if (!scheduled.hasOwnProperty(messageId) ||
            !scheduled[messageId])
            continue;
        var jobTime = new Date(scheduled[messageId].timeUtc).getTime();
        var valid = false;
        if (jobTime <= timeNow)
            valid = true;
        // for follow-ups, separated into threads
        if (scheduled[messageId].hasOwnProperty('count') &&
            scheduled[messageId].count < 0)
            valid = true;
        if (valid &&
            scheduled[messageId].hasOwnProperty('jobId'))
            jobs[scheduled[messageId].jobId] = messageId;
    }
    console.log('_getJobs', jobs);
    return jobs;
};


var poll = {

    rearmSchedule: function () {
        chrome.runtime.sendMessage({code: 'rearmSchedule'});
    },

    rearmFollowUps: function () {
        chrome.runtime.sendMessage({code: 'rearmFollowUps'});
    },

    schedule: function (callback) {
        message.loadScheduled(function (scheduled) {
            var jobs = _getJobs(scheduled);
            var jobIds = Object.keys(jobs);
            console.log('poll.schedule will poll for', jobIds.length, 'schedule jobs');
            if (jobIds.length === 0) {
                callback();
                return;
            }
            simpleXHR({
                url:        apis.gmail_view_job,
                payload: {
                    ids: jobIds
                }
            }, function (status, result) {
                var idsRemove = [];
                var resp;
                for (var jobId in result) {
                    if (result[jobId].isSuccess &&
                        result[jobId].hasOwnProperty('response') &&
                        result[jobId].response.hasOwnProperty('id') &&
                        result[jobId].response.hasOwnProperty('threadId')) {
                        console.log('- schedule', jobId, 'is success', result[jobId]);
                        if (scheduled[jobs[jobId]].trackId)
                            message.createTracked(scheduled[jobs[jobId]].trackId, result[jobId].response.threadId, result[jobId].response.id);
                        if (result[jobId].hasOwnProperty('afuArmResponse') &&
                            result[jobId].afuArmResponse) {
                            resp = result[jobId].afuArmResponse;
                            message.createFollowUp(resp.trackId, resp.threadId, resp.jobIds, resp.messageIds, resp.timesUtc, resp.statuses);
                        }
                        if (result[jobId].hasOwnProperty('bumpArmResponse') &&
                            result[jobId].bumpArmResponse) {
                            resp = result[jobId].bumpArmResponse;
                            message.createBump(resp.threadId, resp.jobs);
                        }
                    }
                    if (result[jobId].isDone) {
                        console.log('- will remove schedule', jobId);
                        idsRemove.push(jobs[jobId]);
                    }
                }
                for (var i = 0; i < jobIds.length; i++) {
                    if (!result.hasOwnProperty(jobIds[i])) {
                        // non-existent job id means no records, remove local
                        console.log('- will remove schedule', jobIds[i], 'due to non-existent');
                        idsRemove.push(jobs[jobIds[i]]);
                    }
                }
                if (idsRemove.length === 0)
                    callback();
                else {
                    message.deleteScheduled(idsRemove, function () {
                        callback();
                    });
                }
            }, function (status, response) {
            });
        });
    },

    followUps: function (callback) {
        message.loadFollowUp(function (followup) {
            var jobs = _getJobs(followup);
            var jobIds = Object.keys(jobs);
            console.log('poll.followUps will poll for', jobIds.length, 'followup jobs');
            simpleXHR({
                url:        apis.gmail_view_job,
                payload: {
                    ids:    jobIds
                }
            }, function (status, result) {
                console.log(status, result);
                var idsRemove = [];
                for (var jobId in result) {
                    if (result[jobId].isDone) {
                        console.log('- will remove finished followup message', result[jobId].messageId);
                        idsRemove.push(result[jobId].messageId);
                    }
                }
                for (var i = 0; i < jobIds.length; i++) {
                    if (!result.hasOwnProperty(jobIds[i])) {
                        console.log('- will remove non-existent job', jobIds[i]);
                        idsRemove.push(jobs[jobIds[i]]);
                    }
                }
                if (idsRemove.length === 0)
                    callback();
                else {
                    message.deleteFollowUp(idsRemove, function () {
                        callback();
                    });
                }
            }, function (status, response) {
            });
        });
    }

};
