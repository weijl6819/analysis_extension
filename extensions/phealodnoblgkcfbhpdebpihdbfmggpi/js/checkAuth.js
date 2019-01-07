const mainHost = 'https://app.snov.io';

function parseCheckLogin(response, callback) {
    function updateToken(token) {
        chrome.cookies.set({
            'name': 'token',
            'url': mainHost,
            'value': token,
            'expirationDate': (new Date() / 1000) + 3600 * 24 * 14
        }, function (cookie) {
        });
    }

    if (response && response.result) {

        if (response.name) {
            if (response.name) {
                localStorage['userName'] = response.name;
            }
        }

        if (response.token) {
            chrome.cookies.set({
                'name': 'token',
                'url': mainHost,
                'value': response.token,
                'expirationDate': (new Date() / 1000) + 3600 * 24 * 14
            }, function (cookie) {
                if (!cookie) {
                    chrome.cookies.set({
                        'name': 'token',
                        'url': mainHost,
                        'value': response.token,
                        'expirationDate': (new Date() / 1000) + 3600 * 24 * 14
                    }, function (cookie) {
                        if (!cookie) {
                            setTimeout(updateToken, 1000, response.token);
                        }
                    });
                }
            });
        }

        if (callback) {
            callback(true);
        }
    } else {
        if (callback) {
            callback(false);
        }
        chrome.cookies.remove({
            'name': 'token',
            'url': mainHost
        });
        chrome.cookies.remove({
            'name': 'selector',
            'url': mainHost
        });
    }
}

function checkLogin(selector, token, callback) {
    var params = '';
    if ((selector !== '') && (token !== '')) {
        params = 'selector=' + selector + '&token=' + token;
    } else {
        if (callback) {
            callback(false);
        }
    }

    fetch(mainHost + '/api/checkAuth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: params
    })
        .then(res => {
            res.json().then(function (data) {
                parseCheckLogin(data, callback);
            });
        })
        .catch(res => {
        });
}

function checkAuthentication(callback) {
    var selector = '';
    var token = '';

    if (chrome.cookies) {
        chrome.cookies.get({ 'url': mainHost, 'name': 'selector' }, function (cookie) {
            if (cookie) {
                selector = cookie.value;
                chrome.cookies.get({ 'url': mainHost, 'name': 'token' }, function (cookie) {
                    if (cookie) {
                        token = cookie.value;
                    } else {
                        checkLogin(selector, token, callback);
                    }

                    if (selector && token) {
                        checkLogin(selector, token, callback);
                    }
                });
            } else {
                checkLogin(selector, token, callback);
            }
        });
    } else {
        checkLogin(selector, token, callback);
    }
};

