
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
function myFunction(){
	var body = document.getElementById("richtext").innerHTML;
	chrome.storage.local.remove("post_body");
	chrome.storage.local.set(
		{
			"post_body":body
		},
		function(){
			console.log("stored successfully");
		});
};


var local = "localhost";
var amazon = "ec2-52-23-242-131.compute-1.amazonaws.com";
var clause = "www.theclause.tk";
var host = clause;



var doc = document.getElementById("formatting-bar");
var ul = document.createElement("UL");
var li = document.createElement("LI");
var btn = document.createElement("BUTTON");

btn.addEventListener("click", myFunction);

var btn_text = document.createTextNode("Publish to Medium");
ul.setAttribute("class","formatting-bar-group");
btn.setAttribute("class","button nav-button formatting-button");
btn.setAttribute("id","formatting-ptm");
btn.setAttribute("onclick",'window.open("http://'+ host + ':8080/clause/new")');
btn.appendChild(btn_text);
li.appendChild(btn);
ul.appendChild(li);
doc.appendChild(ul);
