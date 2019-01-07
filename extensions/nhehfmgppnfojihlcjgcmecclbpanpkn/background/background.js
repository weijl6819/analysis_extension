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
const clients_1 = require("../common/clients");
const teststuff_1 = require("../common/teststuff");
const utils_1 = require("../common/utils");
const ProxyServiceBase_1 = require("../common/ProxyServiceBase");
const AuthenticationService_1 = require("../background/AuthenticationService");
const DOMAIN = 'http://makecents.online';
// const DOMAIN = 'http://localhost:5000';
const MS_TOKEN = 'msToken';
let authenticationService = new AuthenticationService_1.AuthenticationService();
let domainArray = [];
class BackgroundProxyService extends ProxyServiceBase_1.proxyService.ProxyServiceBase {
    constructor() {
        super(common_1.common.BackgroundProxy);
        super.addService("AuthenticationService", authenticationService);
    }
}
function getDomainsAndSetIcon() {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            method: "GET",
            headers: {},
        };
        options.headers['Authorization'] = `${localStorage.getItem(MS_TOKEN)}`;
        yield fetch(`${DOMAIN}/news/domains`, options)
            .then(data => {
            return data.json();
        })
            .then(data => {
            data.forEach((item) => {
                //pushing domains to our domainArr using pattern for searching in chrome.tabs
                domainArray.push('*://' + item.split('/')[2] + '/*');
            });
        })
            .then(() => {
            chrome.tabs.query({}, (tabs) => {
                for (let i = 0; i < tabs.length; ++i) {
                    chrome.browserAction.setIcon({
                        path: "/icon-grey-dark.png",
                        tabId: tabs[i].id,
                    });
                }
            });
            chrome.tabs.query({ url: domainArray }, (tabs) => {
                for (let i = 0; i < tabs.length; ++i) {
                    chrome.browserAction.setIcon({
                        path: "/icon-red.png",
                        tabId: tabs[i].id,
                    });
                }
            });
        })
            .catch(err => console.error(err));
    });
}
function getDomains() {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            method: "GET",
            headers: {},
        };
        options.headers['Authorization'] = `${localStorage.getItem(MS_TOKEN)}`;
        yield fetch(`${DOMAIN}/news/domains`, options)
            .then(data => {
            return data.json();
        })
            .then(data => {
            domainArray = [];
            data.forEach((item) => {
                //pushing domains to our domainArr using pattern for searching in chrome.tabs
                domainArray.push('*://' + item.split('/')[2] + '/*');
            });
        })
            .catch(err => console.error(err));
    });
}
chrome.runtime.onMessage.addListener((r, s, sr) => {
    if (r.status) {
        if (r.status === 'login') {
            getDomainsAndSetIcon();
        }
        else if (r.status === 'logout') {
            chrome.tabs.query({}, (tabs) => {
                for (let i = 0; i < tabs.length; ++i) {
                    chrome.browserAction.setIcon({
                        path: "/icon-grey-light.png",
                        tabId: tabs[i].id,
                    });
                }
            });
        }
    }
    else if (r.domain) {
        //if authorized
        getDomains();
        if (localStorage.getItem(MS_TOKEN)) {
            if (domainArray.indexOf(`${r.domain}`) !== -1) {
                chrome.browserAction.setIcon({
                    path: "/icon-red.png",
                    tabId: s.tab.id,
                });
            }
            else {
                chrome.browserAction.setIcon({
                    path: "/icon-grey-dark.png",
                    tabId: s.tab.id,
                });
            }
            //if not authorized
        }
        else {
            chrome.browserAction.setIcon({
                path: "/icon-grey-light.png",
                tabId: s.tab.id,
            });
        }
    }
});
let backgrounProxyService = new BackgroundProxyService();
//when background loaded and user auth, sets true icons on tabs
localStorage.getItem(MS_TOKEN) ? getDomainsAndSetIcon() : '';
//utils.logger.shouldLog = true;
function TestShaharp() {
    return __awaiter(this, void 0, void 0, function* () {
        let token = yield authenticationService.getToken();
        let xxx = new clients_1.clients.ServiceClient(token, "140579966013837");
        yield xxx.addUserNote("100000701182905", "Test test test" + utils_1.utils.generateGuid());
        //await xxx.addUserNote("111", "Some note");
        //await xxx.updateWarningLevel("111", 2);
        //let available = await xxx.getActivities("111");
        //let p1 = xxx.getUserMetadata("111");
        //let p2 = xxx.getUserMetadata("222");
        //let md1 = await p1;
        //let md2 = await p2;
        //console.log(`md1:${md1.warningLevel}, md2:${md2.warningLevel}`);
        //console.log(`activities ${JSON.stringify(available)}`);
    });
}
function TestShaharpAsyncBatcher() {
    return __awaiter(this, void 0, void 0, function* () {
        let ab = new teststuff_1.testStuff.TestAsyncBatcher();
        for (let i = 0; i < 40; i++) {
            let pp = ab.get(i.toString());
            if (i % 5 == 0) {
                pp.then(v => console.log(`result was ${v}`));
            }
        }
    });
}
window['testShaharp'] = TestShaharp;
window['testAsyncBatcher'] = TestShaharpAsyncBatcher;
// function logMessage(message: any) {
//     console.log(message);
// } 
//# sourceMappingURL=background.js.map