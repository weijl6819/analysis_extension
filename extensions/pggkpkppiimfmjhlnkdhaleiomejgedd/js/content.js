
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
const INIT_CLASS='mtz-vlc-'+chrome.runtime.id;class Content{constructor(){this.pr=null,this.initProvider(),this.initRuntimeListener()}initProvider(){location.href.includes('facebook.com')?this.pr=new FBProvider:location.href.includes('vk.com')?this.pr=new VKProvider:location.href.includes('vimeo.com')?this.pr=new VMProvider:location.href.includes('dailymotion.com')?this.pr=new DMProvider:location.href.includes('instagram.com')?this.pr=new INProvider:location.href.includes('twitter.com')&&(this.pr=new TWProvider),this.pr&&this.pr.run()}initRuntimeListener(){chrome.runtime.onMessage.addListener((a,b,c)=>{'getVideo'===a.action&&c(this.pr.videos),'openAppInSidebar'===a.action&&this.openAppInSidebar()})}openAppInSidebar(){let a=document.getElementById('vlc-root');a?(a.classList.remove('vlc-show'),setTimeout(()=>a.remove())):(a=document.createElement('div'),a.id='vlc-root',document.body.appendChild(a),window.runVlcApp(),a.classList.add('vlc-show'))}}window.ContentScript=new Content;