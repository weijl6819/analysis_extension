"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Uri } from '../common/BrowserHelpers'
// import { clients } from '../common/clients'
const common_1 = require("../common/common");
const ProxyServiceBase_1 = require("../common/ProxyServiceBase");
const Proxies_1 = require("../common/Proxies");
// import { utils } from "../common/utils";
class ContentProxy extends ProxyServiceBase_1.proxyService.ProxyServiceBase {
    constructor() {
        super(common_1.common.ContentProxy);
    }
}
let contentProxy = new ContentProxy();
var authenticationServiceProxy = new Proxies_1.AuthenticationServiceProxy(contentProxy);
let domainArray = new Array();
class ContentCode {
    start() {
        this.buildContent();
        // TODO сделать проверку что если это домен газеты что нам надо, запускать её парсер по hashMap-е и добавлять кнопку куда надо
        // подумать может сделать это конфигурацией через сервер, что бы получать селектор в какой елемент вставить кнопку и с какого угла расположить её, и даже указывать отступ в пикселях сверху, снизу, слева, справа
    }
    //Check is logged user and is partner this site
    checkPage() {
        chrome.runtime.sendMessage({ "domain": `*://${window.location.hostname}/*` });
    }
    buildContent() {
        document.body.appendChild(this.getBtn());
    }
    getBtn() {
        const btn = document.createElement('div');
        btn.addEventListener('click', () => { this.makePay(); });
        btn.className = 'makecents-content-btn';
        btn.innerText = 'Make Pay';
        return btn;
    }
    makePay() {
        authenticationServiceProxy.getToken()
            .then((token) => {
            var data = "newsName=TimeNews1";
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    debugger;
                }
            });
            xhr.open("POST", "https://makecents.online/payment/makepay");
            xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("authorization", token);
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.setRequestHeader("postman-token", "dba953f8-1527-b88a-76f1-a972bcfdf596");
            xhr.send(data);
        });
    }
}
let cc = new ContentCode();
cc.checkPage();
// cc.start(); 
//# sourceMappingURL=content.js.map