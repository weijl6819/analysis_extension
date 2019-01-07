
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



const enableDebugger = false;
const powerAdSpyApi = "https://api.poweradspy.com/";
const powerAdSpyLander = "https://app.poweradspy.io/landing?ad-id=";
const powerAdSpyEarning = "https://app.poweradspy.com/userEarning";//post request
const powerAdSpyAmemberLogin = "https://app.poweradspy.com/amember/login";//get request
const powerAdSpyAmemberSignUp = "https://app.poweradspy.com/userEarning?fid=";
const powerAdSpyRewards = "https://api.poweradspy.com/userRewards";
const powerAdSpyLogin = "https://app.poweradspy.com/loginpage";
const manifest = chrome.runtime.getManifest();
const version = manifest.version;
const appName = "PowerAdSpy";
const powerAdSpyYTApi = "https://tubeapi.poweradspy.com/api/";
const powerAdSpyGText = "https://gtext.poweradspy.com/api/";
//server=1,user=3,FBPage=11
const Platform = "3";
