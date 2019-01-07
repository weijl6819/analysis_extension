
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
var GCal = (function(my){
  var selectors = {
    title: '#xTiIn',
    video: '#xRTCIn',
    where: '#xLocIn input',
    guestList: '#xGstLst > div',
    startDate: '#xStDaIn',
    startTime: '#xStTiIn',
    endDate: '#xEnDaIn',
    endTime: '#xEnTiIn',
    timeLine: '#xDaRaSel',
    timeZone: '#xTimezone',
    allDay: '#xAlDaCbx',
    frequency: '.ry3kXd.Ulgu9'
  };
  var oldSelectors = {
    title: '.ui-sch.ep-title input',
    video: '.ui-sch .rtcs',
    where: '.ep-dp-input .ui-sch input'
  };
  var oldEditSelectors = {
    title: '.ui-sch.ep-title .ui-sch-schmedit',
    video: '.ep-dp-rtc',
    where: '.ep-dp-input .ui-sch .ui-sch-schmedit'
  };
  var loc = function(s) {
    return chrome.i18n.getMessage(s) || s.substr(1);
  };
  var login = '';
  var loadingLists = false;
  var loadingNumbers = false;
  var lifesizeButton = null;
  var whereInput = null;
  var titleInput = null;
  var guestList = [];
  var addVideoCallNode;
  var defaultCalling;
  var defaultInvitation = '';
  var baseUrl = '';
  var primaryNumber = null;
  var inviteUrls = [];
  var localData = {};
  var lifesizeMeetingId = null;
  var savedTabContent;

  var meetingList = [];

  var getEventId = function() {
    var path = window.location.pathname;
    var binaryEid;
    if (path.indexOf('render') > -1) {
      var calendarEvent = document.querySelector('.ep');
      if (calendarEvent) {
        binaryEid = calendarEvent.getAttribute('data-eid');
      }
    } else {
      var parsedPath = path.split('/');
      binaryEid = parsedPath[parsedPath.length - 1];
    }
    try {
      return atob(binaryEid).split(' ')[0]
    } catch(e) {
      return false;
    }
  };

  my.init = function() {
    loadingNumbers = true;
    HTML.display('#lifesizeLoader', true);
    window.addEventListener("load", function(e){
      initUser();
    });
    sendMessage('getSettings', {}, function(settings){
    });
    sendMessage('getPrimaryNumber', {}, function(number){
      primaryNumber = loc('_country_code_' + number.countryCode) + ': ' + number.phoneNumber;
    });
    sendMessage('getInviteUrls', {}, function(urls){
      inviteUrls = urls;
    });
    sendMessage('getCustomNumbers', {} , function(numbers) {
      if (!loadingLists) {
        HTML.display('#lifesizeLoader', false);
      }
      loadingNumbers = false;
    })
  };


  var initUser = function(){
    chrome.storage.local.get(null, function(data){
      localData = data;
      processNode( document.body );
      if (!data.authorized) return;
      login = data.login;
      defaultCalling = data.defaultCalling;
      defaultInvitation = data.defaultInvitation || '';
      baseUrl = data.baseUrl;
      initObserver();
    });
  };


  /**
   * ================== Mutation Observer
   */
  var initObserver = function(){
    var target = document.querySelector('body');

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          processChildList(mutation.addedNodes);
        }
      });
    });

    var config = { subtree: true, childList: true, characterData: true };
    observer.observe(target, config);
  };


  var processChildList = function(children){
    for (var i = 0, len = children.length; i < len; i++) {
      var node = children[i];
      processNode(node);
    }
  };


  var processNode = function(node){
    // ignore text nodes
    if (node.nodeType === 3 || !node.parentNode) return;
    var videoWrap = node.parentNode.querySelector(selectors.video) || node.parentNode.querySelector(oldSelectors.video) || node.parentNode.querySelector(oldEditSelectors.video);
    var where = node.parentNode.querySelectorAll(selectors.where) || node.parentNode.querySelector(oldSelectors.where) || node.parentNode.querySelector(oldEditSelectors.where);
    var oldTitle = node.parentNode.querySelector(oldSelectors.title) || node.parentNode.querySelector(oldEditSelectors.title);
    var title = node.parentNode.querySelector(selectors.title) || oldTitle;
    if (where.length) whereInput = where;
    if (title) titleInput = title;
    if (videoWrap && !videoWrap.querySelector('#lifesizeButton')) {
      addLifesizeUI(videoWrap);
    }

    // Hacky- dom manipulation was necessary to preserve function. WEBTOP-2568
    // Check here if something breaks on tab switching.
    var eventDetailsTab = node.parentNode.querySelector('#tabEventDetails');
    var timeTab = node.parentNode.querySelector('#tabFindATime');

    if (timeTab) {
      var config = { attributes: true, childList: false, subtree: false };

      var callback = function(mutationsList) {
        mutationsList.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (mutation.target.classList.length === 3) {
              if (eventDetailsTab.innerHTML.length) {
                savedTabContent = eventDetailsTab.innerHTML;
              }
              eventDetailsTab.innerHTML = '';
            } else {
              eventDetailsTab.innerHTML = savedTabContent;
            }
          }
        })
      };

      var tabObserver = new MutationObserver(callback);
      tabObserver.observe(timeTab, config);
    }
  };

  /**
   * ================== UI
   */


  /**
   * Inject button
   * @param {node} wrap - parent element
   */
  var addLifesizeUI = function(wrap) {
      var img = document.createElement('span');
      img.id = "lifesizeButton";
      img.className = 'lk-button';
      img.innerHTML = '<span>' + loc('_meet_on_lifesize') + '</span>';
      $(img).prepend('<img src="' + chrome.extension.getURL('/img/icon_white_32x27.png') + '"/>');
      wrap.style.flexDirection = "column";
      wrap.style.alignItems = "baseline";
      wrap.appendChild(img);

      var status = document.createElement('div');
      status.id = 'lifesizeStatus';
      status.textContent = 'status';
      status.style.display = 'none';
      wrap.appendChild(status);

      var loader = document.createElement('img');
      loader.id = 'lifesizeLoader';
      loader.src = chrome.extension.getURL('/img/loader.gif');
      if (!loadingNumbers) {
        loader.style.display = 'none';
      }
      wrap.appendChild(loader);
      wrap.parentNode.parentNode.classList.add('visibleVideoRow');

      lifesizeButton = img;
      lifesizeMeetingId = null;
      getEvent().then(function(eventId) {
        if (eventId) {
          lifesizeMeetingId = eventId;
        }
        if (lifesizeMeetingId) {
          lifesizeButton.className = 'no-click-button';
          addVideoCallNode = wrap.firstChild;
          if (addVideoCallNode.getAttribute('id') !== 'lifesizeButton') {
            addVideoCallNode.style.display = 'none';
          }
          meetingPopulator(this, lifesizeMeetingId);
        } else {
          chrome.runtime.sendMessage({cmd: 'getRoomList'}, function (response) {
            lifesizeButton.onclick = function () {
              sendMessage('getCustomNumbers', {} , function() {
                loadingNumbers = false;
                onCalendarClick({}, localData.defaultCalling ? getMeeting(response, localData.defaultCalling) : response[0]);
              });
            };
          });
        }
      });
  };


  /**
   * Get meeting list, append selectbox with rooms
   */
  var meetingPopulator = function(button, currentMeetingId){
    var injected = document.querySelectorAll('#lifesizeSelect');
    if ((injected && injected.length)) return;
    $(button).addClass('active');
    meetingList = [];
    var $selectWrap = $('<div></div>');
    $(lifesizeButton).after($selectWrap);
    getRoomList($selectWrap, function(evt) {
      sendMessage('getCustomNumbers', {} , function() {
        loadingNumbers = false;
        onCalendarClick(evt, null, currentMeetingId)
      });
    });
  };

  var getRoomList = function($selectWrap, customHandler) {
    HTML.display('#lifesizeLoader', true);
    HTML.display('#lifesizeStatus', false);
    loadingLists = true;
    chrome.runtime.sendMessage({cmd: 'getRoomList'}, function(response){
      HTML.display('#lifesizeStatus', false);
      loadingLists = false;
      if (!loadingNumbers) {
        HTML.display('#lifesizeLoader', false);
      }
      if (response.error) {
        document.querySelector('#lifesizeStatus').textContent = response.error;
        HTML.display('#lifesizeStatus', true);
        return;
      }
      meetingList = response;
      var select = HTML.generateSelect(meetingList, lifesizeMeetingId || defaultCalling, customHandler);
      $selectWrap.html(select);
      var $searchable = $(select).chosen({search_contains: true});
    });
  };

  var onCalendarClick = function(evt, newSelfEvent, currentMeetingId) {
    var eventId = getEventId();
    if (!newSelfEvent && !evt.target) return;
    var newMeeting = newSelfEvent || getMeeting(meetingList, evt.target.value);
    var currentMeeting = currentMeetingId ? getMeeting(meetingList, currentMeetingId) : null;
    var guestListNode = document.querySelector(selectors.guestList);
    if (guestListNode) guestList = guestListNode.children;

    sendMessage('getAuthToken', { interactive: true }, function(token) {
      var id = newMeeting.value;
      var customNumbers = localData.customNumbers || [];
      var meetingTitle = newMeeting.text;
      var currentMeetingTitle = currentMeetingId ? currentMeeting.text : null;
      var location = loc('_lifesize_cloud');
      if (whereInput) {
        var currentLocation = whereInput[whereInput.length - 1].value || whereInput[whereInput.length - 1].innerText || whereInput[whereInput.length - 1].getAttribute('data-initial-value');
        if (currentLocation && currentLocation.length && currentLocation !== location) {
          location = currentLocation;
        }
      }
      if (guestList && guestList.length) {
        var attendees = [];
        for (var i = 0, len = guestList.length; i < len; i++) {
          var guestElement = guestList[i];
          if (!guestElement) return;
          var mappedAttendee = {};
          mappedAttendee.id = guestElement.getAttribute('data-id');
          mappedAttendee.email = guestElement.getAttribute('data-email');
          var label = guestElement.getAttribute('aria-label');
          if (label) {
            mappedAttendee.organizer = label.indexOf('Organizer') !== -1;
            mappedAttendee.optional = label.indexOf('Optional') !== -1;
          }
          mappedAttendee.self = guestElement.id === 'xDtlDlgOrg';
          if (mappedAttendee.id) {
            attendees.push(mappedAttendee);
          }
        }
      }
      var indent = '   ';
      var extensionString = ' ' + loc('_extension') + ' ' + id;

      if (!id) return;
      var title = loc('_invite_email_subject').replace(/{Meeting_name}/g, meetingTitle);
      var previousTitle = loc('_invite_email_subject').replace(/{Meeting_name}/g, currentMeetingTitle);
      var currentTitle = titleInput.value || titleInput.innerText;
      if (currentTitle &&
          currentTitle.length &&
          currentTitle !== previousTitle &&
          titleInput.classList.value.indexOf('ui-placeholder') === -1) {
            title = currentTitle;
          }
      var body1 = loc('_invite_email_body1').replace(/{Meeting_name}/g, meetingTitle);
      var callMe = indent + localData.inviteUrl.guestInviteUrl.replace(/\/[\d]+/gi, '/' + id) + '\n\n';
      var body2 = indent + loc('_invite_email_body2').replace(/{Extn}/g, id);
      var body3 = '\n' + indent + loc('_invite_email_body3').replace(/{NumbersLink}/g, indent + localData.inviteUrl.clusterInboundPSTNNumberListURL +'\n\n');
      var body4 = loc('_invite_email_body4');

      var printedNumbers = customNumbers.map(function(number) {
        return '   ' + number + extensionString + '\n';
      });

      if (!printedNumbers.length && localData.primaryNumber) {
        printedNumbers = ['   ' + localData.primaryNumber + extensionString + '\n'];
      }

      var passcode;
      if (newMeeting.pinProtected) {
        passcode = '   ' + loc('_invite_email_passcode_protected') + '\n';
        body1 += passcode;
        body2 += passcode;
      } else if (newMeeting.pin && newMeeting.pin.length) {
        passcode = '   ' + loc('_invite_email_enter_passcode').replace(/{Passcode}/g, newMeeting.pin) + '\n';
        body1 += passcode;
        body2 += passcode;
      }

      if (defaultInvitation) {
        body1 = defaultInvitation + '\n\n' + body1;
      }

      var descriptionTextArray = [body1, callMe, body2, printedNumbers.join(''), body3, body4];

      var updateCalendar = function(existingMeeting) {
        Date.prototype.addHours= function(h){
          this.setHours(this.getHours()+h);
          return this;
        };
        var start;
        var end;
        var startTime, startDate, endTime, endDate, timeZone, frequency, userTimeZone, isAllDay;
        var startTimeZone = '.000Z';
        var endTimeZone = '.000Z';

        var timeZoneRegExp = /[\-,\+]+[0-9]+[0-9]+:+[0-9]+[0-9]/gi;

        var startTimeNode = document.querySelector(selectors.startTime);
        var startDateNode = document.querySelector(selectors.startDate);
        var endTimeNode = document.querySelector(selectors.endTime);
        var endDateNode = document.querySelector(selectors.endDate);
        var timeLineNode = document.querySelector(selectors.timeLine);
        var frequencyNode = document.querySelector(selectors.frequency);
        var timeZoneNode = document.querySelector(selectors.timeZone);
        var allDayNode = document.querySelector(selectors.allDay);

        if (startTimeNode) startTime = startTimeNode.getAttribute('data-initial-value');
        if (startDateNode) startDate = startDateNode.getAttribute('data-initial-value');
        if (endTimeNode) endTime = endTimeNode.getAttribute('data-initial-value');
        if (endDateNode) endDate = endDateNode.getAttribute('data-initial-value');
        if (timeZoneNode) userTimeZone = timeZoneNode.innerText;
        if (timeLineNode) timeZone = timeLineNode.innerText ? timeLineNode.innerText.match(timeZoneRegExp) : null;
        if (allDayNode) isAllDay = allDayNode.getAttribute('aria-checked') === 'true';
        // Cant set frequency for existing meetings because Google does something crazy to convert meetings into sequences
        if (!existingMeeting && frequencyNode && frequencyNode.children) {
          var frequencies = frequencyNode.children;
          for (var i = 0, len = frequencies.length; i < len; i++) {
            if (frequencies[i].getAttribute('aria-selected') === 'true') {
              var dataValue = frequencies[i].getAttribute('data-value');
              if (dataValue) {
                var frequencyValue = JSON.parse(dataValue);
                if (frequencyValue[3]) {
                  frequency = frequencyValue[3];
                }
              }
            }
          }
        }

        var parsedStart, parsedEnd;

        if (timeZone && timeZone.length) {
          startTimeZone = timeZone[0];
          if (timeZone[1]) {
            endTimeZone = timeZone[1];
          } else {
            endTimeZone = timeZone[0];
          }
        }

        if (startTime) {
          parsedStart = moment(startDate + ' ' + startTime, "MMM D, YYYY HH:mma");
        } else {
          parsedStart = moment(startDate);
        }

        start = { dateTime: parsedStart.toISOString().split('.')[0] + startTimeZone };

        if (endTime) {
          parsedEnd = moment(endDate + ' ' + endTime, "MMM D, YYYY HH:mma");
        } else {
          parsedEnd = moment(endDate);
        }

        end = { dateTime: parsedEnd.toISOString().split('.')[0] + endTimeZone };

        if (isAllDay) {
          parsedStart = moment(startDate).format('Y-MM-DD');
          start = { date: parsedStart };

          parsedEnd = moment(endDate).format('Y-MM-DD');
          end = { date: parsedEnd }
        }

        var calendarParams = {
          "kind": "calendar#event",
          "summary": title,
          "description": descriptionTextArray.join(''),
          "location": location,
          "start": start,
          "end": end,
          "extendedProperties": {
            "private": {
              "meetingId": id
            }
          },
          "attendees": attendees
        };

        if (frequency) {
          calendarParams.recurrence = [frequency];
          calendarParams.start.timeZone = userTimeZone;
          calendarParams.end.timeZone = userTimeZone;
        }

        calendarRequest.onreadystatechange = function() {
          if (calendarRequest.readyState === 4 && calendarRequest.response) {
            window.onbeforeunload = null;
            if (newSelfEvent) {
              var parsedResponse = JSON.parse(calendarRequest.response);

              if (parsedResponse.error) {
                console.error(JSON.stringify(parsedResponse.error));
              } else {
                var eid = parsedResponse.htmlLink.split('eid=')[1];
                // Determine if we're in old or new calendar
                var oldCalendar = window.location.pathname.indexOf('render') > -1;
                if (oldCalendar) {
                  var enforceEditPage = '#eventpage_6';
                  window.location = parsedResponse.htmlLink + enforceEditPage;
                } else {
                  window.location = 'https://calendar.google.com/calendar/r/eventedit/' + eid + '?sf=true&output=xml';
                }
              }
            } else {
              window.location.reload(true);
            }
          }
        };
        if (newSelfEvent) {
          calendarRequest.open("POST", "https://www.googleapis.com/calendar/v3/calendars/primary/events");
        } else {
          calendarRequest.open("PUT",  "https://www.googleapis.com/calendar/v3/calendars/primary/events/" + eventId);
        }
        calendarRequest.setRequestHeader('Authorization',
          'Bearer ' + token);
        calendarRequest.setRequestHeader("Content-Type", "application/json");
        calendarRequest.send(JSON.stringify(calendarParams));
      };

      var calendarRequest = new XMLHttpRequest();

      if (eventId) {
        var existingCalendarRequest = new XMLHttpRequest();

        existingCalendarRequest.onreadystatechange = function() {
          if (existingCalendarRequest.readyState === 4 && existingCalendarRequest.response) {
            window.onbeforeunload = null;
            newSelfEvent = false;
            updateCalendar(true);
          }
        };

        existingCalendarRequest.open("GET",  "https://www.googleapis.com/calendar/v3/calendars/primary/events/" + eventId);
        existingCalendarRequest.setRequestHeader('Authorization',
          'Bearer ' + token);
        existingCalendarRequest.setRequestHeader("Content-Type", "application/json");
        existingCalendarRequest.send();
      } else {
        updateCalendar();
      }
    });
  };

  var getMeeting = function(meetingList, id) {
    var meetings = $.grep(meetingList, function(e) {
      return e.value == id;
    });
    if (!meetings || meetings.length !== 1) return null;
    return meetings[0];
  };

  var getEvent = function() {
    return new Promise(function(resolve) {
      sendMessage('getAuthToken', {}, function(token) {
        var calendarRequest = new XMLHttpRequest();
        calendarRequest.onreadystatechange = function() {
          if (calendarRequest.readyState === 4 && calendarRequest.response) {
            var parsedResponse = JSON.parse(calendarRequest.response);
            if (parsedResponse.error) return resolve(false);
            if (parsedResponse.extendedProperties && parsedResponse.extendedProperties.private.meetingId) {
              resolve(parsedResponse.extendedProperties.private.meetingId)
            } else {
              resolve(false);
            }
          }
        };
        var eventId = getEventId();
        var isValid = function(str) { return /^\w+$/.test(str) && str.length >= 5 };
        if (!eventId || !isValid(eventId)) {
          return resolve();
        }
        calendarRequest.open("GET", "https://www.googleapis.com/calendar/v3/calendars/primary/events/" + eventId);
        calendarRequest.setRequestHeader('Authorization',
            'Bearer ' + token);
        calendarRequest.setRequestHeader("Content-Type", "application/json");
        calendarRequest.send();
      });
    });
  };

  /**
   * Send message to the extension background script
   * @param {string} cmd - what kind of data will be sent
   * @param  {object} data
   */
  var sendMessage = function(cmd, data, callback){
    if (!callback) callback = function(){};
    chrome.runtime.sendMessage({
      cmd: cmd,
      data: data
    }, callback);
  };


  return my;

})(GCal || {});

GCal.init();
