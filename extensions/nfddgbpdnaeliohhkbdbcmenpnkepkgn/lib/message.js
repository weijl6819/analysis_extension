
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

var message = {
    /* tracked */

    loadTracked: function(callback) {
        chrome.storage.local.get('trackedMessages', function(root) {
            if (root.hasOwnProperty('trackedMessages'))
                callback(root.trackedMessages);
            else callback({});
        });
    },

    saveTracked: function(tracked, callback) {
        chrome.storage.local.set({ trackedMessages: tracked }, callback);
    },

    createTracked: function(trackId, threadId, messageId, callback) {
        message.loadTracked(function(tracked) {
            tracked[threadId] = {
                trackId: trackId,
                messageId: messageId,
                createdAt: new Date(),
                opened: false,
                clicked: false,
            };
            message.saveTracked(tracked, function() {
                console.log(
                    '- tracked message created for threadId:',
                    threadId,
                    ', messageId:',
                    messageId,
                    ', trackId:',
                    trackId
                );
                if (callback) callback();
            });
        });
    },

    isTracked: function(threadId, callback) {
        message.loadTracked(function(tracked) {
            if (tracked.hasOwnProperty(threadId)) callback(true);
            else callback(false);
        });
    },

    getStatus: function(threadId, callback) {
        message.loadTracked(function(tracked) {
            if (tracked.hasOwnProperty(threadId)) {
                if (tracked[threadId].clicked && tracked[threadId].replied) {
                    callback(tracked[threadId]);
                    return;
                }
                simpleXHR(
                    {
                        url:
                            apis.track_view +
                            '?id=' +
                            tracked[threadId]['trackId'],
                    },
                    function(status, result) {
                        var save = false;
                        var total =
                            result.opened + result.clicked + result.replied;

                        if (total == 1 && total > 0) {
                            var temp =
                                'Your email was read ' + total + ' time\n';
                        } else {
                            var temp =
                                'Your email was read ' + total + ' times\n';
                        }
                        //var to = "First read on Mon Feb 20 2017 using Chrome";
                        tracked[threadId].tooltip = temp + result.tooltip;
                        //console.log(tracked[threadId].tooltip);
                        //result.opened=5;
                        if (result.opened >= 1) {
                            tracked[threadId].opened = true;
                            tracked[threadId].opened_count = result.opened;
                            save = true;
                        }
                        if (result.clicked >= 1) {
                            tracked[threadId].clicked = true;
                            save = true;
                        }
                        if (result.replied >= 1) {
                            tracked[threadId].replied = true;
                            save = true;
                        }
                        if (save) {
                            message.saveTracked(tracked);
                        }
                        callback(tracked[threadId]);
                    },
                    function(status, result) {
                        callback(tracked[threadId]);
                    }
                );
                return;
            }
            callback(false);
        });
    },

    /* scheduled (send later) */

    loadScheduled: function(callback) {
        chrome.storage.local.get('scheduledMessages', function(root) {
            if (root.hasOwnProperty('scheduledMessages'))
                callback(root.scheduledMessages);
            else callback({});
        });
    },

    saveScheduled: function(scheduled, callback) {
        chrome.storage.local.set({ scheduledMessages: scheduled }, callback);
    },

    createScheduled: function(
        trackId,
        threadId,
        messageId,
        jobId,
        timeUtc,
        afuArm,
        bumpArm,
        callback
    ) {
        message.loadScheduled(function(scheduled) {
            scheduled[messageId] = {
                jobId: jobId,
                trackId: trackId,
                timeUtc: timeUtc,
            };
            if (afuArm && afuArm.sequence) {
                /*

                in message.createFollowUp below:
                  - afuArm.sequence is used as jobIds, since its underlying routine only requires to check length of this parameter.
                  - in timesUtc, and statuses, only the first element is set, as messageIds is skipped

                */
                var timesUtc = [
                    new Date(
                        new Date(timeUtc).getTime() +
                            1000 *
                                60 *
                                60 *
                                24 *
                                parseInt(afuArm.sequence[0].days, 10)
                    ).toISOString(),
                ];
                var statuses = [afuArm.sequence[0].status];
                message.createFollowUp(
                    trackId,
                    threadId,
                    afuArm.sequence,
                    [],
                    timesUtc,
                    statuses
                );
            }
            if (bumpArm) {
                /*

                in message.createBump below:
                  - sequence is simulated with only 1 entry, then filled with bogus entry

                 */
                var bumpTime;
                if (bumpArm.format === 'natural')
                    bumpTime = chrono.parseDate(
                        bumpArm.time,
                        new Date(timeUtc)
                    );
                else bumpTime = new Date(bumpArm.time);
                var simSeq = [
                    {
                        status: bumpArm.status,
                        timeUtc: bumpTime.toISOString(),
                    },
                ];
                message.createBump(threadId, simSeq);
            }
            message.saveScheduled(scheduled, function() {
                console.log(
                    '- scheduled message created for threadId:',
                    threadId,
                    ', messageId:',
                    messageId,
                    ', trackId:',
                    trackId
                );
                if (callback) callback();
            });
        });
    },

    deleteScheduled: function(ids, callback) {
        message.loadScheduled(function(scheduled) {
            for (var i = 0; i < ids.length; i++) delete scheduled[ids[i]];
            message.saveScheduled(scheduled, function() {
                if (callback) callback();
            });
        });
    },

    modifyScheduledMessageId: function(origId, newId, callback) {
        message.loadScheduled(function(scheduled) {
            if (scheduled.hasOwnProperty(origId)) {
                scheduled[newId] = JSON.parse(
                    JSON.stringify(scheduled[origId])
                );
            }
            message.saveScheduled(scheduled, function() {
                if (callback) callback();
            });
        });
    },

    isScheduled: function(messageId, callback) {
        message.loadScheduled(function(scheduled) {
            if (scheduled.hasOwnProperty(messageId)) {
                callback(scheduled[messageId]);
                return;
            }
            callback(null);
        });
    },

    /* auto-followups */

    loadFollowUp: function(callback) {
        chrome.storage.local.get('followUpMessages', function(root) {
            if (root.hasOwnProperty('followUpMessages'))
                callback(root.followUpMessages);
            else callback({});
        });
    },

    saveFollowUp: function(followUp, callback) {
        chrome.storage.local.set({ followUpMessages: followUp }, callback);
    },

    createFollowUp: function(
        trackId,
        threadId,
        jobIds,
        messageIds,
        timesUtc,
        statuses,
        callback
    ) {
        message.loadFollowUp(function(followup) {
            followup[threadId] = {
                count: jobIds.length,
                timeUtc: timesUtc[0],
                status: statuses[0],
                trackId: trackId,
            };
            for (var i = 0; i < messageIds.length; i++) {
                followup[messageIds[i]] = {
                    count: -1,
                    timeUtc: timesUtc[i],
                    status: statuses[i],
                    trackId: trackId,
                    jobId: jobIds[i],
                };
            }
            message.saveFollowUp(followup, function() {
                console.log(
                    '- followup message created for threadId:',
                    threadId,
                    ', trackId:',
                    trackId
                );
                if (callback) callback();
            });
        });
    },

    deleteFollowUp: function(ids, callback) {
        message.loadFollowUp(function(followup) {
            for (var i = 0; i < ids.length; i++) delete followup[ids[i]];
            message.saveFollowUp(followup, function() {
                if (callback) callback();
            });
        });
    },

    isFollowUp: function(threadId, callback) {
        message.loadFollowUp(function(followup) {
            if (followup.hasOwnProperty(threadId)) {
                callback(followup[threadId]);
                return;
            }
            callback(null);
        });
    },

    /* bump notify */

    loadBump: function(callback) {
        chrome.storage.local.get('bumpMessages', function(root) {
            if (root.hasOwnProperty('bumpMessages'))
                callback(root.bumpMessages);
            else callback({});
        });
    },

    saveBump: function(bump, callback) {
        chrome.storage.local.set({ bumpMessages: bump }, callback);
    },

    createBump: function(threadId, bumpArm, callback) {
        message.loadBump(function(bumps) {
            bumps[threadId] = {
                count: 1,
                timeUtc: bumpArm[0].timeUtc,
                status: bumpArm[0].status,
            };
            message.saveBump(bumps, function() {
                console.log('- bump message created for threadId:', threadId);
                if (callback) callback();
            });
        });
    },

    deleteBump: function(ids, callback) {
        message.loadBump(function(bumps) {
            for (var i = 0; i < ids.length; i++) delete bumps[ids[i]];
            message.saveBump(bumps, function() {
                if (callback) callback();
            });
        });
    },

    isBump: function(threadId, callback) {
        message.loadBump(function(bumps) {
            if (bumps.hasOwnProperty(threadId)) {
                callback(bumps[threadId]);
                return;
            }
            callback(null);
        });
    },
};
