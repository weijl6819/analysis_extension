/**
 *
 * background.js
 */


/**
 *native message
 * @namsgbg {{connect: Function, onNativeMessage: Function, onDisconnected: Function, SendNativeMsg: Function}}
 */
//native message
var namsgbg = {
    port:null,
    hostName:"com.goldenkey.chrome.namsg.gk",
    connect:function(hostname){
        //console.log("host name: " + hostname);
        // "com.goldenkey.chrome.namsg.gk" hostname
        this.port = chrome.runtime.connectNative(hostname);
        this.port.onMessage.addListener( namsgbg.onNativeMessage);
        this.port.onDisconnect.addListener( namsgbg.onDisconnected);
    },
    onNativeMessage:function(message) {
        //TODO: need to add more check point
        if(message == "undefined")
            return;
        //console.log("#############Received message: " + JSON.stringify(message));
        try{
            if (message.caller == 'getSourceAndUqidCallback') {
                var uqid = message.result.substr(0,message.result.indexOf("source="));
                var source = message.result.substr(message.result.indexOf("source=") + 7);
                store.set('uqid',uqid);
                store.set('source',source);
            }
           
        }catch (e){
            console.log("error pop up");
        }
    },
    onDisconnected:function () {
        //console.log("Failed to connect: " + chrome.runtime.lastError.message);
        this.port = null;
    },
    SendNativeMsg:function(message){
        if (this.port == null) {
            namsgbg.connect(this.hostName);
        }
	if(this.port != null){
			//console.log("Send message: " + JSON.stringify(message));
            this.port.postMessage(message);
	}
    }
};

function sendMsgToContent(redirectTabID,param){
    chrome.tabs.sendMessage(redirectTabID,param);
}


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //console.log("onupdated: " + tab.url);
});

chrome.tabs.onCreated.addListener(function(tab) {
    //console.log("onCreate :");
    }
);

/**
 * onBeforeSendHeaders
 */
chrome.webRequest.onBeforeSendHeaders.addListener(function(data) {
   
}, { //Filter
    urls: ["<all_urls>"]
},["blocking", "requestHeaders"]);




/**
 * addListener : chrome.webRequest.onBeforeRequest
 */
chrome.webRequest.onBeforeRequest.addListener (function(details) {
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestBody"]
);





/**
 * init common data
 */
commonFunc.init();

/**
 * record data
 *
 */
var myDate = new Date();
console.log("start"+myDate.toLocaleDateString());
$(function () {
    var uqid_ = uqid_||store.get('uqid');
    var source_ = source_ || store.get('source');
    var version = commonFunc.parameters.pulgInVersion;
    var type = "chrome";
    var tongjienv = commonFunc.parameters.tongjienv || "";
    var strUrl = "";
    if(tongjienv == "")
        strUrl = " http://tongji.24money.com/api/statistic_addon.php?uqid="+uqid_+"&version="+version+"&type="+type+"&actionid="+action.BHOSTART+"&channelid="+source_;
    else
        strUrl = " http://tongji"+tongjienv+".24money.com/api/statistic_addon.php?uqid="+uqid_+"&version="+version+"&type="+type+"&actionid="+action.BHOSTART+"&channelid="+source_;

    commonFunc.ajaxFun(strUrl,'json',commonFunc.readFileSucess,commonFunc.readFileFailed,commonFunc.completeFun);
}());

console.log("end"+ myDate.toLocaleDateString());
/**
 * init Badge data
 */
updateBadge.init();
chrome.contextMenus.create({title:"股票行情助手",onclick:function(){
namsgbg.SendNativeMsg({action:'openGKApp',param:''});
}});






