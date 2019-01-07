"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common/common");
const ProxyServiceBase_1 = require("../common/ProxyServiceBase");
const Proxies_1 = require("../common/Proxies");
const MS_TOKEN = 'msToken';
const DOMAIN = 'https://makecents.online';
// const DOMAIN = 'http://localhost:5000';
//Used for display message if user registered, or if his email is not verified
//EMAIL - for content email address
const REGISTERED = 'registered', NOT_VERIFIED = 'verified', EMAIL = 'email', STATUS = 'status';
const d = document;
const closeMessage = d.querySelector('#close-message');
class PopupProxyService extends ProxyServiceBase_1.proxyService.ProxyServiceBase {
    constructor() {
        super(common_1.common.PopupProxy);
    }
}
if (localStorage.getItem(STATUS) === REGISTERED) {
    sendStatusRegistered('');
    closeMessage.addEventListener('click', removeUserSpecificStatus);
}
else if (localStorage.getItem(STATUS) === NOT_VERIFIED) {
    sendStatusNotVerified();
    closeMessage.addEventListener('click', removeUserSpecificStatus);
    document.querySelector("#resend-email").addEventListener("click", function resendEmail(e) {
        e.preventDefault();
        document.querySelector("#resend-email").removeEventListener("click", resendEmail);
        resendEmailMsg(localStorage.getItem(EMAIL));
        sendStatus('Email is resent');
    });
}
let popupProxy = new PopupProxyService();
var authenticationServiceProxy = new Proxies_1.AuthenticationServiceProxy(popupProxy);
let facebookBtn = document.getElementById("facebook-btn");
facebookBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
    yield authenticationServiceProxy.signin(true)
        .then(result => {
        if (result) {
            let resUser;
            authenticationServiceProxy.setToken(result);
            authenticationServiceProxy.getUserInfo(result)
                .then(resUser => {
                let userData = {
                    email: resUser.email,
                    name: resUser.name,
                    facebookId: resUser.id,
                };
                checkLoginStatus();
                fetch(`${DOMAIN}/session/signup`, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })
                    .then((response) => {
                    if (response.ok)
                        return response.json();
                    throw new Error(response.status);
                })
                    .then((data) => {
                    if (data.confirmed) {
                        setToken(data.accessToken);
                        //change icons
                        chrome.runtime.sendMessage({ "status": "login" });
                        checkLoginStatus();
                        sendStatus(`confirmed: ${data.confirmed}\nHi ${resUser.name}`);
                    }
                    else {
                        setUserSpecificStatus(STATUS, REGISTERED);
                        sendStatusRegistered(data.email);
                        document.querySelector('#status').classList.add('logged-in');
                        document.querySelector('#close-message').addEventListener('click', removeUserSpecificStatus);
                    }
                })
                    .catch((err) => {
                    if (err.message == 401) {
                        setUserSpecificStatus(STATUS, NOT_VERIFIED);
                        sendStatusNotVerified();
                        setUserSpecificStatus(EMAIL, resUser.email);
                        document.querySelector('#status').classList.add('logged-in');
                        document.querySelector('#close-message').addEventListener('click', removeUserSpecificStatus);
                        document.querySelector("#resend-email").addEventListener("click", function resendEmail(e) {
                            e.preventDefault();
                            document.querySelector("#resend-email").removeEventListener("click", resendEmail);
                            resendEmailMsg(resUser.email);
                            sendStatus('');
                        });
                    }
                    checkLoginStatus();
                    console.error(err);
                });
            });
        }
        else {
            document.querySelector("#status").textContent = "Login denied!";
        }
    });
}));
function setUserSpecificStatus(token, value) {
    localStorage.setItem(token, value);
}
function removeUserSpecificStatus() {
    localStorage.removeItem(STATUS);
    localStorage.removeItem(EMAIL);
    document.querySelector('#status').classList.remove('logged-in');
    sendStatus('');
    closeMessage.innerHTML = '';
    closeMessage.removeEventListener('click', removeUserSpecificStatus);
}
function sendStatusRegistered(email) {
    sendStatus("Welcome!<br/>Thank you for using Make Cents<br/>We have sent a letter on <b>" +
        email + "</b> your email address verification.Please check your email box to complete the signup process.");
    closeMessage.innerHTML = 'X';
}
function sendStatusNotVerified() {
    sendStatus('Your email is not verified yet. Please check your email box to complete the confirm process.<br/>' +
        '<span id="resend-email">Send a verification email again</span>');
    closeMessage.innerHTML = 'X';
}
function resendEmailMsg(email) {
    let data = {
        email: email
    };
    return fetch(`${DOMAIN}/session/resend-confirm-msg`, {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((data) => {
    })
        .catch((err) => {
        console.error(err);
    });
}
function sendStatus(msg) {
    const statusInput = d.querySelector('#status');
    statusInput.innerHTML = msg;
}
function addStatus(msg) {
    const statusInput = d.querySelector('#status');
    statusInput.innerHTML += `\n\n${msg}`;
}
checkLoginStatus();
function checkLoginStatus() {
    const loginRow = d.querySelector('.login-row');
    const loggedBottomRow = d.querySelector('.logged-bottom-row');
    const notLoggedBottomRow = d.querySelector('.not-logged-bottom-row');
    const donateRepostRow = d.querySelector('.donate-repost-row');
    const FB_Signup = d.querySelector('.facebook--signup-container');
    const status = d.querySelector('#status');
    let token = hasToken();
    if (token) {
        showEl(donateRepostRow);
        showEl(loggedBottomRow);
        hideEl(notLoggedBottomRow);
        hideEl(loginRow);
        hideEl(FB_Signup);
        status.classList.add('logged-in');
        if (localStorage.getItem(STATUS)) {
            status.classList.add('logged-in');
        }
    }
    else {
        showEl(loginRow);
        hideEl(donateRepostRow);
        hideEl(loggedBottomRow);
        showEl(notLoggedBottomRow);
        showEl(FB_Signup);
        status.classList.remove('logged-in');
        if (localStorage.getItem(STATUS)) {
            status.classList.add('logged-in');
        }
    }
    //Share button will shows just after donation and while popup is still opened, either button must be hide
    hideEl(d.querySelector('#share-new'));
}
function hideEl(el) {
    el.setAttribute('hidden', true);
}
function showEl(el) {
    el.removeAttribute('hidden');
}
function hasToken() {
    return localStorage.getItem(MS_TOKEN);
}
function setToken(token) {
    localStorage.setItem(MS_TOKEN, token);
}
function removeToken() {
    return localStorage.removeItem(MS_TOKEN);
}
const sendBtn = d.querySelector('#send');
const logoutBtn = d.querySelector('#logout');
const saveBtn = d.querySelector('#save-page');
/*sendBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const emailInput: any = d.querySelector('#email');
    const passInput: any = d.querySelector('#pass');
    const data = {
        email: emailInput.value,
        password: passInput.value
    };


    let result = await authenticationServiceProxy.loginWithEmail(data, (err: any, data: any) => {
        debugger
    });
        /!*.then(response => response.json())
        .then(data => {
            sendStatus(`confirmed: ${data.confirmed}`);
        })
        .catch(err => {
            sendStatus(`Not correct email/password`);
            console.error(err);
        });*!/
});*/
sendBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const emailInput = d.querySelector('#email');
    const passInput = d.querySelector('#pass');
    const data = {
        email: emailInput.value,
        password: passInput.value
    };
    fetch(`${DOMAIN}/session/login`, {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
        if (response.ok)
            return response.json();
        throw response;
    })
        .then((data) => {
        removeUserSpecificStatus();
        setToken(data.accessToken);
        chrome.runtime.sendMessage({ "status": "login" });
        checkLoginStatus();
        sendStatus(`confirmed: ${data.confirmed}`);
    })
        .catch((err) => {
        if (err.status === 403) {
            setUserSpecificStatus(STATUS, NOT_VERIFIED);
            sendStatusNotVerified();
            setUserSpecificStatus(EMAIL, emailInput.value);
            document.querySelector('#status').classList.add('logged-in');
            document.querySelector('#close-message').addEventListener('click', removeUserSpecificStatus);
            document.querySelector("#resend-email").addEventListener("click", function resendEmail(e) {
                e.preventDefault();
                document.querySelector("#resend-email").removeEventListener("click", resendEmail);
                resendEmailMsg(emailInput.value);
                sendStatus('Email is resent');
            });
        }
        else {
            sendStatus(`Not correct email/password`);
            checkLoginStatus();
        }
        console.error(err);
    });
});
logoutBtn.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    chrome.runtime.sendMessage({ "status": "logout" });
    removeToken();
    //If user logged in via facebook
    authenticationServiceProxy.getToken()
        .then(token => {
        if (token) {
            authenticationServiceProxy.signout(token);
        }
    })
        .catch(err => console.error(err));
    checkLoginStatus();
    sendStatus('Logout success');
}));
const makepayBtn = document.querySelector('#makepay');
let URL = '';
let title = '';
makepayBtn.addEventListener('click', (e) => {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
        URL = tabs[0].url;
        title = tabs[0].title;
        let options = {
            method: "GET",
            headers: {},
        };
        options.headers['Authorization'] = `${localStorage.getItem(MS_TOKEN)}`;
        fetch(`${DOMAIN}/news/domains`, options)
            .then(data => {
            return data.json();
        })
            .then(data => {
            if (data.indexOf(URL.split('/').splice(0, 3).join('/') + '/') !== -1) {
                makeDonation(URL, title);
            }
            else {
                sendStatus('Donation is failed. Make Cents does not cooperate with this company.');
            }
        })
            .catch(err => console.error(err));
    });
});
const shareBtn = d.querySelector('#share-new');
function shareNew() {
    return __awaiter(this, void 0, void 0, function* () {
        hideEl(shareBtn);
        authenticationServiceProxy.shareDonation(URL);
        shareBtn.removeEventListener('click', shareNew);
    });
}
function makeDonation(URL, title) {
    const data = {
        newsDomain: URL.split('://')[0] + '://' + URL.split('/')[2] + '/',
        newsUrl: URL,
        newsTitle: title,
    };
    console.log(data);
    // const xhr = new XMLHttpRequest();
    //
    // xhr.withCredentials = true;
    fetch(`${DOMAIN}/payment/makepay`, {
        method: "POST",
        headers: {
            'Authorization': hasToken(),
            'Content-type': 'application/json',
            'Cache-control': 'no-cache',
        },
        body: JSON.stringify(data),
    })
        .then(data => {
        return data.json();
    })
        .then(data => {
        if (data.result) {
            sendStatus('Successfully Donated');
            authenticationServiceProxy.getToken()
                .then(token => {
                if (token) {
                    showEl(shareBtn);
                    shareBtn.addEventListener('click', shareNew);
                }
            }).catch(err => console.error(err));
        }
        else {
            sendStatus('Donation is failed. Please, check your Make Cents account. If there is enough money contact Make Cents Support, please.');
        }
    })
        .catch(err => console.error(err));
}
// function ping() {
//     fetch(`${DOMAIN}/ping`, {
//         method: "GET",
//         headers: {
//             'Accept': 'application/json, text/plain, */*',
//             'Content-Type': 'application/json'
//         }
//     })
//         .catch((err: any) => {
//             sendStatus('No connection to the server. Please, contact Make Cents Support.');
//             clearInterval(pingPong);
//         });
// }
//
// let pingPong = setInterval(ping, 5000); 
//# sourceMappingURL=popup.js.map