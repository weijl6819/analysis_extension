
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
var WIDTH = 70;
var HEIGHT = 80;
var X_OFFSET = 10; // left
var Y_OFFSET = 10; // top
var DEBUG = true;

var images = null;
var entered = false;

var imgURL = chrome.extension.getURL("save_64.png");
var html_ = '<div id="imgDown" data-src=""><a class="down"><img imgdown src="'+imgURL+'" alt="Download image."></a></div>'

function d(vart) { console.log("_"+vart+"_");}
function debug(vart) {
	if(DEBUG) {
		console.log("imgDown: " + vart);
	}
}

function injectButton(elem) {
	$("body").append(html_);
	var offset = $(elem).offset();

	var button = $("#imgDown");
	// Set position of button
	button.css("top", offset.top + Y_OFFSET);
	button.css("left", offset.left + X_OFFSET);	

	//Set src data attribute
	button.attr("data-src", elem.src);
}

function injectStylesheet() {
	var place = "head";

	// Check for existing <head> node
	if (!$("head").length){
	  debug("No head found, injected stylesheet into <body>.");
	  place = "body";
	}

	// Inject stylesheet
	var path = chrome.extension.getURL('page.css');
	$(place).append($('<link>')
	    .attr("rel","stylesheet")
	    .attr("type","text/css")
	    .attr("href", path));
	debug("Injected stylesheet");
}

function getName(src) {
	var parts = src.split("/");
	var name = parts[parts.length-1];
	return name;
}

function sendMessage(elem) {
	//Prepare data
	var src = $(elem).data('src');
	var data = {
		"mode": "download",
		"name": getName(src),
		"url": src
	}
	debug("Send message with: "+JSON.stringify(data));
	chrome.runtime.sendMessage(null, data);
}

function docChanged(data){
	var added = data[0]["added"];
	
	if(added.length == 1){
		debug("Check for Download Icon.");
		if(typeof added[0]["attributes"]["imgdown"] != 'undefined'){
			added = null;
		}
	}

	if(added != null){
		filterImages();
		//debug("Filter started.");
		//console.log(images);

		images.off();
		// Event Listener for Picuture Hover
			images.on("mouseover", function(event) {
				if(entered){
					$("#imgDown").remove();
					entered = false;
				}
				entered = true;
				injectButton(this);
			}).on("mouseleave", function(event) {

			});
	}
}

function filterImages(){
	var profileFilter = new Date();
	var allImages = $('img', "body");

	images = allImages.filter(function(){
		var elem = $(this);
	  return (elem.width() > 70) || (elem.height() > 70)
	});

	// Some debug output
	var time = new Date - profileFilter;
	debug("Found: "+allImages.length+" - Filtered: "+images.length+" - TIME: "+time+"ms");
}

$(document).ready(function(){
	chrome.storage.sync.get(null, function(data){
		if(data.active){
			debug("Extension activated.");
			
			// Test observer
			var observer = new MutationSummary({
  				callback: docChanged,
  				queries: [{ element: "img" }]
			});

			injectStylesheet();
			filterImages();

			
			
			// Event Listener for Picuture Hover
			images.on("mouseover", function(event) {
				if(entered){
					$("#imgDown").remove();
					entered = false;
				}
				entered = true;
				injectButton(this);
			}).on("mouseleave", function(event) {

			});

			// Event Listener for Button Click
			$(document.body).on("click", "#imgDown" ,function(e){
				
				debug("Button clicked.");
				sendMessage(this);
				$(this).fadeOut("fast", function(){
					entered = false;
					$(this).remove();
				});
			});


			
		}
		else{
			debug("Extension inactive.");
		}
	});
});
