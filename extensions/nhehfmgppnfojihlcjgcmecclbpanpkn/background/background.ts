import { common } from '../common/common';
import { clients } from '../common/clients';
import { testStuff } from '../common/teststuff';
import { utils } from '../common/utils';
import { proxyService } from '../common/ProxyServiceBase';
import { AuthenticationService } from '../background/AuthenticationService';

const DOMAIN = 'http://makecents.online';
// const DOMAIN = 'http://localhost:5000';

const MS_TOKEN = 'msToken';

let authenticationService = new AuthenticationService();

let domainArray: Array<string> = [];


class BackgroundProxyService extends proxyService.ProxyServiceBase {
    constructor() {
        super(common.BackgroundProxy);

        super.addService("AuthenticationService", authenticationService);
    }
}

async function getDomainsAndSetIcon() {
    let options = {
        method: "GET",
        headers: {},
    };
    options.headers['Authorization'] = `${localStorage.getItem(MS_TOKEN)}`;
    await fetch(`${DOMAIN}/news/domains`, options)
        .then(data => {
            return data.json();
        })
        .then(data => {
            data.forEach((item:any) => {
                //pushing domains to our domainArr using pattern for searching in chrome.tabs
                domainArray.push('*://' + item.split('/')[2] + '/*');
            });
        })
        .then( () => {

            chrome.tabs.query({}, (tabs) => {
                for(let i = 0; i < tabs.length; ++i) {
                    chrome.browserAction.setIcon({
                        path: "/icon-grey-dark.png",
                        tabId: tabs[i].id,
                    });
                }
            });
            chrome.tabs.query({ url: domainArray}, (tabs) => {
                for(let i = 0; i < tabs.length; ++i) {
                    chrome.browserAction.setIcon({
                        path: "/icon-red.png",
                        tabId: tabs[i].id,
                    });
                }
            });

        })
        .catch(err => console.error(err));
}

async function getDomains() {
    let options = {
        method: "GET",
        headers: {},
    };
    options.headers['Authorization'] = `${localStorage.getItem(MS_TOKEN)}`;
    await fetch(`${DOMAIN}/news/domains`, options)
        .then(data => {
            return data.json();
        })
        .then(data => {
            domainArray = [];
            data.forEach((item:any) => {
                //pushing domains to our domainArr using pattern for searching in chrome.tabs
                domainArray.push('*://' + item.split('/')[2] + '/*');
            });
        })
        .catch(err => console.error(err));
}

chrome.runtime.onMessage.addListener((r, s, sr) => {
   if(r.status) {
       if(r.status === 'login') {
           getDomainsAndSetIcon();
       } else if(r.status === 'logout') {
           chrome.tabs.query({}, (tabs) => {
               for(let i = 0; i < tabs.length; ++i) {
                   chrome.browserAction.setIcon({
                       path: "/icon-grey-light.png",
                       tabId: tabs[i].id,
                   });
               }
           });
       }

   } else if(r.domain) {
       //if authorized
       getDomains();
       if(localStorage.getItem(MS_TOKEN)) {
           if(domainArray.indexOf(`${r.domain}`) !== -1) {
               chrome.browserAction.setIcon({
                   path: "/icon-red.png",
                   tabId: s.tab.id,
               })
           } else {
               chrome.browserAction.setIcon({
                   path: "/icon-grey-dark.png",
                   tabId: s.tab.id,
               })
           }
           //if not authorized
       } else {
           chrome.browserAction.setIcon({
               path: "/icon-grey-light.png",
               tabId: s.tab.id,
           })
       }
   }
});

let backgrounProxyService = new BackgroundProxyService();

//when background loaded and user auth, sets true icons on tabs
localStorage.getItem(MS_TOKEN) ? getDomainsAndSetIcon() : '';

//utils.logger.shouldLog = true;

async function TestShaharp()
{
    let token = await authenticationService.getToken();
    let xxx = new clients.ServiceClient(token, "140579966013837");
    await xxx.addUserNote("100000701182905", "Test test test" + utils.generateGuid());
    //await xxx.addUserNote("111", "Some note");
    //await xxx.updateWarningLevel("111", 2);
    //let available = await xxx.getActivities("111");
    //let p1 = xxx.getUserMetadata("111");
    //let p2 = xxx.getUserMetadata("222");
    //let md1 = await p1;
    //let md2 = await p2;
    //console.log(`md1:${md1.warningLevel}, md2:${md2.warningLevel}`);
    //console.log(`activities ${JSON.stringify(available)}`);

}

async function TestShaharpAsyncBatcher() {
    let ab = new testStuff.TestAsyncBatcher();


    for (let i = 0; i < 40; i++) {
        let pp = ab.get(i.toString());
        if (i % 5 == 0) {
            pp.then(v => console.log(`result was ${v}`));
        }
    }
}

window['testShaharp'] = TestShaharp;
window['testAsyncBatcher'] = TestShaharpAsyncBatcher;


// function logMessage(message: any) {
//     console.log(message);
// }