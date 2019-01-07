$(function() {
var bkg = chrome.extension.getBackgroundPage();
//var signupLock = false;
var connectDelay = 1000;
var localTimeTimer;

$('[data-resource]').each(function() {
  var el = $(this);
  var resourceName = el.data('resource');
  var resourceText = chrome.i18n.getMessage(resourceName);
  el.text(resourceText);
});

window.setInterval(function() {
  var time = formatTime(bkg.getUnixtime() - bkg.lastConnectTime);
  $('#conn-time-hours').text(time.hh);
  $('#conn-time-minutes').text(time.mm);
  $('#conn-time-seconds').text(time.ss);
}, 1000);

async function wait(ms) {
  await new Promise(resolve => setTimeout(() => resolve(), ms));
}

function updateUI() {
  $('p.country').text(locations[bkg.settings.location].country);
  $('p.city > b:first-child').text(locations[bkg.settings.location].city);

  if (bkg.settings.premium) {
    $('#premium-account-button').show();
    $('#get-premium-button').hide();

    $('.bubbleConnected').hide();
  } else {
    $('#get-premium-button').show();
    $('#premium-account-button').hide();

    $('.bubbleConnected').show();
  }

  if (bkg.settings.enabled) {
    var time = formatTime(bkg.getUnixtime() - bkg.lastConnectTime);
    $('#conn-time-hours').text(time.hh);
    $('#conn-time-minutes').text(time.mm);
    $('#conn-time-seconds').text(time.ss);

    setLocalTimeTimer();

    $('.layoutMain').hide();
    $('.layoutConnected > div').attr('class', bkg.settings.location);
    $('.layoutDisconnecting > div').attr('class', bkg.settings.location);
    $('.layoutConnected').show();
  } else {
    $('.layoutConnecting').hide();
    $('.layoutConnected').hide();
  }
}

var proxyControl = true;
var proxyControlApp = {};

chrome.management.getAll(function(a) {
  a.forEach (function(ext) {
    if (ext.id == chrome.runtime.id ||
      ext.enabled == false) {
      return;
    }

    ext.permissions.forEach(function(p) {
      if (p == 'proxy') {
        proxyControl = false;
        proxyControlApp.name = ext.shortName;
        proxyControlApp.id = ext.id;
      }
    });
  });

  if (!proxyControl) {
    $('#proxy-control-layout .anotherApp').text(proxyControlApp.name);
    $('#proxy-control-layout').show();

    if (bkg.settings.token == null) {
        showSigninView();
    } else {
      showMainView();
    }
  } else if (!navigator.onLine) {
    $('#check-conn-layout').show();
  } else if (bkg.settings.token == null) {
      showSigninView();
  } else {
    showMainView();
  }
});

$('#proxy-control-layout .orangeBtn').click(function() {
  chrome.management.setEnabled(proxyControlApp.id, false);
  $('#proxy-control-layout').hide();

  if (bkg.settings.token == null) {
    showSigninView();
  } else {
    showMainView();
  }
});

function resetSigninFields() {
  $('#signin-email').val('');
  $('#signin-password').val('');
  $('#signin-retry-password').val('');
  $('#password-set-password').val('');
  $('#signup-password').val('');
  $('#password-reset-code').val('');
}

function showSigninView() {
  $('#main-view').hide();

  var box = bkg.settings.signinBoxState;
  if (!bkg.settings.signinBoxState) {
    box = '#signin-email-box';
  }

  if (box != '#signin-email-box') {
    $('#signin-back-button').show();
  }

  $('#loader').hide();

  for (var i = 0; i < bkg.settings.signinBoxStateData.length; i++) {
    var item = bkg.settings.signinBoxStateData[i];

    switch (item.type) {
      case 'input':
          $(item.id).val(item.value);
        break;

      case 'text':
          $(item.id).text(item.value);
        break;

      case 'class':
          $(item.id).removeClass().addClass(item.value);
        break;
    }
  }

  //$(box).css('left', 0);
  $(box).show();

  $('#signin-view').show();
  $('#signin-email').focus();
}

function showMainView() {
  /*if (!bkg.settings.premium) {
    bkg.settings.location = 'us';
  }*/

  updateUI();

  renderLocations(null, '.region-top-btn');

  $('.version').text(chrome.runtime.getManifest().version);

  var switchSettings = [{
      name: 'bandwidthSaver',
      el: '#bandwidth-saver-switch'
    }, {
      name: 'adblock',
      el: '#adblock-switch'
    }, {
      name: 'trackingProtection',
      el: '#tracking-protection-switch'
    }, {
      name: 'blockAnalytics',
      el: '#block-analytics-switch'
    }, {
      name: 'firewall',
      el: '#firewall-switch'
    }, {
      name: 'autoStart',
      el: '#auto-start-switch'
    }, {
      name: 'hideAppIcon',
      el: '#hide-app-icon'
    }];

  for (var i = 0; i < switchSettings.length; i++) {
    var state = bkg.settings[switchSettings[i].name] ? 'on' : 'off';
    $(switchSettings[i].el + ' > .switch').addClass('switch-' + state);
  }

  $('#adblock-stat').text(bkg.settings.adblockStat);
  $('#trackers-stat').text(bkg.settings.trackersStat);
  //$('#analytics-stat').text(bkg.settings.analyticsStat);
  //$('#firewall-stat').text(bkg.settings.firewallStat);

  renderStat();

  $.ajax({
      url: bkg.apiHost + '/3/user/blocked-stat',
      contentType: 'application/json',
      type: 'POST',
      tryCount: 0,
      retryLimit: 3,
      data: JSON.stringify({
        token: bkg.settings.token
      }),
      dataType: 'json',
      success: function(data) {
        if (data.code != 0) {
          return;
        }

        bkg.settings.adblockStat = data.stat.adblock;
        bkg.settings.trackersStat = data.stat.trackingProtection;
        bkg.settings.analyticsStat = data.stat.blockAnalytics;
        bkg.settings.firewallStat = data.stat.firewall;

        renderStat();
      },
      error: function() {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          $.ajax(this);
          return;
        }
      },
      complete: function(xhr) {
        bkg.sendFailMetric(xhr);
      }
    });

  //$('#main-view').show();
  //$('#signin-view').hide();

  bkg.updateUserInfo(function() {
    renderLocations(null, '.region-top-btn');
    //setTimeout(updateUI, connectDelay * 2);
    updateUI();

    $('#main-view').show();
    $('#signin-view').hide();

    updateNetworkInfo();
  });
}

function updateNetworkInfo() {
  if (!bkg.settings.connectionInfo) {
    return;
  }

  if (!bkg.settings.enabled) {
    return;
  }

  $('#conn-info-node-ip').text(bkg.settings.nodesIps[bkg.settings.location]);
  $('#conn-info-rtt').text(bkg.settings.bwStat[bkg.settings.location].rtt);

  if (bkg.settings.premium) {
    $('#conn-info-bw').text(bkg.settings.bwStat[bkg.settings.location].premiumBw);
  } else {
    $('#conn-info-bw').text(bkg.settings.bwStat[bkg.settings.location].freeBw);
  }
}

function renderStat() {
  var items = {
    adblock: {
      el: '#adblock-stat',
      val: 'adblockStat'
    },
    trackingProtection: {
      el: '#trackers-stat',
      val: 'trackersStat'
    }/*,
    blockAnalytics: {
      el: '#analytics-stat',
      val: 'analyticsStat'
    },
    firewall: {
      el: '#firewall-stat',
      val: 'firewallStat'
    }*/
  }

  for (var key in items) {
    var item = items[key];

    if (bkg.settings[key] /*&& bkg.settings.enabled*/) {
      /*animateNumbers(
        $(item.el).text(),
        bkg.settings[item.val],
        item.el);*/
    } else {
      //$(item.el).text('off');
    }
  }
}

function switchProxyState(callback) {
  if (bkg.settings.enabled) {
    bkg.disableProxy();

    renderLocations(null, '.region-top-btn');
    $('.layoutDisconnecting').fadeIn(500, async function() {
      $('.layoutMain').show();
      $('.layoutConnected').hide();
      await wait(1200);
      $('.layoutDisconnecting').fadeOut(500);

      callback();
      clearInterval(localTimeTimer);
    });
  } else {
    setLocalTimeTimer();

    //$('.layoutConnected').hide();
    //$('.layoutMain').show();
    $('.layoutConnecting > div').attr('class', bkg.settings.location);
    $('.layoutDisconnecting > div').attr('class', bkg.settings.location);
    $('.layoutConnected > div').attr('class', bkg.settings.location);
    $('.layoutConnecting').show();

    bkg.settings.adblockStat = 0;
    bkg.settings.trackersStat = 0;
    bkg.settings.analyticsStat = 0;
    bkg.settings.firewallStat = 0;

    $('#adblock-stat').text(bkg.settings.adblockStat);
    $('#trackers-stat').text(bkg.settings.trackersStat);
    //$('#analytics-stat').text(bkg.settings.analyticsStat);
    //$('#firewall-stat').text(bkg.settings.firewallStat);

    bkg.enableProxy(callback);
  }
}

$('#signin-email-button').click(function() {
  if (!validateEmail($('#signin-email').val().trim())) {
    shake('#signin-email');
    return;
  }

  $('#signin-email-box').hide();
  $('#loader').show();

  $.ajax({
    url: bkg.apiHost + '/3/user/check',
    contentType: 'application/json',
    type: 'POST',
    tryCount: 0,
    retryLimit: 3,
    data: JSON.stringify({
      email: $('#signin-email').val().trim()
    }),
    dataType: 'json',
    success: function(data) {
      $('#loader').hide();

      switch (data.code) {
        case 0:
          bkg.settings.signinBoxStateData.push({
            'id': '#signin-email',
            'type': 'input',
            'value': $('#signin-email').val()
          });

          showSignup();
          break;

        case 3:
          bkg.settings.signinBoxStateData.push({
            'id': '#signin-email',
            'type': 'input',
            'value': $('#signin-email').val()
          });

          showSignin();
          break;
      }
    },
    error: function() {
      this.tryCount++;
      if (this.tryCount <= this.retryLimit) {
        $.ajax(this);
        return;
      }
    },
    complete: function(xhr) {
      bkg.sendFailMetric(xhr);
    }
  });
});

function showSignup() {
  $('#signin-back-button').show();

  bkg.settings.signinBoxState = '#signup-step1-box';

  $('#signin-email-box').hide();
  $('#signup-step1-box').show();
  $('#signup-password').focus();
}

function showSignin() {
  $('#signin-back-button').show();

  bkg.settings.signinBoxState = '#signin-password-box';

  $('#signin-email-box').hide();
  $('#signin-password-box').show();
  $('#signin-password').focus();
}

function signin(email, passwd, successCb, errorCb) {
  $.ajax({
    url: bkg.apiHost + '/3/user/signin',
    contentType: 'application/json',
    type: 'POST',
    tryCount: 0,
    retryLimit: 3,
    data: JSON.stringify({
      email: email,
      passwd: passwd,
      udid: bkg.settings.udid
    }),
    dataType: 'json',
    success: function(data) {
      if (successCb) {
        successCb();
      }

      switch (data.code) {
        case 0:
          bkg.settings.email = $('#signin-email').val().trim();
          bkg.settings.token = data.token;

          bkg.settings.signinBoxState = null;
          bkg.settings.signinBoxStateData = [];

          resetSigninFields();

          if (!bkg.settings.udid) {
            bkg.settings.udid = data.udid;
          }

          bkg.settings.premium = data.userInfo.premium;
          /*if (!bkg.settings.premium) {
            bkg.settings.location = 'fn';
          }*/

          bkg.settings.connectionInfo = {
            userIp: data.userInfo.userIp,
            userCountry: data.userInfo.userCountry,
            userCountryLat: data.userInfo.userCountryLat,
            userCountryLon: data.userInfo.userCountryLon
          };

          updateNetworkInfo();
          showMainView();

          bkg.init(function() {
            /*switchProxyState(function() {
              setTimeout(updateUI, connectDelay);
              updateNetworkInfo();
            });*/
          });
          break;

        case 2:
          if (errorCb) {
            errorCb();
          }
          break;
      }
    },
    error: function() {
      this.tryCount++;
      if (this.tryCount <= this.retryLimit) {
        $.ajax(this);
        return;
      }
    },
    complete: function(xhr) {
      bkg.sendFailMetric(xhr);
    }
  });
}

$('#signin-button').click(function() {
  if (!$('#signin-password').val()) {
    shake('#signin-password');
    return;
  }

  $('#signin-password-box').hide();
  $('#loader').show();

  signin(
    $('#signin-email').val().trim(),
    $('#signin-password').val(),
    function() {
      //$('#loader').hide();

      $('#signin-password-box').hide();
      $('#signin-password-retry-box').hide();
    },
    function() {
      $('#loader').hide();

      bkg.settings.signinBoxState = '#signin-password-retry-box';

      $('#signin-password-box').hide();
      $('#signin-password-retry-box').show();
      $('#signin-retry-password').focus();
  });
});

$('#signin-retry-button').click(function() {
  if (!$('#signin-retry-password').val()) {
    shake('#signin-retry-password');
    return;
  }

  signin(
    $('#signin-email').val().trim(),
    $('#signin-retry-password').val(),
    null,
    function() {
      shake('#signin-retry-password');
    }
  );
});

$('#password-reset-link1').click(function() {
  $('#signin-password-box').hide();
  $('#loader').show();

  $.ajax({
    url: bkg.apiHost + '/3/user/reminder',
    contentType: 'application/json',
    type: 'POST',
    tryCount: 0,
    retryLimit: 3,
    data: JSON.stringify({
      email: $('#signin-email').val()
    }),
    dataType: 'json',
    success: function() {
      $('#loader').hide();

      $('#password-reset-email').text($('#signin-email').val());

      bkg.settings.signinBoxState = '#password-reset-box';
      bkg.settings.signinBoxStateData.push({
        'id': '#password-reset-email',
        'type': 'text',
        'value': $('#password-reset-email').text()
      });

      $('#signin-password-box').hide();
      $('#password-reset-box').show();
      $('#password-reset-code').focus();
    },
    error: function() {
      this.tryCount++;
      if (this.tryCount <= this.retryLimit) {
        $.ajax(this);
        return;
      }
    },
    complete: function(xhr) {
      bkg.sendFailMetric(xhr);
    }
  });
});

$('#password-reset-link').click(function() {
  $('#signin-password-retry-box').hide();
  $('#loader').show();

  $.ajax({
    url: bkg.apiHost + '/3/user/reminder',
    contentType: 'application/json',
    type: 'POST',
    tryCount: 0,
    retryLimit: 3,
    data: JSON.stringify({
      email: $('#signin-email').val()
    }),
    dataType: 'json',
    success: function() {
      $('#loader').hide();

      $('#password-reset-email').text($('#signin-email').val());

      bkg.settings.signinBoxState = '#password-reset-box';
      bkg.settings.signinBoxStateData.push({
        'id': '#password-reset-email',
        'type': 'text',
        'value': $('#password-reset-email').text()
      });

      $('#signin-password-retry-box').hide();
      $('#password-reset-box').show();
      $('#password-reset-code').focus();
    },
    error: function() {
      this.tryCount++;
      if (this.tryCount <= this.retryLimit) {
        $.ajax(this);
        return;
      }
    },
    complete: function(xhr) {
      bkg.sendFailMetric(xhr);
    }
  });
});

$('#password-activate-button').click(function() {
  if (!$('#password-reset-code').val()) {
    shake('#password-reset-code');
    return;
  }

  $.ajax({
    url: bkg.apiHost + '/3/user/reminder',
    contentType: 'application/json',
    type: 'POST',
    tryCount: 0,
    retryLimit: 3,
    data: JSON.stringify({
      email: $('#signin-email').val(),
      code: $('#password-reset-code').val()
    }),
    dataType: 'json',
    success: function(data) {
      switch (data.code) {
        case 0:
          bkg.settings.signinBoxState = '#password-set-box';
          bkg.settings.signinBoxStateData.push({
            'id': '#password-reset-code',
            'type': 'input',
            'value': $('#password-reset-code').val()
          });

          $('#password-reset-box').hide();
          $('#password-set-box').show();
          $('#password-set-password').focus();
          break;

        case 3:
          shake('#password-reset-code');
          break;
      }
    },
    error: function() {
      this.tryCount++;
      if (this.tryCount <= this.retryLimit) {
        $.ajax(this);
        return;
      }
    },
    complete: function(xhr) {
      bkg.sendFailMetric(xhr);
    }
  });
});

$('#password-set-button').click(function() {
  if (!$('#password-set-password').val()) {
    shake('#password-set-password');
    return;
  }

  $('#password-set-box').hide();
  $('#loader').show();

  $.ajax({
    url: bkg.apiHost + '/3/user/reminder',
    contentType: 'application/json',
    type: 'POST',
    tryCount: 0,
    retryLimit: 3,
    data: JSON.stringify({
      email: $('#signin-email').val(),
      code: $('#password-reset-code').val(),
      passwd: $('#password-set-password').val()
    }),
    dataType: 'json',
    success: function(data) {
      switch (data.code) {
        case 0:
          //$('#loader').hide();

          signin(
            $('#signin-email').val().trim(),
            $('#password-set-password').val(),
            null,
            null
          );
          break;
      }
    },
    error: function() {
      this.tryCount++;
      if (this.tryCount <= this.retryLimit) {
        $.ajax(this);
        return;
      }
    },
    complete: function(xhr) {
      bkg.sendFailMetric(xhr);
    }
  });
});

$('#signup-step1-button').click(function() {
  if (!$('#signup-password').val()) {
    shake('#signup-password');
    return;
  }

  $('#signup-step1-box').hide();
  $('#loader').show();

  $.ajax({
    url: bkg.apiHost + '/3/user/signup',
    contentType: 'application/json',
    type: 'POST',
    tryCount: 0,
    retryLimit: 3,
    data: JSON.stringify({
      email: $('#signin-email').val().trim(),
      passwd: $('#signup-password').val(),
      udid: bkg.settings.udid
    }),
    dataType: 'json',
    success: function(data) {
      //$('#loader').hide();

      switch (data.code) {
        case 0:
          bkg.settings.email = $('#signin-email').val().trim();
          bkg.settings.token = data.token;

          bkg.settings.signinBoxState = null;
          bkg.settings.signinBoxStateData = [];

          resetSigninFields();
          bkg.settings.event = 7;

          if (!bkg.settings.udid) {
            bkg.settings.udid = data.udid;
          }

          bkg.settings.connectionInfo = {
            userIp: data.userInfo.userIp,
            userCountry: data.userInfo.userCountry,
            userCountryLat: data.userInfo.userCountryLat,
            userCountryLon: data.userInfo.userCountryLon
          };

          //bkg.settings.location = 'fn';

          updateNetworkInfo();
          showMainView();

          bkg.init(function() {
            /*switchProxyState(function() {
              setTimeout(updateUI, connectDelay);
              updateNetworkInfo();
            });*/
          });
          break;
      }
    },
    error: function() {
      this.tryCount++;
      if (this.tryCount <= this.retryLimit) {
        $.ajax(this);
        return;
      }
    },
    complete: function(xhr) {
      bkg.sendFailMetric(xhr);
    }
  });
});

$('#signup-change-email-link').click(function() {
  bkg.settings.signinBoxState = '#signin-email-box';
  bkg.settings.signinBoxStateData = [];

  $('#signup-step1-box').hide();
  $('#signin-email-box').show();
  $('#signin-email').focus();
});

$('#signin-back-button').click(function() {
  if (bkg.settings.signinBoxState == '#signin-email-box' ||
    !bkg.settings.signinBoxState) {
    return;
  }
  $(this).hide();

  $(bkg.settings.signinBoxState).hide();
  $('#signin-email-box').show();

  $('#signin-email').focus();

  bkg.settings.signinBoxState = '#signin-email-box';
  bkg.settings.signinBoxStateData = [];
})

$(':text, :password').keypress(function(e) {
  var b;

  switch(e.target.id) {
    case 'signin-email':
      b = '#signin-email-button';
      break;

    case 'signin-password':
      b = '#signin-button';
      break;

    case 'signin-retry-password':
      b = '#signin-retry-button';
      break;

    case 'password-reset-code':
      b = '#password-activate-button';
      break;

    case 'password-set-password':
      b = '#password-set-button';
      break;

    case 'signup-password':
      b = '#signup-step1-button';
      break;

    case 'signup-name':
    case 'signup-last-name':
      b = '#signup-step2-button';
      break;

    default:
      return;
  }

  if (e.which == 13) {
    $(b).click();
  }
});


$('.navSettings').click(function() {
  $('.layoutSettings').show();
});

$('#settings-back-button').click(async function() {
  $('.layoutSettings').addClass('hideRight');
  await wait(500);
  $('.layoutSettings').removeClass('hideRight');
  $('.layoutSettings').hide();
});

$('#get-premium-button, #premium-account-button, .bubbleSpeech').click(function() {
  chrome.tabs.create(
    {'url': 'https://dotvpn.com/?token=' +
      encodeURIComponent(bkg.settings.token)});
});

$('#policy-button').click(function() {
  $('.layoutPrivacy').show();
});

$('#policy-back-button').click(async function() {
  $('.layoutPrivacy').addClass('hideRight');
  await wait(500);
  $('.layoutPrivacy').removeClass('hideRight');
  $('.layoutPrivacy').hide();
});

$('#support-button').click(async function() {
  $('.layoutOverFeedback').show();
  $('.layoutOverFeedbackSuccess').hide();

  $('#support-popup-subject').val('');
  $('#support-popup-text').val('');

  $('.layoutFeedback').show();
  await wait(500);
  $('#support-popup-subject').focus();
});

$('#support-back-button').click(async function() {
  $('.layoutFeedback').addClass('hideRight');
  await wait(500);
  $('.layoutFeedback').removeClass('hideRight');
  $('.layoutFeedback').hide();
});

$('#rate-button').click(function() {
  switch (bkg.client) {
    case 'crm':
      var url = 'https://chrome.google.com/webstore/detail/' +
        'dotvpn-free-and-secure-vp/kpiecbcckbofpmkkkdibbllpinceiihk/reviews';
      break;

    case 'opr':
      var url = 'https://addons.opera.com/en/extensions/details/' +
        'dotvpn-free-and-secure-vpn-2/';
      break;

    case 'ffx':
      var url = 'https://addons.mozilla.org/en-US/firefox/addon/dotvpn/';
      break;
  }

  chrome.tabs.create({'url': url});
});

$('#rate-back-button').click(async function() {
  $('.layoutFeedback').addClass('hideRight');
  await wait(500);
  $('.layoutFeedback').removeClass('hideRight');
  $('.layoutFeedback').hide();
});

var ulw = parseInt($('.locationsList > ul').css('width'));
    
$('span.left').click(function() {
  $('.locationsList').animate({
      scrollLeft: '-=' + parseInt(ulw / 3) + 'px'
  }, 500);
});

$('span.right').click(function() {
  $('.switch > .left').addClass('active');
  $('.locationsList').animate({
      scrollLeft: '+=' + parseInt(ulw / 3) + 'px'
  }, 500);
});

$('.region-top-btn').click(function() {
  renderLocations(null, this);
});

$('.region-europe-btn').click(function() {
  renderLocations('eu', this);
});

$('.region-americas-btn').click(function() {
  renderLocations('na', this);
});

$('.region-asia-btn').click(function() {
  renderLocations('as', this);
});

$('.region-oceania-btn').click(function() {
  renderLocations('oc', this);
});

$('.region-africa-btn').click(function() {
  renderLocations('af', this);
});

function renderLocations(continent, el) {
  $('.countries-list').empty();

  $('.fastest').attr('class', 'fastest ' + bkg.settings.location);
  $('.fastestItem').attr('class', 'fastestItem ' + bkg.settings.location);
  $('.fastestText span:eq(0)').text(locations[bkg.settings.location].country);
  $('.fastestText span:eq(1)').text(locations[bkg.settings.location].city);
  if (bkg.settings.bwStat) {
    $('.fastestText span:eq(2)').text(bkg.settings.bwStat[bkg.settings.location].rtt);
  }
  if (bkg.settings.premium || !locations[bkg.settings.location].free) {
    $('.fastestItem .free').remove();
  }

  if (!bkg.settings.lastLocations.length) {
    if (bkg.settings.premium) {
      for (var l in bkg.settings.bwStat) {
        bkg.settings.lastLocations.push(l);
      }
    } else {
      for (var l in bkg.settings.bwStat) {
        if (locations[l] && locations[l].free) {
          bkg.settings.lastLocations.push(l);
        }
      }

      for (var l in bkg.settings.bwStat) {
        if (locations[l] && !locations[l].free) {
          bkg.settings.lastLocations.push(l);
        }
      }
    }
  }

  var i = 0;
  for (var l in !continent ? bkg.settings.lastLocations : bkg.settings.bwStat) {
    if (parseInt(l)) {
      l = bkg.settings.lastLocations[l];
    }

    if (l == bkg.settings.location && !continent) {
      continue;
    }

    if (!locations[l] || locations[l].continent != continent && continent) {
      continue;
    }

    if (i++ == 1 && !continent && !bkg.settings.premium) {
      var div = $('#location-premium-banner > div').clone();
      div.appendTo('.countries-list');
    }

    var div = $('#location-template > div').clone();
    div.addClass(locations[l].countryCode);
    div.find('.locationText > p:eq(0) > b').text(locations[l].country);
    div.find('.locationText > p:eq(0) > span').text(locations[l].city);
    div.find('.locationText > p:eq(1) > span').text(bkg.settings.bwStat[l].rtt);

    if (bkg.settings.premium) {
      div.find('.free').remove();
      div.find('.flipItem').removeClass('flipItem');
      div.find('.flipPremium').remove();
    } else if (!locations[l].free) {
      div.find('.free').remove();
    } else {
      div.find('.flipItem').removeClass('flipItem');
      div.find('.flipPremium').remove();
    }
      
    div.appendTo('.countries-list');
  }
  
  $('.locationsList > ul > li').removeClass('active');
  $('.' + $(el).attr('class')).addClass('active');

  $('.location, .fastest').click(locationClick);
}

async function locationClick() {
  var cn = $(this).attr('class').split(' ')[1];

  if (cn == 'premium-crown' || (!bkg.settings.premium && !locations[cn].free)) {
    chrome.tabs.create(
      {'url': 'https://dotvpn.com/?token=' +
        encodeURIComponent(bkg.settings.token)});
    return;
  }

  if (cn == bkg.settings.location && bkg.settings.enabled) {
    return;
  }

  var i = bkg.settings.lastLocations.indexOf(cn);
  if (i >= 0) {
    bkg.settings.lastLocations.splice(i, 1);
    bkg.settings.lastLocations.unshift(cn);
  }

  if ($('.layoutChange').css('display') == 'block') {
    $('.connectionChange').click();
  }

  bkg.settings.location = cn;
  bkg.settings.enabled = false;

  updateUI();
  switchProxyState(function() {
    window.setTimeout(function() {
      updateNetworkInfo();
      updateUI();
    }, connectDelay);
  });
}

function setLocalTimeTimer() {
  updateLocalTime(bkg.settings.location);
  localTimeTimer = setInterval(function() {
      updateLocalTime(bkg.settings.location);
  }, 1000);
}

function updateLocalTime(cn) {
  $('p.time > b').text(new Date().toLocaleTimeString('en-GB', {
      timeZone: locations[cn].tz,
      hour: '2-digit',
      minute: '2-digit'
  }));
}

$('.connectionChange').click(layoutChangeToggle);
$('.flag').click(layoutChangeToggle);
$('.layoutFade').click(layoutChangeToggle);
    
async function layoutChangeToggle() {
  switch ($('.layoutChange').css('display')) {
    case 'none':
      $('.layoutChange').show();
      $('.layoutConnecting').show();
      break;

    case 'block':
      $('.layoutChange').addClass('hideChange');
      await wait(500);
      $('.layoutChange').removeClass('hideChange');
      $('.layoutChange').hide();
      break;
  }
}

$('#logout-button').click(function() {
  bkg.resetSettings();
  bkg.disableProxy();

  $('.layoutSettings').hide();
  showSigninView();
});

$('#password-reset-change-email-link').click(function() {
  $('#signin-back-button').click();
});

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// disconnect
$('.connectBtn').click(function() {
  switchProxyState(updateUI);

  //$('.layoutConnecting').hide();
  //$('.layoutConnected').hide();
});

$('#bandwidth-saver-switch').click(function() {
  updateSwitchSetting('bandwidthSaver', this);
});

$('#adblock-switch').click(function() {
  updateSwitchSetting('adblock', this);
});

$('#tracking-protection-switch').click(function() {
  updateSwitchSetting('trackingProtection', this);
});

$('#block-analytics-switch').click(function() {
  updateSwitchSetting('blockAnalytics', this);
});

$('#firewall-switch').click(function() {
  updateSwitchSetting('firewall', this);
});

$('#auto-start-switch').click(function() {
  updateSwitchSetting('autoStart', this);
});

$('#hide-app-icon').click(function() {
  updateSwitchSetting('hideAppIcon', this);

  if (bkg.settings.hideAppIcon) {
    bkg.setTransparentIcon();

    chrome.browserAction.setTitle(
      { title: ' ' });
  } else {
    if (bkg.settings.enabled) {
      //bkg.startIconConnectedAnimation();
      bkg.setIcon(14);

      chrome.browserAction.setTitle(
        { title: chrome.i18n.getMessage('connected') });
    } else {
      //bkg.startIconDisconnectedAnimation();
      bkg.setIcon(1);

      chrome.browserAction.setTitle(
        { title: chrome.i18n.getMessage('disconnected') });
    }
  }
});

function updateSwitchSetting(name, el) {
  bkg.settings[name] = !bkg.settings[name];
  $('#' + el.id + ' > .switch').toggleClass('switch-off switch-on');

  switch (name) {
    case 'bandwidthSaver':
    case 'adblock':
    case 'trackingProtection':
    case 'blockAnalytics':
    case 'firewall':
      renderStat();

      var s = {};
      s[name] = bkg.settings[name];

      $.ajax({
        url: bkg.apiHost + '/3/user/settings',
        contentType: 'application/json',
        type: 'POST',
        tryCount: 0,
        retryLimit: 3,
        data: JSON.stringify({
          token: bkg.settings.token,
          settings: s
        }),
        dataType: 'json',
        error: function() {
          this.tryCount++;
          if (this.tryCount <= this.retryLimit) {
            $.ajax(this);
            return;
          }
        },
        complete: function(xhr) {
          bkg.sendFailMetric(xhr);
        }
      });
      break;
  }
}

$('#support-popup-send-button').click(async function() {
  if (!$('#support-popup-subject').val()) {
    $('#support-popup-subject').focus();
    shake($('#support-popup-subject'));
    return;
  }

  if (!$('#support-popup-text').val()) {
    $('#support-popup-text').focus();
    shake($('#support-popup-text'));
    return;
  }

  $('#support-popup-send-button')
    .removeClass('orangeBtn')
    .addClass('loadingBtn');

  await wait(500);

  sendFeedback(
    $('#support-popup-subject').val(),
    $('#support-popup-text').val(),
    function(data) {
      if (data.code == 0) {
        $('.layoutOverFeedback').hide();
        $('.layoutOverFeedbackSuccess').show();
      }
    },
    function() {
      $('#support-popup-send-button')
        .removeClass('loadingBtn')
        .addClass('orangeBtn');
    }
  );
});

function sendFeedback(subject, text, success, complete) {
  $.ajax({
    url: bkg.apiHost + '/3/user/app-feedback',
    contentType: 'application/json',
    type: 'POST',
    tryCount: 0,
    retryLimit: 3,
    data: JSON.stringify({
      token: bkg.settings.token,
      subject: subject,
      text: text
    }),
    dataType: 'json',
    success: success,
    error: function() {
      this.tryCount++;
      if (this.tryCount <= this.retryLimit) {
        $.ajax(this);
        return;
      }
    },
    complete: complete
  });
}

function formatTime(s) {
  var date = new Date(s * 1000);
  var days = Math.floor((date - new Date(0)) / (1000 * 60 * 60 * 24));

  var hh = date.getUTCHours() + days * 24;
  var mm = date.getUTCMinutes();
  var ss = date.getSeconds();

  if (hh < 10) { hh = '0' + hh; }
  if (mm < 10) { mm = '0' + mm; }
  if (ss < 10) { ss = '0' + ss; }

  return {hh: hh, mm: mm, ss: ss}
}

function shake(div) {
    var interval = 50;
    var distance = 50;
    var times = 4;

    $(div).css('position', 'relative');

    for (var i = 0; i < (times + 1); i++) {
        $(div).animate({
          left: ((i % 2 == 0 ? distance : distance * -1))
        }, interval);
    }

    $(div).animate({
      left: 0
  }, interval);
}

/*function animateNumbers(from, to, el) {
  jQuery({someValue: from}).animate({someValue: to}, {
    duration: 2000,
    easing:'swing',
    step: function() {
      $(el).text(Math.ceil(this.someValue));
    }
  });
}*/

});