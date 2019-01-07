
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
const DMProvider=class extends AbstractProvider{search(){const a=this.getIdFromLocation();a&&!this.ids[a]&&this.addVideo(a)}getIdFromLocation(){return /^\/\w{0,2}$/.test(location.pathname)?null:location.pathname.replace('/video/','')}getVideoData(a,b){chrome.runtime.sendMessage({action:'ajaxGet',url:'https://www.dailymotion.com/video/'+a},(c)=>{const d=this.getVideoDataFromHTML(c),e=d.map((b)=>(b.vid=a,b.provider='dm',b));b(e)})}getVideoDataFromHTML(a){if(!a)return void console.warn('!str for parsing');const b='var __PLAYER_CONFIG__ = {',c='};',d=a.indexOf(b),e=a.indexOf(c,d),f=a.substr(d+b.length-1,e-d-b.length+c.length),g=JSON.parse(f),h=g.metadata.title,i=[];return['380','480','720@60'].forEach((a)=>{const b=this.getUrlFromConfig(g,a);b&&i.push({title:h,url:b,quality:a})}),i}getUrlFromConfig(a,b){const c=a.metadata.qualities[b];if(c){const a=c.find((a)=>'video/mp4'===a.type);return a?a.url:null}}};