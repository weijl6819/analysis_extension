
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
const VMProvider=class extends AbstractProvider{search(){const a=$('.player_container');if(a.length){const b=a[0].id.replace('clip_','');b&&!this.ids[b]&&this.addVideo(b)}}getVideoData(a,b){const c=`https://player.vimeo.com/video/${a}/config`;$.get(c,(c)=>{const d=$('h1').text(),e=c.request.files.progressive,f=[];['360p','480p','720p','1080p'].forEach((b)=>{const c=e.find((a)=>a.quality===b);c&&f.push({title:d,url:c.url,vid:a,provider:'vm',quality:b})}),b(f)})}};