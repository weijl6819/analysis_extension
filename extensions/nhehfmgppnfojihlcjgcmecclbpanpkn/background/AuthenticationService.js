"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browserHelpers_1 = require("../common/browserHelpers");
//TODO store in chrome storage
let cacheToken;
let expireDate;
// Logs into facebook via Chrome.
// TODO refresh access token function for logout & repost
class AuthenticationService {
    signin(interactiveSignIn = false) {
        let authority = "https://www.facebook.com/v2.10/dialog/oauth";
        // let clientId = "157278408160186";
        // let clientId = "157141768232200";
        let clientId = "385142158589584";
        //document.domain return id of our application
        let redirectUrl = `https://${document.domain}.chromiumapp.org/`;
        // let redirectUrl = "http://localhost:3000/";
        let authUrl = `${authority}?display=popup&response_type=token&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=email`;
        return new Promise((resolve, fail) => {
            chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: interactiveSignIn }, (responseUrl) => {
                var uri = browserHelpers_1.Uri.parse(responseUrl);
                var code = uri.hashParams["access_token"];
                let now = Date.now();
                expireDate = +uri.hashParams["expires_in"] * 1000 + now;
                if (!code) {
                    //TODO - error flow
                    fail();
                    return;
                }
                resolve(code);
            });
        });
    }
    signout(token) {
        return new Promise((resolve, reject) => {
            return new Promise((resolve, reject) => {
                chrome.identity.launchWebAuthFlow({ url: `https://www.facebook.com/logout.php?access_token=${token}&next=https://facebook.com`, interactive: true }, (responseUrl) => { });
                chrome.storage.sync.remove('fbToken', () => {
                    chrome.identity.removeCachedAuthToken({ token: token }, () => {
                        resolve('ok, token removed');
                    });
                });
            });
        });
    }
    refreshToken() {
        let authority = "https://www.facebook.com/v2.10/dialog/oauth";
        // let clientId = "157278408160186";
        let clientId = "385142158589584";
        //document.domain return id of our application
        let redirectUrl = `https://${document.domain}.chromiumapp.org/`;
        // let redirectUrl = "http://localhost:3000/";
        let authUrl = `${authority}?display=popup&response_type=token&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=email`;
        return new Promise((resolve, fail) => {
            chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: false }, (responseUrl) => {
                var uri = browserHelpers_1.Uri.parse(responseUrl);
                var code = uri.hashParams["access_token"];
                let now = Date.now();
                expireDate = +uri.hashParams["expires_in"] * 1000 + now;
                if (!code) {
                    //TODO - error flow
                    fail();
                    return;
                }
                resolve(code);
            });
        });
    }
    //Функция для получения инфо про человека, через токен
    //used to get email, name, id using token if login was successful
    getUserInfo(token) {
        let url = `https://graph.facebook.com/v2.10/me?access_token=${token}&fields=email,name`;
        return new Promise((resolve, reject) => {
            fetch(url, { method: "GET" })
                .then((response) => {
                resolve(response.json());
            });
        });
    }
    shareDonation(newsLink) {
        let redirectUrl = 'https://makecents.online';
        let url = `https://www.facebook.com/v2.10/dialog/feed?app_id=385142158589584&display=popup&link=${newsLink}&redirect_uri=${redirectUrl}`;
        return new Promise((resolve, reject) => {
            chrome.windows.create({
                url: url,
                type: 'popup',
                width: 600,
                height: 400
            });
            function onUpdate(tabId, changeInfo, tab) {
                if (changeInfo.status == "loading") {
                    if (tab.url.indexOf(redirectUrl) === 0) {
                        chrome.tabs.remove(tabId);
                        chrome.tabs.onUpdated.removeListener(onUpdate);
                        if (tab.url.indexOf('post_id') > -1) {
                            resolve('new posted');
                        }
                        else {
                            reject();
                        }
                    }
                }
            }
            chrome.tabs.onUpdated.addListener(onUpdate);
        });
    }
    getToken() {
        let now = Date.now();
        if (now > expireDate) {
            return new Promise((res, rej) => {
                this.refreshToken()
                    .then(token => {
                    this.setToken(token);
                    res(token);
                })
                    .catch(err => console.error(err));
            });
        }
        else {
            return new Promise((res, rej) => {
                chrome.storage.sync.get('fbToken', (param) => {
                    res(param.fbToken);
                });
            });
        }
    }
    setToken(token) {
        return new Promise((res, rej) => {
            chrome.storage.sync.set({ 'fbToken': token }, () => {
                res(token);
            });
        });
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=AuthenticationService.js.map