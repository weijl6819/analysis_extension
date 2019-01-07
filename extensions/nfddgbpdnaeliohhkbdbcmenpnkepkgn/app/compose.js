
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
var activeComposeViews = {};

var createComposeView = function(composeView) {
    var elems = document.querySelectorAll('.inboxsdk__compose');
    var id = null;
    if (elems.length === 0) return null;
    id = elems[elems.length - 1].getAttribute('id');
    // a reply window doesn't have ID, workaround: create one
    if (!id) {
        id = 'NET-REPLY_' + getUniqueId();
        elems[elems.length - 1].setAttribute('id', id);
    }
    if (!activeComposeViews.hasOwnProperty(id)) {
        activeComposeViews[id] = composeView;
    }
    return id;
};

var destroyComposeView = function(composeView) {
    for (var id in activeComposeViews) {
        if (
            activeComposeViews.hasOwnProperty(id) &&
            activeComposeViews[id] === composeView
        ) {
            var elem = document.getElementById(id);
            if (elem) elem.setAttribute('id', '');
            delete activeComposeViews[id];
            return;
        }
    }
};

var injectSendWithTag = function(composeView) {
    var body = composeView.getHTMLContent();
    body += composeView.sendWithTag;
    composeView.setBodyHTML(body);
};

var gmailDiscardDraft = function(composeView, sdk) {
    composeView.discardButton.click();
    var butterBar = document.querySelector('.inboxsdk__butterbar');
    butterBar.previousSibling.style.display = 'none';
};

var gmailRefreshList = function() {
    var btn = document.querySelector('.T-I.T-I-ax7.nu.L3');
    if (btn) {
        fireEvent(btn, 'MouseEvents', 'mousedown');
        fireEvent(btn, 'MouseEvents', 'mouseup');
    }
};

var gmailGoBack = function() {
    var btn = document.querySelector('.T-I.J-J5-Ji.lS.T-I-ax7');
    if (btn) {
        fireEvent(btn, 'MouseEvents', 'mousedown');
        fireEvent(btn, 'MouseEvents', 'mouseup');
    }
};

var currentPromotions = [
    {
        title: 'You Unlocked a Free Paid Account',
        body: `<p>
              Nathan here from The Top Inbox. Many people are using live chat on websites these days using Intercom, Drift, and other tools. I started using Freshchat because of cheaper price.
          </p>
          <p>
              Love it so much I convinced the CEO to give me paid accounts to give away for free.
          </p>
          <p>
              You unlocked one because you just used ${
                  chrome.runtime.getManifest().name
              }. Yippee!
          </p>
          <p>
              I have 15 (first come first serve) to give away via the
              button below. 7 already taken.
          </p>`,
        link: 'http://nathanlatka.com/freshchat',
        startDate: 'Mon Oct 22 2018',
        endDate: 'Sun Oct 28 2018',
    },
    {
        title: 'Something New You Unlocked',
        body: `<p>
              Nathan here from The Top Inbox. I use a pretty incredible little tool for creating my online courses.
          </p>
          <p>
              Love it so much I convinced the CEO to give me paid accounts to give away for free.
          </p>
          <p>
          You unlocked one because you just used ${
              chrome.runtime.getManifest().name
          }. Yippee!
          </p>`,
        link: 'http://nathanlatka.com/thinkific',
        startDate: 'Mon Oct 29 2018',
        endDate: 'Sun Nov 4 2018',
    },
    {
        title: 'You Just Unlocked a New Domain Name',
        body: `<p>
Nathan here from The Top Inbox. I use a pretty cool tool to lock up domain names when I think up a cool new idea.
          </p>
          <p>
              Love it so much I convinced the CEO to let me give you hosting and domain names you want at a big discount (some free!)
          </p>
          <p>
              You unlocked one because you just used ${
                  chrome.runtime.getManifest().name
              }. Yippee!
          </p>
          <p>
              I have 15 (first come first serve) to give away via the button below. 2 left.
          </p>`,
        link: 'http://nathanlatka.com/hostgator',
        startDate: 'Mon Nov 5 2018',
        endDate: 'Sun Nov 11 2018',
    },
];

function setFlag() {
    chrome.storage.sync.set({ loginFlag: true }, function() {
        if (chrome.runtime.error) {
            console.log('Runtime error.');
        } else {
            console.log('Set the Flag');
        }
    });
}

var _armAutoFollowUp = function(
    composeView,
    sdk,
    messageId,
    threadId,
    trackId,
    creditOverride
) {
    if (!composeView.afuArm.sequence) return;
    var overlay = displayProgress(sdk, 'Arming Auto-followups');
    auth.getToken(sdk, function(token) {
        var payload = {
            client: chrome.runtime.id,
            token: token,
            messageId: messageId,
            threadId: threadId,
            trackId: trackId,
            afuArm: composeView.afuArm,
        };
        if (creditOverride) payload.creditOverride = '1';
        simpleXHR(
            {
                url: apis.gmail_schedule_followup,
                payload: payload,
            },
            function(status, resp) {
                if (
                    status === 200 &&
                    resp &&
                    resp.status &&
                    resp.status === 'ok'
                ) {
                    message.createFollowUp(
                        resp.trackId,
                        resp.threadId,
                        resp.jobIds,
                        resp.messageIds,
                        resp.timesUtc,
                        resp.statuses,
                        function() {
                            poll.rearmFollowUps();
                        }
                    );
                }
                overlay.close();
            },
            function(status, response) {
                if (
                    response &&
                    response.credits &&
                    response.credits.overLimit
                ) {
                    showPayWall(
                        sdk,
                        response.credits,
                        function() {
                            // purchase complete
                            _armAutoFollowUp(
                                composeView,
                                sdk,
                                messageId,
                                threadId,
                                trackId
                            );
                        },
                        function() {
                            _armAutoFollowUp(
                                composeView,
                                sdk,
                                messageId,
                                threadId,
                                trackId,
                                true
                            );
                        },
                        function() {
                            overlay.close();
                        }
                    );
                } else {
                    displayError(
                        sdk,
                        'Arming Error',
                        'Auto-followups arming has failed.<br><br>' +
                            '<pre>' +
                            JSON.stringify(response, null, 4) +
                            '</pre>'
                    );
                    overlay.close();
                }
            }
        );
    });
};

var _armBump = function(
    composeView,
    sdk,
    messageId,
    threadId,
    trackId,
    callback,
    creditOverride
) {
    if (!composeView.bumpArm2) return;
    var overlay = displayProgress(sdk, 'Arming Reminders');
    auth.getToken(sdk, function(token) {
        // note: bumpArm is converted to a sequence for API compatibility
        var translated = timeInput.toPickerFormat(composeView.bumpArm2);
        translated.status = composeView.bumpArm2.status;
        var payload = {
            client: chrome.runtime.id,
            token: token,
            messageId: messageId,
            threadId: threadId,
            trackId: trackId,
            bumpArm: {
                sequence: [translated],
            },
        };
        if (creditOverride) payload.creditOverride = '1';
        simpleXHR(
            {
                url: apis.gmail_schedule_bump,
                payload: payload,
            },
            function(status, response) {
                console.log('_armBump', response);
                if (status === 200 && response)
                    message.createBump(threadId, response.jobs, function() {
                        if (callback) callback(true);
                    });
                overlay.close();
            },
            function(status, response) {
                if (
                    response &&
                    response.credits &&
                    response.credits.overLimit
                ) {
                    showPayWall(
                        sdk,
                        response.credits,
                        function() {
                            // purchase complete
                            _armBump(
                                composeView,
                                sdk,
                                messageId,
                                threadId,
                                trackId,
                                callback
                            );
                        },
                        function() {
                            _armBump(
                                composeView,
                                sdk,
                                messageId,
                                threadId,
                                trackId,
                                callback,
                                true
                            );
                        },
                        function() {
                            overlay.close();
                        }
                    );
                } else {
                    displayError(
                        sdk,
                        'Arming Error',
                        'Reminder arming has failed.<br><br>' +
                            '<pre>' +
                            JSON.stringify(response, null, 4) +
                            '</pre>'
                    );
                    overlay.close();
                    if (callback) callback(false);
                }
            }
        );
    });
};

var _beforeSend = function(composeView, sdk) {
    return function(e) {
        if (
            !composeView.track &&
            !composeView.afuArm.sequence &&
            !composeView.bumpArm2
        )
            return;
        // prepare subject for tracking
        composeView.subject = composeView.getSubject();
        if (composeView.subject)
            composeView.subject = encodeURIComponent(composeView.subject);
        else composeView.subject = '';
        // prepare recipient for tracking
        var recipient = '';
        var recipients = composeView.getToRecipients();
        for (var i = 0; i < recipients.length; i++) {
            if (recipient.length > 0) recipient += '; ';
            if (recipients[i].name) recipient += recipients[i].name + ' ';
            recipient += '<' + recipients[i].emailAddress + '>';
        }
        composeView.recipient = encodeURIComponent(recipient);
        // inject tracker
        composeView.trackId = injectTracker(composeView);
        if (composeView.sendWithTag) injectSendWithTag(composeView);
    };
};

var _afterSend = function(composeView, sdk) {
    return function(e) {
        if (
            !composeView.track &&
            !composeView.afuArm.sequence &&
            !composeView.bumpArm2
        )
            return;

        var trackId = composeView.trackId;
        // var threadId = e.threadID;
        // var messageId = e.messageID;
        Promise.all([e.getThreadID(), e.getMessageID()]).then(result => {
            var threadId = result[0];
            var messageId = result[1];
            // enable tracking: server-side
            simpleXHR(
                {
                    url:
                        apis.track_enable +
                        '?id=' +
                        trackId +
                        '&recipient=' +
                        composeView.recipient +
                        '&subject=' +
                        composeView.subject,
                },
                function(status, response) {},
                function(status, response) {}
            );
            // enable tracking: client-side
            message.createTracked(trackId, threadId, messageId, function() {
                _armAutoFollowUp(
                    composeView,
                    sdk,
                    messageId,
                    threadId,
                    trackId
                );
                _armBump(composeView, sdk, messageId, threadId, trackId);
            });
            auth.getToken(sdk, function(token) {
                if (!token) return;
                var payload = {
                    client: chrome.runtime.id,
                    token: token,
                    threadId: threadId,
                    labels: ['Tracked'],
                };
                simpleXHR(
                    {
                        url: apis.gmail_mark,
                        payload: payload,
                    },
                    function(status, response) {
                        gmailRefreshList();
                    },
                    function(status, response) {}
                );
            });
            if (composeView.sendWithTag) {
                var payload = {
                    id: 'message/send_with_tag_injection',
                };
                simpleXHR(
                    {
                        url: apis.report_count_now,
                        payload: payload,
                    },
                    function(status, response) {},
                    function(status, response) {}
                );
            }
        });
    };
};

var makeComposeViewHandler = function(sdk) {
    return function(composeView) {
        var id = createComposeView(composeView);
        composeView.id = id;
        composeView.discardButton = document
            .getElementById(id)
            .querySelector('.oh.J-Z-I.J-J5-Ji.T-I-ax7');

        // special case of editing a scheduled message
        if (window.NET_EDITING_SCHEDULED) {
            composeView.editingScheduled = window.NET_EDITING_SCHEDULED;
            delete window['NET_EDITING_SCHEDULED'];
            var el = document.getElementById(id);
            el.querySelector('div.T-I-atl').style.display = 'none';
            composeView.addButton({
                title: 'Cancel',
                iconClass: 'net_cancel T-I',
                type: 'SEND_ACTION',
                onClick: function(event) {
                    gmailDiscardDraft(composeView, sdk);
                    document.location.hash =
                        composeView.editingScheduled.returnTo;
                },
            });
            composeView.addButton({
                title: 'Save',
                iconClass: 'net_save',
                type: 'SEND_ACTION',
                onClick: function(event) {
                    saveMessage(composeView, sdk);
                },
            });
            var time = new Date(composeView.editingScheduled.info.timeUtc);
            var bar = composeView.addStatusBar({
                height: 32,
            });
            bar.el.innerHTML =
                '<div class="net_message-edit-status"><i class="fa fa-fw fa-check"></i> Scheduled to send ' +
                moment(time).calendar() +
                '</div>';
            var name = el.querySelector('.net_cancel').parentElement
                .parentElement.className;
            name = name.replace('T-I-atl', '').replace('T-I', '');
            el.querySelector(
                '.net_cancel'
            ).parentElement.parentElement.className = name;
            return;
        }

        // composing a new message or reply
        if (getKeepOnCheckboxState('FOLLOWUP') && localStorage.NET_storedAfuArm)
            composeView.afuArm = JSON.parse(localStorage.NET_storedAfuArm);
        if (!composeView.afuArm) composeView.afuArm = {};
        composeView.afuTemplates = {};
        composeView.lastAfuTemplate = null;
        if (localStorage.NET_afuTemplates)
            composeView.afuTemplates = JSON.parse(
                localStorage.NET_afuTemplates
            );
        if (localStorage.NET_lastAfuTemplate)
            composeView.lastAfuTemplate = localStorage.NET_lastAfuTemplate;
        if (
            !composeView.afuTemplates.hasOwnProperty('Nathans 87% Reply Rate')
        ) {
            composeView.afuTemplates['Nathans 87% Reply Rate'] = {
                sequence: [
                    {
                        status: 'NOT_REPLIED',
                        days: '2',
                        message: 'Hey, did you get the last email I sent?',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '4',
                        message:
                            'I know you’re busy, wanted to make sure I followed up on this email. Interested?',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '6',
                        message: '?',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '8',
                        message:
                            'I made a note to keep following up with you in my little black note book. Should I stop? I know you’re busy so I can’t tell if you’re just not interested or if you just haven’t gotten to this message yet.',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '10',
                        message: 'Bumping this ...',
                    },
                ],
            };
        }
        if (
            !composeView.afuTemplates.hasOwnProperty(
                'Nathan 1: Billionaires Reply, Podcast, Interview'
            )
        ) {
            composeView.afuTemplates[
                'Nathan 1: Billionaires Reply, Podcast, Interview'
            ] = {
                sequence: [
                    {
                        status: 'NOT_REPLIED',
                        days: '2',
                        message:
                            'Just following up. Did my last message go through?',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '5',
                        message: 'Bump',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '8',
                        message:
                            'The podcast was just ranked #1 by Inc: http://www.inc.com/sujan-patel/the-smartest-entrepreneurs-are-listening-to-these-10-podcasts.html\n\nWant to come on?',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '12',
                        message:
                            "Interview is 15 minutes long. You reach 2m CEO's and entrepreneurs. Game?",
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '20',
                        message: 'Did these go through?',
                    },
                ],
            };
        }
        if (
            !composeView.afuTemplates.hasOwnProperty(
                'Nathan 2: Sponsorship Cold Sequence'
            )
        ) {
            composeView.afuTemplates['Nathan 2: Sponsorship Cold Sequence'] = {
                sequence: [
                    {
                        status: 'NOT_REPLIED',
                        days: '2',
                        message:
                            'I know you’re busy. Are you able to help me out?',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '4',
                        message:
                            'Open to doing this next week when things calm down a bit on your end? Sorry for pestering!',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '6',
                        message: 'Are my emails going through ok?',
                    },
                ],
            };
        }
        if (
            !composeView.afuTemplates.hasOwnProperty(
                'Nathan 3: Get Partner, Podcast Guest To Email List'
            )
        ) {
            composeView.afuTemplates[
                'Nathan 3: Get Partner, Podcast Guest To Email List'
            ] = {
                sequence: [
                    {
                        status: 'NOT_REPLIED',
                        days: '2',
                        message:
                            'Bumping this :)\n\nYou can see how many downloads your episode needs in order to rank in top 10 all time here: \nhttps://docs.google.com/spreadsheets/d/1T7xgFQGLOZp4YrogCNMPLZRsV9tCZhPY56Yzd_weOIE/edit#gid=0\n\nI feature the top 10 shows to my list each week (its like me telling 65,000 about you directly via email each week). \n\nGame to email your episode to your community this week?',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '3',
                        message: 'Bump, are my emails going through to you ok?',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '5',
                        message:
                            "What's preventing you from sharing your episode with your community?\n\nIs it something I did?",
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '7',
                        message: '?',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '10',
                        message:
                            "I keep making a mental note each day to follow up with you. \n\nShoot me a quick reply if you can't share this episode with your audience, I'll stop following up!",
                    },
                ],
            };
        }
        if (
            !composeView.afuTemplates.hasOwnProperty(
                'Nathan 4: Get Webinar, Co-Marketing Partners'
            )
        ) {
            composeView.afuTemplates[
                'Nathan 4: Get Webinar, Co-Marketing Partners'
            ] = {
                sequence: [
                    {
                        status: 'NOT_REPLIED',
                        days: '2',
                        message:
                            'Game to come on? Id put you in between my two favorite guests. ',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '4',
                        message:
                            'Are these going through ok? My email has been acting up.',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '8',
                        message:
                            'Getting closer to the event. Almost full. Want a spot?',
                    },
                    {
                        status: 'NOT_REPLIED',
                        days: '16',
                        message: 'Thoughts?',
                    },
                ],
            };
        }

        var storedTrack = localStorage.getItem('NET_track');
        if (!storedTrack || storedTrack === '1') composeView.track = '1';
        else composeView.track = null;

        composeView.sendLaterTime = null;
        if (localStorage.getItem('NET_sendLaterTime'))
            composeView.sendLaterTime = JSON.parse(
                localStorage.NET_sendLaterTime
            );
        composeView.sendLaterTimes = null;
        if (localStorage.getItem('NET_storedSendLaterTimes'))
            composeView.sendLaterTimes = JSON.parse(
                localStorage.NET_storedSendLaterTimes
            );

        composeView.bumpTimes = null;
        if (localStorage.NET_storedBumpTimes)
            composeView.bumpTimes = JSON.parse(
                localStorage.NET_storedBumpTimes
            );
        composeView.bumpArm2 = null;
        if (getKeepOnCheckboxState('BUMP') && localStorage.NET_storedBumpArm2)
            composeView.bumpArm2 = JSON.parse(localStorage.NET_storedBumpArm2);

        var toolbar = composeView.addStatusBar({
            height: 44,
        });
        toolbar.el.innerHTML =
            '<table class="IZ aoC"><tr class="n1tfz">' +
            '<td class="gU Up"><div class="T-I J-J5-Ji ar7 L3 net_send-later-container aoO" aria-label="Send Later" role="button" tabindex="1" data-tooltip="Send Later"><div><div class="net_send-later">&nbsp;</div></div></div></td>' +
            '<td class="gU"><div class="Uz"></div></td>' +
            '<td class="a8X gU">' +
            '<div class="wG J-Z-I net_button" aria-label="Track Opens and Clicks" role="button" tabindex="1" data-tooltip="Track Opens and Clicks"><div><div class="fa fa-fw fa-eye-slash net_track-opens">&nbsp;</div></div></div>' +
            '<div class="wG J-Z-I net_button" aria-label="Reminder" role="button" tabindex="1" data-tooltip="Reminder"><div><div class="fa fa-fw fa-clock-o net_bump-notify">&nbsp;</div></div></div>' +
            '<div class="wG J-Z-I net_button" aria-label="Auto-Followups" role="button" tabindex="1" data-tooltip="Auto-Followups"><div><div class="fa fa-fw fa-reply-all net_auto-follow-ups">&nbsp;</div></div></div></td>' +
            '<td class="gU OoRYyc" style="width: 100%"></td>' +
            '<td class="gU az5" style="padding-right: 6px"><div class="wG J-Z-I net_button" aria-label="Dashboard" role="button" tabindex="1" data-tooltip="Dashboard"><div><div class="fa fa-fw fa-gear">&nbsp;</div></div></div></td>' +
            '</tr></table>';
        loadAsset('assets/schedule_form.html', function(text) {
            toolbar.el
                .querySelector('.net_send-later-container')
                .addEventListener('click', function(event) {
                    sendLater(event, composeView, sdk, text);
                });
        });
        var buttons = toolbar.el.querySelectorAll('.net_button');
        buttons[0].addEventListener('click', function(event) {
            toggleTrack(composeView, sdk, event);
        });
        toggleTrack(composeView, sdk);
        loadAsset('assets/bump_form.html', function(text) {
            buttons[1].addEventListener('click', function(event) {
                bumpNotify(event, composeView, sdk, text);
            });
        });
        armBumpNotify(composeView.bumpArm2 !== null, composeView, sdk);
        loadAsset('assets/follow_up_form.html', function(text) {
            buttons[2].addEventListener('click', function(event) {
                autoFollowUps(event, composeView, sdk, text);
            });
        });
        armAutoFollowUp(
            composeView.afuArm.sequence !== null,
            false,
            composeView,
            sdk
        );
        buttons[3].addEventListener('click', function(event) {
            var baseUrl = 'http://dashboard.thetopinbox.com/';
            if (chrome.runtime.id === 'nfddgbpdnaeliohhkbdbcmenpnkepkgn')
                baseUrl = 'http://dashboard.sndlatr.com/';
            window.open(
                baseUrl +
                    '?client=' +
                    chrome.runtime.id +
                    '&user_id=' +
                    encodeURIComponent(sdk.User.getEmailAddress()),
                '_blank'
            );
        });

        composeView.on('presending', _beforeSend(composeView, sdk));
        composeView.on('sent', _afterSend(composeView, sdk));
        composeView.on('destroy', function(messageId) {
            destroyComposeView(composeView);
        });

        auth.getToken(sdk, function(token) {
            if (!token) return;
            // get 'sent with tag' injection content
            var payload = {
                client: chrome.runtime.id,
                token: token,
            };
            simpleXHR(
                {
                    url: apis.gmail_get_send_with_tag,
                    payload: payload,
                },
                function(status, response) {
                    composeView.sendWithTag = response.tag;
                },
                function(status, response) {}
            );
            // validate credentials
            simpleXHR(
                {
                    url: apis.gmail_get_profile,
                    payload: payload,
                },
                function(status, response) {
                    // silent for valid credentials
                },
                function(status, response) {
                    if (
                        response.status &&
                        response.status === 'fail' &&
                        response.error &&
                        response.error.message &&
                        (response.error.message === 'invalid_grant' ||
                            response.error.message === 'unauthorized_client')
                    ) {
                        // invalid credentials, reauth
                        window.NET_INBOXSDK = sdk;
                        window.NET_GMAIL_AUTH_CALLBACK = null;
                        var email = sdk.User.getEmailAddress().toLowerCase();
                        window.open(
                            apis.gmail_auth +
                                '?client=' +
                                chrome.runtime.id +
                                '&user_id=' +
                                encodeURIComponent(email),
                            'authorizeGmail'
                        );
                    }
                }
            );

            // get alerts
            var now = new Date();
            payload = {
                client: chrome.runtime.id,
                token: token,
                utcTime: now.toISOString(),
                localTime: new Date(
                    now.getTime() - now.getTimezoneOffset() * 60000
                ).toISOString(),
            };
            simpleXHR(
                {
                    url: apis.gmail_get_alerts,
                    payload: payload,
                },
                function(status, response) {
                    if (
                        response.alert &&
                        response.alert.title &&
                        response.alert.content
                    )
                        displayAlert(
                            sdk,
                            response.alert.title,
                            response.alert.content,
                            response.alert.button
                        );
                },
                function(status, response) {}
            );
        });

        currentPromotions.forEach(function(promotion) {
            showPromotion(sdk, promotion);
        });
    };
};

function getLocalStorage(key) {
    let value = null;
    try {
        value = localStorage.getItem(key);
    } catch (e) {
        // localStorage disabled in browser
    }
    return value;
}

function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        // localStorage disabled in browser
    }
}

function showPromotion(sdk, promotion) {
    const today = new Date().getTime();
    const startDate = +new Date(promotion.startDate).getTime();
    const endDate = +new Date(promotion.endDate).getTime();
    const localStorageKey = 'NET_seen_promotion_' + startDate;

    if (
        getLocalStorage(localStorageKey) == null &&
        today >= startDate &&
        today < endDate
    ) {
        setLocalStorage(localStorageKey, 'true');
        const modal = sdk.Widgets.showModalView({
            title: promotion.title,
            el: `<div style="width: 350px">${
                promotion.body
            }<strong>You will only see this popup once.</strong></p>
            </div>`,
            buttons: [
                {
                    text: 'Click here to try it free',
                    onClick: () => {
                        modal.close();
                        window.open(promotion.link);
                    },
                    type: 'PRIMARY_ACTION',
                },
            ],
        });
    }
}
