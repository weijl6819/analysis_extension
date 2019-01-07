
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
"use strict";function showUserMessage(e,t){console.log("showUserMessage",e);var s=document.createElement("div");s.id="driveslides-usermessage",s.innerHTML=e,s.style.position="fixed",s.style.top="40px",s.style.left="50%",s.style.zIndex=1000002,s.style.width="500px",s.style.background="rgba(50, 50, 50, 0.96)",s.style.boxShadow="0 1px 3px rgba(0,0,0,0.6)",s.style.borderRadius="3px",s.style.color="#ffffff ",s.style.marginLeft="-250px",s.style.padding="16px 24px 14px",s.style.fontSize="14px",s.style.lineHeight="20px",s.style.minHeight="20px",s.style.textAlign="center",s.style.fontFamily="Roboto, sans-serif";var o=s.children[0];o&&(o.style.textDecoration="underline",o.style.color="#a1c2fa ",o.style.color="#a1c2fa ",o.style.fontSize="15px",o.style.fontWeight="bold",o.style.marginTop="15px",o.style.display="block",o.style.outline=0,o.onmouseenter=function(){this.style.textDecoration="none"},o.onmouseout=function(){this.style.textDecoration="underline"}),document.body.appendChild(s),t&&setTimeout(hideUserMessage,1e3*t)}function hideUserMessage(){var e=document.getElementById("driveslides-usermessage");e&&(e.style.display="none",e.remove())}
//# sourceMappingURL=contentscript.js.map
