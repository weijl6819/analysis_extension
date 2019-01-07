


Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function bindEvent(element, type, handler) {
   if(element.addEventListener) {
      element.addEventListener(type, handler, false);
   } else {
      element.attachEvent('on'+type, handler);
   }
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

    if (request.purpose == 'closeAdvance') {
		document.getElementById('asustor_advanced_download_panel').remove(); 
    }	
});

document.body.innerHTML += '<iframe id="asustor_advanced_download_panel" src="'+chrome.extension.getURL("Advance.html")+'" style="position: fixed!important; width: 100%!important; height: 100%!important; top: 0!important; left: 0!important; z-index: 9999!important;"></iframe>';



