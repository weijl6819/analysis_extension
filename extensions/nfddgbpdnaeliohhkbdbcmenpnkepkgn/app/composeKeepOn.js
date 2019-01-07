
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
var initKeepOnCheckbox = function (key) {
    var dlg = document.querySelector('.inboxsdk__modal_container');
    var sec = document.createElement('div');
    sec.className = 'Kj-JD-Jz inboxsdk__modal_buttons net_checkbox-section';
    sec.innerHTML = '<input type="checkbox" name="NET_REMEMBER_SETTINGS" id="NET_REMEMBER_SETTINGS"> &nbsp;<label for="NET_REMEMBER_SETTINGS">Leave turned on</label>';
    dlg.appendChild(sec);
    var cb = document.getElementById('NET_REMEMBER_SETTINGS');
    if (localStorage['NET_KOC_' + key])
        cb.checked = true;
    else
        cb.checked = false;
    cb.addEventListener('change', function (e) {
        if (localStorage['NET_KOC_' + key])
            localStorage.removeItem('NET_KOC_' + key);
        else
            localStorage['NET_KOC_' + key] = '1';
    });
};

var getKeepOnCheckboxState = function (key) {
    if (localStorage['NET_KOC_' + key])
        return true;
    return false;
};