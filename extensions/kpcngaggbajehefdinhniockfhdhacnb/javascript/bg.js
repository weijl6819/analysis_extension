var allCoins = null;
var myCoins = null;
var allCoinsHash = {};
var rQuotations = {};

function isSignIn() {
    return new Promise(function (resolve, reject) {
        chrome.cookies.get({url: 'https://www.coinbag.com', name: 'token'}, function (cookie) {
            resolve(cookie);
        });
    });
}

function getCookie() {
    var token = '';
    var username = '';
    return new Promise(function (resolve, reject) {
        chrome.cookies.get({url:'https://www.coinbag.com', name: 'token'}, function (cookie) {
            token = cookie.value;
            chrome.cookies.get({url:'https://www.coinbag.com', name: 'login'}, function (cookie) {
               username = cookie.value;
               console.log(token, username);
               resolve({
                   token: token,
                   username: username
               });
            });
        });
    });
}

var baseUrl = 'https://www.coinbag.com/api/v1';

function loadQuotation(coin) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            headers: {
                'X-USER-LOGIN': 'lei',
                'X-USER-TOKEN': 'sG9o3JU5hKkhdyDyapjH'
            },
            url: baseUrl + '/coin/quotation/' + coin.coin_code,
            success: function (res) {
                if (res.code === 1) {
                    var quotations = res.data.quotations;
                    if (quotations.length > 20) {
                        var _res = quotations.slice(-20, quotations.length);
                    } else {
                        var _res = quotations;
                    }

                    var graphData = {
                        xData: [],
                        yData: []
                    };
                    _res.forEach(function (t) {
                        graphData.xData.push(moment(t.datetime).format('YYYY-MM-DD hh:MM:ss'));
                        graphData.yData.push(t.price_usd);
                    });
                    var _coin = Object.assign({}, coin, {quotations: quotations}, {graphData: graphData});
                    resolve(_coin);
                } else {
                    reject(res.message);
                }

            },

            error: function (err) {
                reject(err);
            }
        });
    });
}

function loadCoins() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: baseUrl + '/coin',
            success: function (res) {
                if (res.code === 1) {
                    var _coins = res.data.coins;
                    if (_coins.length) {
                        // var coins = _coins.slice(0, 30);

                        // var coinPromise = coins.map(function (c) {
                        //     return loadQuotation(c);
                        // });
                        //
                        // Promise.all(coinPromise).then(function (res) {
                        //     console.log(res);
                        //     resolve(res);
                        // });

                        // for (var i = 0; i < _coins.length; i++) {
                        //     var c = _coins[i];
                        //
                        //     var graphData = {
                        //         xData: [],
                        //         yData: []
                        //     };
                        //     for(var j = 0; j < c.quotations.length; j++) {
                        //         var t = c.quotations[j];
                        //         graphData.xData.push(moment(t.datetime).format('YYYY-MM-DD hh:MM:ss'));
                        //         graphData.yData.push(t.price_usd);
                        //     }
                        //     c['graphData'] = graphData;
                        // }


                        resolve(_coins);
                    }
                } else {
                    reject(res.message);
                }
            },

            error: function (err) {
                reject(err);
            }
        });
    });


}

function loadCountries() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: baseUrl + '/verify/sms/countries',
            headers: {
                "USER_AGENT": "chrome extension-" + chrome.runtime.getManifest().version
            },
            success: function (res) {
                if (res.code === 1) {
                    resolve(res.data);
                } else {
                    reject();
                }
            },

            error: function () {
                reject();
            }
        });
    });
}

function signIn(data) {
    return makeRequest('POST', '/auth/sign_in', data);
}

function signOut() {
    chrome.cookies.remove({url: 'https://www.coinbag.com', name: 'token'});
    chrome.cookies.remove({url: 'https://www.coinbag.com', name: 'login'});
    localStorage.removeItem('nickname');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    myCoins = null;
}

function loadWatchList() {
    return makeAuthRequest('GET', '/user/watch_list');
}


function loadHoldings() {
    return makeAuthRequest('GET', '/user/holdings');
}

function loadCapital() {
    return makeAuthRequest('GET', '/user/capital');
}

function loadPortfolio(type) {
    if (!type) {
        type = '24h';
    }
    return makeAuthRequest('GET', '/user/portfolio', {type: type}).then(function (data) {
        if (myCoins) {
            myCoins.portfolio[type] = data;
        }
        return {
            type: type,
            data: data
        };
    });
}

function loadMyCoins() {
    return Promise.all([loadHoldings(), loadWatchList(), loadCapital(), loadPortfolio()]);
}

function watchCoin(coinCode) {
    myCoins.watchList.push(coinCode);
    return makeAuthRequest('POST', '/user/watch', {coin_code: coinCode});
}

function unWatchCoin(coinCode) {
    myCoins.watchList = myCoins.watchList.filter(function (t) {
        return t !== coinCode;
    });
    return makeAuthRequest('POST', '/user/unwatch', {coin_code: coinCode});
}

function updateOwnedCoin(coinCode, volume) {
    return makeAuthRequest("POST", '/user/holding', {coin_code: coinCode, volume: volume}).then(function (res) {
        var h = res.data;
        if (myCoins.holdingsHash[h.coin_code]) {
            for (var i = 0; i < myCoins.holdings.length; i++) {
                if (myCoins.holdings[i].coin_code === h.coin_code) {
                    if (h.volume == 0) {
                        myCoins.holdings.splice(i, 1);
                    }
                    myCoins.holdings[i] = h;
                }
            }
        } else {
            myCoins.holdings.push(h);
        }
        if (h.volume == 0) {
            delete myCoins.holdingsHash[h.coin_code];
        } else {
            myCoins.holdingsHash[h.coin_code] = h;
        }
        return true;
    })
}

function addTransfer(data) {
    return makeAuthRequest('POST', '/user/capital', data).then(function (d) {
        myCoins.capital.history.unshift(d);
        return true;
    });
}

function makeAuthRequest(type, url, data) {
    if (type == 'POST') {
        data = JSON.stringify(data);
    }
    return new Promise(function (resolve, reject) {
        getCookie().then(function (res) {
            if (res) {
                $.ajax({
                    type: type,
                    headers: {
                        'X-USER-LOGIN': res.username,
                        'X-USER-TOKEN': res.token,
                        "USER_AGENT": "chrome extension-" + chrome.runtime.getManifest().version
                    },
                    url: baseUrl + url,
                    contentType: 'application/json',
                    data: data,
                    success: function (res) {
                        if (res.code === 1) {
                            resolve(res.data);
                        } else {
                            reject(res.message);
                        }
                    },

                    statusCode: {
                        401: function () {
                            signOut();
                            chrome.runtime.sendMessage({name: 'signOut'});
                        }
                    },

                    error: function (err) {
                        reject(err.statusText);
                    }
                });
            }
        });

    });
}

function makeRequest(type, url, data) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: type,
            headers: {
                "USER_AGENT": "chrome extension-" + chrome.runtime.getManifest().version
            },
            url: baseUrl + url,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (res) {
                if (res.code === 1) {
                    resolve(res.data);
                } else {
                    reject(res.message);
                }
            },

            error: function (err) {
                reject(err.statusText);
            }
        })
    });
}

function requestSMS(data) {
    return makeRequest('POST', '/verify/sms/send', data);
}

function signUp(data) {
    return makeRequest('POST', "/auth/sign_up", data);
}


function getData(option) {


    if (!option) {
        option = {
            page: 1,
            keyword: ''
        }
    }

    var _res = allCoins;

    if (_res === null) {
        return _res;
    }

    if (option.keyword) {
        var _res = allCoins.filter(function (c) {
            return c.name.toLowerCase().indexOf(option.keyword) !== -1 || c.symbol.toLowerCase().indexOf(option.keyword) !== -1;
        });
    }

    _res = _res.slice((option.page - 1) * 25, option.page * 25);


    return _res;


}

function makeAllCoinHash(coins) {
    for (var i = 0; i < coins.length; i++) {
        allCoinsHash[coins[i].coin_code] = coins[i];
    }
}

function makeHoldingsHash(coins) {
    var tmp = {};
    for (var i = 0; i < coins.length; i++) {
        tmp[coins[i].coin_code] = coins[i];
    }
    return tmp;
}

function setupAsset(data) {
    return makeAuthRequest('POST', '/user/asset/setup', data);
}

function setHolding(data) {
    return makeAuthRequest('POST', '/user/holding', data).then(function (data) {
        var h = data.holding;
        updateHolding(h);
    });
}

function buy(data) {
    return makeAuthRequest('POST', '/user/buy', data).then(function (data) {
        var h = data.holding;
        updateHolding(h);
    });
}

function sell(data) {
    return makeAuthRequest('POST', '/user/sell', data).then(function (data) {
        var h = data.holding;
        updateHolding(h);
    });
}

function updateHolding(h) {
    if (myCoins.holdingsHash[h.coin_code]) {
        for (var i = 0; i < myCoins.holdings.length; i++) {
            var _h = myCoins.holdings[i];
            if (_h.coin_code === h.coin_code) {
                if (h.volume == 0) {
                    myCoins.holdings.splice(i, 1);
                } else {
                    myCoins.holdings[i].volume = h.volume;
                    myCoins.holdings[i].equity = h.equity;
                }
            }
        }
    } else {
        myCoins.holdings.push(h);
    }

    if (h.volume == 0) {
        delete myCoins.holdingsHash[h.coin_code];
    } else {
        myCoins.holdingsHash[h.coin_code] = h;
    }

}

function loadRecentQuotations(codes, container) {
    if (codes.length === 0) {
        return;
    }
    var _codes = codes.join(',');
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: baseUrl + '/coin/rquotations',
            data: {codes: _codes},
            headers: {
                "USER_AGENT": "chrome extension-" + chrome.runtime.getManifest().version
            },
            success: function (res) {
                if (res.code == 1) {
                    var d = res.data;
                    for (var q in d) {
                        var graphData = {
                            xData: [],
                            yData: []
                        };
                        for (var i = 0; i < d[q].length; i++) {
                            var t = d[q][i];
                            graphData.xData.push(moment(t.at).format('YYYY-MM-DD hh:MM:ss'));
                            graphData.yData.push(t.pu);

                        }

                        d[q] = graphData;
                    }
                    rQuotations = Object.assign({}, rQuotations, d);
                    chrome.runtime.sendMessage({name: 'quotationLoaded', codes: codes, container: container});
                } else {
                    reject(res.message);
                }
            },

            error: function (err) {
                reject(err.statusText);
            }
        })
    })
}

function refreshMycoinsData() {
    myCoins = null;
    loadMyCoins().then(function (res) {
        myCoins = {
            holdings: res[0]['holdings'],
            initHoldings: res[0]['initialized'],
            holdingsHash: makeHoldingsHash(res[0]['holdings']),
            watchList: res[1]['coins'],
            capital: res[2],
            portfolio: {}
        };
        myCoins.portfolio[res[3].type] = res[3].data;
        chrome.runtime.sendMessage({name: 'myCoinsLoaded'});
    });
}
function googleEvent(action, label) {
    if (ga) {
        ga('send', 'event', 'chrome extension', action, label);
    }
}

function initData() {
    allCoins = null;
    myCoins = null;
    allCoinsHash = {};
    rQuotations = {};

    isSignIn().then(function (cookie) {
        if (cookie) {
            Promise.all([loadCoins(), loadMyCoins()]).then(function (res) {
                allCoins = res[0].map(function (c) {
                    return {
                        coin_code: c['c'],
                        market_cap_usd: c['mu'],
                        name: c['n'],
                        percent_change_24h: c['p24'],
                        price_usd: c['pu'],
                        symbol: c['s']
                    };
                });
                makeAllCoinHash(allCoins);
                myCoins = {
                    holdings: res[1][0]['holdings'],
                    initHoldings: res[1][0]['initialized'],
                    holdingsHash: makeHoldingsHash(res[1][0]['holdings']),
                    watchList: res[1][1]['coins'],
                    capital: res[1][2],
                    portfolio: {}
                };

                myCoins.portfolio[res[1][3].type] = res[1][3].data;
                chrome.runtime.sendMessage({name: 'myCoinsLoaded'});
                chrome.runtime.sendMessage({name: 'allCoinsLoaded'});
                localStorage['lastLoadTime'] = Date.now();
            });
        } else {

            loadCoins().then(function (res) {
                allCoins = res.map(function (c) {
                    return {
                        coin_code: c['c'],
                        market_cap_usd: c['mu'],
                        name: c['n'],
                        percent_change_24h: c['p24'],
                        price_usd: c['pu'],
                        symbol: c['s']
                    };
                });
                makeAllCoinHash(allCoins);
                chrome.runtime.sendMessage({name: 'allCoinsLoaded'});
                localStorage['lastLoadTime'] = Date.now();
            });
        }
    });

}

initData();
