
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
// function x(a) {
//     E = a.target;

//     var l = a.pageX + "px",
//         t = a.pageY + "px";
        
//     var i = new Image();
//     i.addEventListener("click", g); 
//     i.src = chrome.extension.getURL("images/clock.png");
    
//     var e = document.createElement('div');
//     e.setAttribute("id", "hello1234");
//     e.style.position = "absolute";
//     e.style.left = l;
//     e.style.top = t;
//     e.style.zIndex = 999;
//     e.append(d);

//     document.body.appendChild(e);
// }

// function g() {
//     chrome.runtime.sendMessage({
//         message_id: "start_recording"
//     });
//     n();
// }

// function n() {}

function y() {
    $("#voicebox").fadeOut("slow")
}

function z(a) {
    if ($(document.activeElement).is(F)) {
        $("#voicebox").fadeIn("fast");
        document.getElementById("voicebox").innerHTML = a;
    }
}

function A(a) {
    if ($(document.activeElement).is(F)) {
        E = document.activeElement; 
        i(a);
        $("#voicebox").fadeOut("slow");
    }  
}

function i(a) {
    if (a.length > 0) {
        var b = B(E, 6),
            c = b.length > 0 && " " == b[b.length - 1] || b[b.length - 1] == String.fromCharCode(160);
        return b = X(b), (Z(b, ia) || 0 == b.length || "" == b || void 0 == b || "null" === b) && (a = Y(a)), b.length > 0 && !c && [ha, "("].indexOf(b[b.length - 1]) === -1 && [".", ",", ";", ":", "?", "!", ")"].indexOf(a[0]) === -1 && (a = " " + a), D(E, a), a.length
    }

    return 0;
}

function B(a, b) {
    var c, d = "";
    switch (a.tagName) {
        case "INPUT":
        case "TEXTAREA":
            var e = a.value;
            c = a.selectionStart;
            var f = Math.max(0, c - b);
            d = e.substring(f, c);
            break;
        case "DIV":
        default:
            var g = window.getSelection().getRangeAt(0);
            if (g.collapse(!1), g.collapsed) {
                c = g.startOffset;
                var f = Math.max(0, c - b);
                d = g.startContainer.textContent.substring(c - b, c + 1)
            }
    }
    return d;
}

function C() {
    var a = window.getSelection().getRangeAt(0);
    if (a.collapsed) {
        return a.startContainer.textContent.substring(0, a.startOffset + 1).split(/\b/g).pop()
    }
    return ""
}

function D(a, b) {
    var c, d;
    switch (a.tagName) {
        case "INPUT":
        case "TEXTAREA":
            a.blur(), a.focus(), $.event.trigger({
                type: "keypress"
            }), d = a.selectionStart, c = a.value, a.value = c.substring(0, d) + b + c.substring(d), d += b.length, _(a, d), a.blur(), a.focus(), $.event.trigger({
                type: "keypress"
            });
            break;
        case "DIV":
            var e, f, g;
            window.getSelection ? (e = window.getSelection(), e.getRangeAt && e.rangeCount && (f = e.getRangeAt(0), f.deleteContents(), g = document.createTextNode(b), f.insertNode(g), f.collapse(!0), f.setStart(g, b.length), f.setEnd(g, b.length), e.removeAllRanges(), e.addRange(f))) : document.selection && document.selection.createRange
    }
}

var E, F = "input[type=text], input[type=url], input[type=search], textarea, div[contenteditable=true], .editable";

$(F).contextmenu(function(a) {
    E = a.target
});

chrome.runtime.onMessage.addListener(function(a, b) {
  switch (a.action) {
    case "on_results":
      A(a.txtToAdd);
      break;
    case "on_interim_results":
      z(a.txtToAdd);
  }
});

var G = document.createElement("DIV");
G.setAttribute("id", "voicebox_container");

var mirrorX = document.createElement("div");
mirrorX.setAttribute("id", "voicebox");
G.appendChild(mirrorX);

document.getElementsByTagName("body")[0].appendChild(G);

