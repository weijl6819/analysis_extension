
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
var ExtensionDetect;
(function (ExtensionDetect) {
    var fromExtension = 'EXTENSION';
    function init() {
        var configReady = getConfigWhenReady();
        var domLoad = listenForDomLoad();
        configReady.then(function (configData) {
            setInstalledCookies(configData.buildVars.configDefId);
        }).catch(Logger.log);
        Promise.all([configReady, domLoad]).then(function (values) {
            var configData = values[0];
            initListeners(configData);
        }).catch(Logger.log);
    }
    function listenForDomLoad() {
        return new Promise(function (resolve, reject) {
            try {
                window.addEventListener('DOMContentLoaded', function loadListener(e) {
                    window.removeEventListener('DOMContentLoaded', loadListener);
                    resolve(e);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    function getConfigWhenReady() {
        var configPromise = new Promise(function (resolve, reject) {
            try {
                var port_1 = chrome.runtime.connect({
                    name: Util.guid("extensionDetect-" + chrome.runtime.id + "-")
                });
                function backgroundReadyListener(message) {
                    if (message.name === 'backgroundReady') {
                        port_1.onMessage.removeListener(backgroundReadyListener);
                        port_1.disconnect();
                        resolve(message.data.state);
                    }
                }
                port_1.onMessage.addListener(backgroundReadyListener);
            }
            catch (err) {
                reject(err);
            }
        });
        return configPromise;
    }
    function initListeners(configData) {
        var commands = getCommands(configData);
        var messenger = createMessenger(parseInt(configData.buildVars.configDefId));
        function messageListener(message) {
            var data;
            if (typeof message.data === 'string') {
                try {
                    data = JSON.parse(message.data);
                }
                catch (e) {
                    Logger.log('error parsing JSON in DLP message: %o', e);
                    return;
                }
            }
            else {
                data = message.data;
            }
            if (data.from !== fromExtension && commands.hasOwnProperty(data.status)) {
                commands[data.status](messenger.bindToStatus(data.status), data);
            }
        }
        window.addEventListener('message', messageListener);
        messenger.send('TOOLBAR_READY');
    }
    function createMessenger(toolbarId) {
        var msgTarget = document.location.origin;
        function send(status, data) {
            var message = {
                toolbarId: toolbarId,
                status: status,
                from: fromExtension,
                message: data
            };
            window.postMessage(JSON.stringify(message), msgTarget);
        }
        ;
        function bindToStatus(status) {
            return send.bind(null, status);
        }
        return {
            send: send,
            bindToStatus: bindToStatus
        };
    }
    function getCommands(configData) {
        return {
            GET_INFO: function (reply) {
                reply({
                    toolbarId: configData.state.toolbarData.toolbarId,
                    partnerId: configData.state.toolbarData.partnerId,
                    partnerSubId: configData.state.toolbarData.partnerSubId,
                    installDate: configData.state.toolbarData.installDate,
                    toolbarVersion: configData.buildVars.version,
                    toolbarBuildDate: configData.buildVars.buildDate,
                });
            }
        };
    }
    function setInstalledCookies(toolbarId) {
        var hourFromNow = new Date(Date.now() + (1 * 60 * 60 * 1000)).toUTCString();
        document.cookie = "mindsparktb_" + toolbarId + "=true; expires=" + hourFromNow + "; path=/";
        document.cookie = "mindsparktbsupport_" + toolbarId + "=true; expires=" + hourFromNow + "; path=/";
    }
    init();
})(ExtensionDetect || (ExtensionDetect = {}));
