
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha

var ask;
(function (ask) {
    var apps;
    (function (apps) {
        var ContentScript;
        (function (ContentScript) {
            var channel;
            var commands = {
                getLocalStorage: function (data) {
                    var storage = window.localStorage;
                    var keys = data && data.keys && data.keys.length ? data.keys : Object.keys(storage);
                    return Promise.resolve(keys.reduce(function (p, key) {
                        p[key] = storage.getItem(key);
                        return p;
                    }, {}));
                }
            };
            function init() {
                var port = chrome.runtime.connect({ name: Util.guid("contentScript-" + chrome.runtime.id + "-") });
                channel = {
                    id: port.name,
                    port: port,
                    callbacks: new Map()
                };
                port.onMessage.addListener(onConnectMessage);
            }
            ContentScript.init = init;
            function onConnectMessage(message) {
                var command = commands[message.name] || channel.callbacks.get(message.name);
                if (command) {
                    command(message.data || message.error).then(function (response) {
                        if (message.reply) {
                            channel.port.postMessage({ name: message.reply, data: response });
                        }
                    }).catch(function (err) {
                        if (message.reply) {
                            try {
                                channel.port.postMessage({ name: message.reply, error: err });
                            }
                            catch (error) {
                                Logger.log('content_script: Error In onConnectMessage postMessage: ' + error);
                            }
                        }
                    });
                }
            }
        })(ContentScript = apps.ContentScript || (apps.ContentScript = {}));
    })(apps = ask.apps || (ask.apps = {}));
})(ask || (ask = {}));
ask.apps.ContentScript.init();
