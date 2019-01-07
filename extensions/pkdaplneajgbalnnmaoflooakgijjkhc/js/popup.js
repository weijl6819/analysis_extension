var Popup = (function(my){

  var bg = chrome.extension.getBackgroundPage();
  var defaultInvitation = false;

  my.init = function() {
    initUI();
    initMessaging();
    initUser();
    chrome.extension.onRequest.addListener(function(request) {
      if (request.ssoLoggedIn) {
        initScheduleButton({}, function(freshData) {
          showCongratulations(freshData);
        });
      }
      if (request.isAuthorizing) {
        loading();
      }
      if (request.loggedOut) {
        notLoading();
      }
    }.bind(my));
  };

  var loc = bg.App.loc;

  var loading = function() {
    $('#loader').show();
    $('#status').hide();
    $('button.btn').hide();
  };

  var notLoading = function() {
    $('#loader').hide();
    $('#status').hide();
    $('button.btn').show();
  }

  var initUI = function(){

    $('#loader').hide();

    $('a').click(function(e){
      e.preventDefault();
    });

    $('a[target="_blank"]').click(function(e){
      e.preventDefault();
      chrome.tabs.create({url: $(this).attr('href')});
    });


    $('.content').on('submit', '.form-emailcheck', function(e){
      e.preventDefault();
      var login = $('input#emailCheck');
      var loginVal = login.val();

      if (validateInput(login[0], "#emailCheck", "#emailCheckError")){
        $('#loader').show();
        $('#status').hide();
        bg.API.ssoEmailCheck(loginVal).then(function(result) {
          if (!result.sso) {
            showLoginForm(loginVal);
            $('input#password').focus();
          }
        }).catch(onError.bind(this));
      }
    });

    $('.content').on('submit', '.form-signin', function(e){
      e.preventDefault();
      var login = $('input#login');
      var password = $('input#password');
      var loginVal = login.val();

      if (validateInput(login[0], "#login", "#loginError") && validateInput(password[0], "#password", "#passwordError")){
        $('#loader').show();
        $('#status').hide();
        bg.API.login(loginVal, password.val(), {
          success: function(){
            bg.API.getCurrentUser().then(function() {
              $('#loader').hide();
              initScheduleButton({}, function(freshData) {
                  showCongratulations(freshData);
                })
            }).catch(function() {
              $('#loader').hide();
              showAccountExpired();
            });
          },
          error: onError
        });
      }
    });

    $('.content').on('click', '.action-close', function(){

    });
  };

  var validateUserAccount = function(login) {

  };

  var validateInput = function(field, inputId, inputError) {
    $(inputId).removeClass("has-error");
    $(inputError).html("");
    if (!field) {
      return false;
    }
    if (field.validity.valid) {
      return true;
    }
    $(inputId).addClass("has-error");
    $(inputError).html(field.validationMessage);
    return false;
  };

  var initUser = function(){
    chrome.storage.local.get(null, function(data){
      if (data.isAuthorizing) {
        loading();
      } else if (!data.authorized || !data.login) {
        showEmailCheckForm(data.login);
      }
      else {
        defaultInvitation = data.defaultInvitation || '';
        if (data.currentUser && data.inviteUrl && data.primaryNumber) {
          notLoading();
          showPopupMenu(data);
        } else {
          loading();
          initScheduleButton(data, function(freshData) {
            showPopupMenu(freshData);
            notLoading();
          });
        }
      }
    });
  };

  var initMessaging = function(){
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (!sender.tab) return;
        if (request.cmd === '') {
        }
      });
  };


  /**
   * Success/Error Handlers
   */

  var onSuccess = function(response){
    $('#status')
      .hide()
      .html( HTML.span(response.success) )
      .removeClass()
      .addClass('alert alert-success')
      .slideDown();
    $('#loader').hide();
    setTimeout(function(){
      $('#status').hide();
    }, 3000);
  };


  var onError = function(response){
    var text = typeof response === 'string' ? response : response.statusText;
    $('#status')
      .hide()
      .html( HTML.span(text) )
      .removeClass()
      .addClass('alert alert-danger')
      .slideDown();
    $('#loader').hide();
    setTimeout(function(){
      $('#status').hide();
    }, 5000);

  };


  /**
   * Show templates
   */

  var showEmailCheckForm = function(login) {
    var data = {
      login: login || '',
      _sign_in_info: loc('_sign_in_info'),
      _email: loc('_email'),
      _sign_in: loc('_sign_in')
    };

    var template = $('#emailCheck').html();
    var resHtml = Mustache.to_html(template, data);
    var $content = $('.content');
    $content.html(resHtml);
    if (login) {
      $content.find('input#emailCheck').val(login).focus();
    }
  }

  var showLoginForm = function(login, password){
    var data = {
      login: login || '',
      password: password || '',
      _sign_in_info: loc('_sign_in_info'),
      _email: loc('_email'),
      _password: loc('_password'),
      _sign_in: loc('_sign_in')
    };
    var template = $('#loginTpl').html();
    var resHtml = Mustache.to_html(template, data);
    var $content = $('.content');
    $('#loader').hide();
    $content.html(resHtml);
    var $login = $content.find('#login');
    $login[0].oninput = function() {
      showEmailCheckForm($login.val());
    };
  };


  var showCongratulations = function(data){
    $('#loader').hide();
    var template = $('#popupMenuTpl-congrats').html();
    var resHtml = Mustache.to_html(template, {
      _congratulations: loc('_congratulations'),
      _login_success_info: loc('_login_success_info'),
      _advanced_settings: loc('_advanced_settings'),
      _schedule_meeting: loc('_schedule_meeting')
    });
    $('.content').html(resHtml);
    document.getElementById('schedule-btn')
        .addEventListener('click', function() {
          initCustomNumbers(data).then(function() {
            onCalendarClick(data);
          });
        });
  };

  var showAccountExpired = function(){
    var template = $('#popupMenuTpl-accountExpired').html();
    var resHtml = Mustache.to_html(template,{
      _account_expired: loc('_account_expired')
    });
    $('.content').html(resHtml);
    $('.content').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
  };

  var initInvites = function(data){
    return new Promise(function(resolve) {
      if (data.inviteUrl && Object.keys(data.inviteUrl).length) {
        resolve(data.inviteUrl)
      } else {
        chrome.runtime.sendMessage({cmd: 'getInviteUrls'}, function(urls){
          resolve(urls);
        });
      }
    })
  };

  var initCustomNumbers = function(data){
    return new Promise(function(resolve, reject) {
      if (data && data.customNumbers) {
        resolve()
      } else {
        chrome.runtime.sendMessage({cmd: 'getCustomNumbers'}, function (numbers) {
          if (!Array.isArray(numbers)) return reject();

          var customNumbers = numbers.map(function (number) {
            return loc('_country_code_' + number.countryCode) + ': ' + number.phoneNumber;
          });
          resolve(customNumbers);
        });
      }
    })
  };

  var initPrimaryNumber = function(data) {
    return new Promise(function (resolve) {
      if (data.cachedNumber) {
        resolve(cachedNumber)
      } else {
        chrome.runtime.sendMessage({cmd: 'getPrimaryNumber'}, function (number) {
          var primaryNumber = loc('_country_code_' + number.countryCode) + ': ' + number.phoneNumber;
          resolve(primaryNumber);
        });
      }
    });
  };

  var getUserInfo = function(){
    return new Promise(function(resolve) {
      chrome.runtime.sendMessage({cmd: 'getRoomList'}, function(roomList){
        resolve(roomList[0]);
      });
    })
  };

  var getMeeting = function(data) {
    var meetings = $.grep(data.cachedRoomList, function(e) {
      return e.value == data.defaultCalling;
    });
    if (!meetings || meetings.length !== 1) return null;
    return meetings[0];
  };

  var initScheduleButton = function (data, callback) {
    initInvites(data)
        .then(initCustomNumbers(data))
        .then(initPrimaryNumber(data))
        .then(getUserInfo(data))
        .then(function() {
          chrome.storage.local.get(null, function(data) {
            callback(data);
          });
        }).catch(function(err) {
          console.warn(err);
        });
  };

  var onCalendarClick = function(data) {
    if (!data) return;
    bg.API.getAuthToken().then(function(token) {
      var inviteUser = data.defaultCalling ? getMeeting(data) : data.currentUser;
      if (!inviteUser) return;
      var id = inviteUser.value;
      var customNumbers = data.customNumbers || [];
      var userTitle = inviteUser.text;
      var location = loc('_lifesize_cloud');
      var indent = '   ';
      var extensionString = ' ' + loc('_extension') + ' ' + id;

      if (!id) return;
      var title = loc('_invite_email_subject').replace(/{Meeting_name}/g, userTitle);
      var body1 = loc('_invite_email_body1').replace(/{Meeting_name}/g, userTitle);
      var callMe = indent + data.inviteUrl.guestInviteUrl.replace(/\/[\d]+/gi, '/' + id) + '\n\n';
      var body2 = indent + loc('_invite_email_body2').replace(/{Extn}/g, id);
      var body3 = '\n' + indent + loc('_invite_email_body3').replace(/{NumbersLink}/g, indent + data.inviteUrl.clusterInboundPSTNNumberListURL +'\n\n');
      var body4 = loc('_invite_email_body4');

      var printedNumbers = customNumbers.map(function(number) {
        return '   ' + number + extensionString + '\n';
      });

      if (!printedNumbers.length && data.primaryNumber) {
        printedNumbers = ['   ' + data.primaryNumber + extensionString + '\n'];
      }

      var passcode;
      if (inviteUser.pinProtected) {
        passcode = '   ' + loc('_invite_email_passcode_protected') + '\n';
        body1 += passcode;
        body2 += passcode;
      } else if (inviteUser.pin && inviteUser.pin.length) {
        passcode = '   ' + loc('_invite_email_enter_passcode').replace(/{Passcode}/g, inviteUser.pin) + '\n';
        body1 += passcode;
        body2 += passcode;
      }

      if (defaultInvitation) {
        body1 = defaultInvitation + '\n\n' + body1;
      }

      var descriptionTextArray = [body1, callMe, body2, printedNumbers.join(''), body3, body4];

      var calendarRequest = new XMLHttpRequest();
      Date.prototype.addHours= function(h){
        this.setHours(this.getHours()+h);
        return this;
      };
      var currentTime = new Date();
      var calendarParams = {
        "kind": "calendar#event",
        "summary": title,
        "description": descriptionTextArray.join(''),
        "location": location,
        "start": {
          "dateTime": currentTime.toISOString()
        },
        "end": {
          "dateTime": currentTime.addHours(1).toISOString()
        },
        "extendedProperties": {
          "private": {
            "meetingId": id
          }
        }
      };
      calendarRequest.onreadystatechange = function() {
        if (calendarRequest.readyState === 4 && calendarRequest.response) {
          var parsedResponse = JSON.parse(calendarRequest.response);
          if (parsedResponse.htmlLink) {
            chrome.tabs.create({url: parsedResponse.htmlLink});
          }
        }
      };
      calendarRequest.open("POST", "https://www.googleapis.com/calendar/v3/calendars/primary/events");
      calendarRequest.setRequestHeader('Authorization',
          'Bearer ' + token);
      calendarRequest.setRequestHeader("Content-Type", "application/json");
      calendarRequest.send(JSON.stringify(calendarParams));
    });
  };

  var showPopupMenu = function(data){
    var template = $('#popupMenuTpl').html();
    var resHtml = Mustache.to_html(template, {
      _extension_settings: loc('_extension_settings'),
      _schedule_google: loc('_schedule_google')
    });
    $('.content').html(resHtml);
    document.getElementById('calendar-button')
      .addEventListener('click', function() {
        initCustomNumbers(data).then(function() {
          onCalendarClick(data);
        });
      });
  };

  return my;

})(Popup || {});

Popup.init();
