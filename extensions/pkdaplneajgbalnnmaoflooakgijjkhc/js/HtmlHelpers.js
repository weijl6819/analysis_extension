
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
/**
 * HTML Helpers
 */
var HTML = (function(my){

  my.generateSelect = function(options, selected, handler){
    var selectList = document.createElement("select");
    selectList.id = "lifesizeSelect";
    var placeholder = chrome.i18n.getMessage("_select_header");
    selectList.setAttribute('data-placeholder', placeholder);

    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.value = options[i].value;
        option.text = options[i].text;
        if (option.value === selected) option.selected = true;
        selectList.appendChild(option);
    }
    selectList.onchange = handler;
    return selectList;
  };

  my.display = function(selector, show){
    var node = document.querySelector(selector);
    if (!node) return;
    if (show) node.style.display = 'block';
    else node.style.display = 'none';
  };


  my.span = function(text){
    return '<span>' + text + '</span>';
  };

  return my;

})(HTML || {});
