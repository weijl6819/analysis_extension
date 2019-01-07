chrome.runtime.onMessage.addListener(function(message) {
	if (message.type === "csToggleFrame"){
		var ctfmWebCiterFrame = document.querySelector('.cmWebCiterFrame');
		
		if (ctfmWebCiterFrame) {
			// frame exists, remove it
			ctfmWebCiterFrame.remove();
		}
		else {
			// doesn't exist, add it
                        
			ctfmWebCiterFrame = document.createElement('iframe');
			ctfmWebCiterFrame.setAttribute('class', 'cmWebCiterFrame');
                        ctfmWebCiterFrame.setAttribute('id', 'ifrm');
			ctfmWebCiterFrame.setAttribute('src', 'chrome-extension://'+chrome.runtime.id+'/popup.htm');
			ctfmWebCiterFrame.style['box-sizing'] = 'content-box';
			ctfmWebCiterFrame.style.width = '425px';
			ctfmWebCiterFrame.style.height = '600px';
			ctfmWebCiterFrame.style.position = 'fixed';
			ctfmWebCiterFrame.style.top = '5px';
			ctfmWebCiterFrame.style.right = '5px';
			ctfmWebCiterFrame.style.border = 'none';
			ctfmWebCiterFrame.style.margin = '0';
			ctfmWebCiterFrame.style['z-index'] = '99999999';
			
			//document.querySelector('body').appendChild(ctfmWebCiterFrame);
		}
	}	
});

function sendHighlightedText() {
    /*if (window.getSelection) {
        var a = window.getSelection().toString();
        a.length > 0 && chrome.runtime.sendMessage({
            type: "bgHighlightedText",
            content: a
        })
		console.log('CM highlighted text sent: ' + a);
    }*/
}

//window.onmouseup = sendHighlightedText;

