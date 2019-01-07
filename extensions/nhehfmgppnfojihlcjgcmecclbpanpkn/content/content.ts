// import { Uri } from '../common/BrowserHelpers'
// import { clients } from '../common/clients'
import { common } from '../common/common';
import { proxyService } from '../common/ProxyServiceBase';
import { AuthenticationServiceProxy } from '../common/Proxies';
// import { utils } from "../common/utils";

class ContentProxy extends proxyService.ProxyServiceBase {
    constructor() {
        super(common.ContentProxy);
    }
}

let contentProxy = new ContentProxy();

var authenticationServiceProxy = new AuthenticationServiceProxy(contentProxy);

let domainArray: Array<string> = new Array();

class ContentCode {

    public start() {
        this.buildContent();
        // TODO сделать проверку что если это домен газеты что нам надо, запускать её парсер по hashMap-е и добавлять кнопку куда надо
        // подумать может сделать это конфигурацией через сервер, что бы получать селектор в какой елемент вставить кнопку и с какого угла расположить её, и даже указывать отступ в пикселях сверху, снизу, слева, справа
    }
    //Check is logged user and is partner this site
    public checkPage() {
        chrome.runtime.sendMessage({"domain" : `*://${window.location.hostname}/*`});
    }
    public buildContent() {
        document.body.appendChild(this.getBtn())
    }
    public getBtn() {
        const btn = document.createElement('div');
        btn.addEventListener('click', () => {this.makePay()});
        btn.className = 'makecents-content-btn';
        btn.innerText = 'Make Pay';
        return btn;
    }
    public makePay() {
        authenticationServiceProxy.getToken()
            .then((token: any) => {
                var data = "newsName=TimeNews1";

                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;

                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        debugger
                    }
                });

                xhr.open("POST", "https://makecents.online/payment/makepay");
                xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
                xhr.setRequestHeader("authorization", token);
                xhr.setRequestHeader("cache-control", "no-cache");
                xhr.setRequestHeader("postman-token", "dba953f8-1527-b88a-76f1-a972bcfdf596");

                xhr.send(data);
            })
    }
}

let cc = new ContentCode();
cc.checkPage();
// cc.start();