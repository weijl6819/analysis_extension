
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

var selectedText="";var gtbar=document.createElement('iframe');gtbar.style.position='fixed';(document.body||document.documentElement).appendChild(gtbar);function displayToolbar(){gtbar.style.border='0px inset';gtbar.style.width='100%';gtbar.style.height='35px';gtbar.id="gtbar";gtbar.name="gtbar";gtbar.src=chrome.extension.getURL("toolbarWindow.html")
gtbar.style.zIndex='999999';}
setTimeout('displayToolbar()',0);chrome.extension.onMessage.addListener(function(request,sender,sendResponse){autorSearchVerticalOrhorizontal=request.autoSearchDisplayType
if(request.greeting=="bottom"){(document.body||document.documentElement).style.position='relative';(document.body||document.documentElement).style.top='0px';gtbar.style.top=(window.innerHeight-34)+'px';document.getElementById('gtbar').src=chrome.extension.getURL("toolbarWindow.html");}
if(request.greeting=="top"){setTimeout('displayTop()',500);gtbar.style.top='0px';document.getElementById('gtbar').src=chrome.extension.getURL("toolbarWindow.html");}});function displayTop(){(document.body||document.documentElement).style.position='relative';(document.body||document.documentElement).style.top='35.5px';}
window.addEventListener('resize',function(e){chrome.extension.sendMessage({greeting:"resize"},function(response){document.getElementById('gtbar').src=chrome.extension.getURL("toolbarWindow.html");});},false);document.addEventListener('mouseup',function(e){var selection=window.getSelection().toString();if(selection=="")return;chrome.extension.sendMessage({greeting:"selectedSearchText",selection:""+selection},function(response){});},false);window.addEventListener('keydown',function(e){if(e.keyCode!=13)return;var selection=window.getSelection().toString();if(selection=="")return;if(localStorage['selectedSearchEngine']=="bing"){chrome.runtime.sendMessage({greeting:"enterSearch",url:"http://www.bing.com/?form=OSDSRC&q="+selection,selectionText:selection},function(response){});}else{chrome.runtime.sendMessage({greeting:"enterSearch",url:"http://www.google.com/search?q="+selection,selectionText:selection},function(response){});}
chrome.extension.sendMessage({greeting:"trackEvent"},function(response){});},false);