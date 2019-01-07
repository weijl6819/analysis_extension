
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
const VKProvider=class extends AbstractProvider{search(){$('video').not('.'+INIT_CLASS).each((a,b)=>{const c=this.getVideoIdByHtml(b);c&&!this.ids[c]&&this.addVideo(c),b.classList.add(INIT_CLASS)}),$('.page_post_thumb_video[data-video]').not('.'+INIT_CLASS).each((a,b)=>{const c=$(b).attr('data-video');c&&!this.ids[c]&&this.addVideo(c),b.classList.add(INIT_CLASS)})}getVideoIdByHtml(a){const b=a.closest('.video_box_wrap');if(b){const a=b.id.replace('video_box_wrap','');return a?a:void console.warn('video id not found')}}getVideoData(a,b){$.get('https://vk.com/al_video.php?act=show_inline&al=1&video='+a,(c)=>{var d,e=/<!json>(.*)/.exec(c);if(e&&(d=e[1],d=d.split('<!>')[0],d=JSON.parse(d),!!d)){const c=d.player.params[0],e=c.extra_data,f=[],g=c.md_title;if(c.url360&&f.push({title:g,url:c.url360,vid:a,provider:'vk',quality:'360'}),c.url480&&f.push({title:g,url:c.url480,vid:a,provider:'vk',quality:'480'}),c.url720&&f.push({title:g,url:c.url720,vid:a,provider:'vk',quality:'720'}),e&&e.includes('instagram')){f.push(new Video(g,'https:'+e,'640p'))}else if(e&&/^[a-zA-Z0-9\-_]+$/.test(e));else;b(f)}})}};