
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
var crLogger=(function(){var a=parseInt((localStorage.getItem("crLoggerLevel")?localStorage.getItem("crLoggerLevel"):0),10);var c={Trace:5,Debug:4,Warn:3,Error:2,Fatal:1,name:{5:"TRACE",4:"DEBUG",3:"WARN",2:"ERROR",1:"FATAL"}};var b=function(d,j){if(d<=a){var h=new Date();var g=h.getDate()+"/"+h.getMonth()+"/"+h.getFullYear();var e=h.getHours()+":"+h.getMinutes();var k={};Error.captureStackTrace(k,b);var f=k.stack.split("\n")[2].split(" ")[5];if(/chrome-extension/.test(f)){f="Anonymous";}var i=g+"\t"+e+"\t"+c.name[d]+"\t"+f+"\t"+j;switch(d){case 1:case 2:console.error(i);break;case 3:console.warn(i);break;case 4:case 5:console.log(i);break;}}return;};return{setLevel:function(d){if(d>=0&&d<=5){localStorage.setItem("crLoggerLevel",d);a=d;return true;}return false;},fatal:function(d){b(c.Fatal,d);},error:function(d){b(c.Error,d);},warn:function(d){b(c.Warn,d);},debug:function(d){b(c.Debug,d);},trace:function(d){b(c.Trace,d);}};}());
