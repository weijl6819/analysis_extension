
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
function insertTextIntoTextfield(string) {
  var textfield = document.activeElement;

  var caret_position = textfield.selectionStart;
  var new_caret_position = caret_position + string.length;
  var value = textfield.value;
  var value_before_caret = value.substring(0, caret_position);
  var value_after_caret = value.substring(caret_position, value.length);

  var new_value = value_before_caret + string + value_after_caret;
  textfield.value = new_value;

  textfield.selectionStart = new_caret_position;
  textfield.selectionEnd = new_caret_position;
  textfield.focus();
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    insertTextIntoTextfield(request.message);
  }
);
