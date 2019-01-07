
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
var Installer=(function(){var a=(function(){var c={installer_bic:"__INSTALLER_BIC__",installer_verifier:"__INSTALLER_VERIFIER__",installer_verifier_for_215app:"__INSTALLER_50_VERIFIER__"};var d={AnySoftware:"__ANYSOFTWARE_PLACEHOLDER__",InsideVM:"__INSIDEVM_PLACEHOLDER__",InsideVMWare:"__INSIDEVMWARE_PLACEHOLDER__",InsideVirtualBox:"__INSIDEVIRTUALBOX_PLACEHOLDER__",InsideVirtualPc:"__INSIDEVIRTUALPC_PLACEHOLDER__",VMWare:"__VMWAREEXISTS_PLACEHOLDER__",VirtualBox:"__VIRTUALBOXEXISTS_PLACEHOLDER__",Wireshark:"__WIRESHARKEXISTS_PLACEHOLDER__"};var g={source_id:"__SOURCE_ID__",sub_id:"__SUB_ID__",uzid:"__UZID__"};var e="__ADDITIONAL_INFO_PLACEHOLDER__";var b=function(){var i="__ADDITIONAL";var h="_INFO_PLACEHOLDER__";if(!e||e===i+h){return null;}return e;};var f=(function(){if(typeof Delegate==="undefined"){return function(){};}var h=new Delegate();var j=true;var i=b();if(i){chrome.storage.local.set({__cachedAdditionalInfo:i},function(){j=false;h.invokeOnce(i);});}else{chrome.storage.local.get("__cachedAdditionalInfo",function(k){i=k.__cachedAdditionalInfo?k.__cachedAdditionalInfo:null;j=false;h.invokeOnce(i);});}return function(k){if(j){h.addObserver(k);return;}k(i);};}());return{version:"__INSTALLER_VERSION__",isFirstInstall:"__FIRST_INSTALL__",installationTime:"__INSTALLATION_TIME_PLACEHOLDER__",installerParams:g,installedSoftware:d,installerIdentifiers:c,installationThankYouPage:"__INSTALLATION_THANKYOU_PAGE_PLACEHOLDER__",defualtBrowser:"__DEFAULT_BROWSER_PLACEHOLDER__",getAdditionalInfo:b,getCachedAdditionalInfo:f};}());return function(){return a;};}());
