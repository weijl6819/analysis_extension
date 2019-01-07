
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
const TWProvider=class extends AbstractProvider{constructor(){super(),this.oauth2_access_token=null,this.getCredentialToken(()=>this.getAccessToken())}getCredentialToken(a){const b=new XMLHttpRequest;b.open('GET','https://getvideo.site/vlc-tw-token/',!0),b.onload=()=>{200===b.status&&(TWProvider.ENCODED_TOKEN_CREDENTIAL=b.responseText),a()},b.send()}getAccessToken(a){const b=this;$.ajax({type:'POST',url:TWProvider.OAUTH2_TOKEN_API_URL,headers:{Authorization:'Basic '+TWProvider.ENCODED_TOKEN_CREDENTIAL,"Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'},data:{grant_type:'client_credentials'},dataType:'json',xhrFields:{withCredentials:!1},success:(c)=>{b.oauth2_access_token=c.access_token,a&&a()}})}search(){this.oauth2_access_token&&$('video').not('.'+INIT_CLASS).each((a,b)=>{const c=$(b),d=c.closest('[data-item-id]').attr('data-item-id');d&&!this.ids[d]&&this.addVideo(d),c.addClass(INIT_CLASS)})}getVideoData(a,b){const c=`https://api.twitter.com/1.1/statuses/show.json?id=${a}&include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&trim_user=false&include_ext_media_color=true`;$.ajax({type:'GET',url:c,dataType:'json',headers:{Authorization:'Bearer '+this.oauth2_access_token},success:(c)=>{const d=c.full_text,e=[];c.extended_entities.media[0].video_info.variants.filter((a)=>'video/mp4'===a.content_type).forEach((b)=>{const c=b.url,f=c.match(/vid\/(.+)\//),g=f&&f[1]?f[1]:'';e.push({title:d,url:c,vid:a,provider:'tw',quality:g})}),b(e)}})}};TWProvider.OAUTH2_TOKEN_API_URL='https://api.twitter.com/oauth2/token',TWProvider.ENCODED_TOKEN_CREDENTIAL='d2duSVAyeVVLQllUYVdRamg2MUYzR3NCbTpBeXNpdVFuclRYOG51UlNJWUp4OE1zaTdXbTAxTnJrNVBlNVptOTVXZXZFQU83Z0xzMw==';