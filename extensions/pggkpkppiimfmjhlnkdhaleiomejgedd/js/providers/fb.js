
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
const FBProvider=class extends AbstractProvider{search(){$('video').not('.'+INIT_CLASS).each((a,b)=>{const c=b.closest('[data-testid="fbfeed_story"], [role="article"], [data-bt], ._5asm, ._5-yb._5_63, ._4-u2.mbm._4mrt._5jmm, ._5-yb._5_63'),d=this.getVideoIdByHtml(c);d&&!this.ids[d]&&this.addVideo(d),b.classList.add(INIT_CLASS)})}getVideoIdByHtml(a){if(!a)return console.warn('No parent target selector.');const b=a.outerHTML,c=/\/videos\/(\d+)[^\/?]?/g.exec(b);if(c&&c[1])return c[1];const d=/\/videos\/[a-z]{2,3}\.\d+\/(\d+)\/?/g.exec(b);if(d&&d[1])return d[1];const e=/mf_story_key&quot;:&quot;(\d+)&quot;/g.exec(b);if(e&&e[1])return e[1];const f=/ajaxify="\/ajax\/sharer\/\?s=\d+&amp;appid=\d+&amp;id=(\d+)&/g.exec(b);if(f&&f[1])return f[1];const g=/;mf_story_key&quot;:&quot;(\d+)&/g.exec(b);return g&&g[1]&&g[1]}getVideoData(a,b){const c=new Request('https://www.facebook.com/video.php?v='+a,{method:'GET',redirect:'follow'});fetch(c).then((a)=>a.text()).then((c)=>{const d=this.getVideoTitle(c).htmlSymDecode(),e=this.getHDSrc(c),f=this.getSDSrc(c),g=[];f&&g.push({title:d,url:f,vid:a,provider:'fb',quality:'360'}),e&&g.push({title:d,url:e,vid:a,provider:'fb',quality:'720'}),b(g)})}getHDSrc(a){const b=/hd_src_no_ratelimit:"([^"]+)"/.exec(a);return b&&b[1]?b[1]:null}getSDSrc(a){const b=/sd_src_no_ratelimit:"([^"]+)"/.exec(a);return b&&b[1]?b[1]:null}getVideoTitle(a){const b=/h2 class="uiHeaderTitle"?[^>]+>(.+?)<\/h2>/.exec(a);if(b&&b[1])return b[1];const c=/title id="pageTitle">([\s\S]+?)<\/title>/.exec(a);return c&&c[1]?c[1]:''}};