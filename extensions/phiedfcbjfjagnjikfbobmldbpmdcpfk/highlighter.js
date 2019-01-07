
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
function HighlighterStart(){this.Created||(Highlighter.create(),this.Created=!0),Highlighter.setExtentionsEnabled(!0),Highlighter.stop()}function HighlighterStop(){Highlighter.setExtentionsEnabled(!1),Highlighter.stop()}function HighlighterColor(t){Highlighter.setColor(t)}function HighlighterOpacity(t){Highlighter.setOpacity(t/100)}function HighlighterShadow(t){Highlighter.setShadow(t?"black 0px 0px 15px":"none")}var Highlighter={ExtentionsEnabled:!1,Enabled:!1,Elements:":header, p, pre",HightlighterID:"highlighter",Color:"#ffff00",Opacity:.2,Shadow:"black 0px 0px 15px",MaxZIndex:2147483647,updateHighLighter:function(){$("#"+this.HightlighterID).css({"background-color":this.Color,opacity:this.Opacity,"box-shadow":this.Shadow})},hideHighLighter:function(){$("#"+this.HightlighterID).hide()},showHighLighter:function(t,i,e,h){$("#"+this.HightlighterID).css({top:t,left:i-5,height:e,width:h+10}).show()},createHighLighter:function(){$("<div>").attr("id",this.HightlighterID).css({position:"absolute","border-radius":"25px","z-index":this.MaxZIndex,"background-color":this.Color,opacity:this.Opacity,"box-shadow":this.Shadow}).hide().appendTo(document.body)},setColor:function(t){this.Color=t,this.updateHighLighter()},setOpacity:function(t){this.Opacity=t,this.updateHighLighter()},setShadow:function(t){this.Shadow=t,this.updateHighLighter()},setExtentionsEnabled:function(t){this.ExtentionsEnabled=t},stop:function(){this.Enabled=!1,this.hideHighLighter()},start:function(){this.Enabled=!0},create:function(){var t=this,i=[],e=[],h=0,o=function(t,i){var e,i=i||200;return function(){var h=this,o=arguments;clearTimeout(e),e=setTimeout(function(){t.apply(h,Array.prototype.slice.call(o))},i)}},n=function(t){var i=0,e=0;if(0===t.length)return i;for(var h=0,o=t.length;o>h;h++)e=t.charCodeAt(h),i=(i<<5)-i+e,i&=i;return i},l=function(t,i,e){return Math.min(Math.max(e,t),i)},r=function(t){this.$fake||(this.$fake=$("<span>").hide().text("x").appendTo(document.body),this.cache={});var i=window.getComputedStyle(t),e={font:i.font},h=n(JSON.stringify(e));if(!(h in this.cache)){for(key in e)this.$fake[0].style[key]=e[key];this.cache[h]=this.$fake.height()}return this.cache[h]},a=function(){e=$(document).find(t.Elements),e=e.filter(function(t,i){return $(i).text().trim().length>0})},g=function(){var t=[],h=$(window).scrollTop(),o=$(window).scrollLeft(),n=0,l=0,a=0,g=0,c=0,d=null,s=0,u=0,p=0,f=0,w=null;for(u=0,f=e.length;f>u;u++)if(d=e[u].getBoundingClientRect())for(w=window.getComputedStyle(e[u]),s=parseFloat(w.paddingTop.replace("px","")),paddingBottom=parseFloat(w.paddingBottom.replace("px","")),g=r(e[u]),c=d.width,a=d.left+o,n=Math.round((d.height-(s+paddingBottom))/g,0),p=0;n>p;p++)l=d.top+s+h+g*p,t.push({i:u,j:p,n:n,top:l,left:a,height:g,width:c});i=t},c=function(t){$("html,body").animate({scrollTop:t},200)},d=function(e){if(t.Enabled&&t.ExtentionsEnabled){t.hideHighLighter(),h=l(0,i.length-1,h+e),t.showHighLighter(i[h].top,i[h].left,i[h].height,i[h].width);var o=$(document).scrollTop(),n=$(window)[0].innerHeight,r=Math.floor(i[h].top),a=Math.ceil(i[h].top+i[h].height);a>o+n?c(r-50):o>r&&c(r-n+50)}};$(window).on("resize",o(function(){var t=i[h].i,e=i[h].j/i[h].n,o=0,n=0;for(g(),o=0,n=i.length;n>o;o++)if(i[o].i===t){h=o+Math.round(e*i[o].n,0);break}d(0)},200)),$(document).on("keydown",function(i){var e=i.keyCode||i.which;switch(e){case 27:t.stop();break;case 38:d(-1);break;case 40:d(1);break;default:return}t.Enabled&&t.ExtentionsEnabled&&i.preventDefault()}),$(document).on("dblclick","#"+t.HightlighterID,function(){t.stop()}),$(document).on("dblclick",t.Elements,function(o){var n=-1,l=0,r=0,a=-1,g=$(this)[0],c=null,s=0;for(t.start(),l=0,r=e.length;r>l;l++)if(e[l]==g){n=l;break}if(n>-1&&(c=e[n].getBoundingClientRect())){for(s=(o.clientY-c.top)/c.height,l=0,r=i.length;r>l;l++)if(i[l].i===n){a=l+Math.floor(s*i[l].n);break}h=a,d(0)}}),t.createHighLighter(),a(),g()}};!function(t,i,e){t(e).ready(function(){chrome.storage.local.get(["hlEnabled","hlColor","hlOpacity","hlShadow"],function(t){t.hlEnabled?HighlighterStart():HighlighterStop(),t.hlColor&&HighlighterColor(t.hlColor),t.hlOpacity&&HighlighterOpacity(t.hlOpacity),t.hlShadow?HighlighterShadow(!0):HighlighterShadow(!1)}),chrome.storage.onChanged.addListener(function(t){t.hlEnabled&&(t.hlEnabled.newValue?HighlighterStart():HighlighterStop()),t.hlColor&&t.hlColor.newValue&&HighlighterColor(t.hlColor.newValue),t.hlOpacity&&t.hlOpacity.newValue&&HighlighterOpacity(t.hlOpacity.newValue),t.hlShadow&&(t.hlShadow.newValue?HighlighterShadow(!0):HighlighterShadow(!1))})})}(window.jQuery,window,document);