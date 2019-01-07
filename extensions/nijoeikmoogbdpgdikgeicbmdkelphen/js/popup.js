
chrome.tabs.query( { active: true, currentWindow: true	}, function( tabs ){

			if( tabs.length == 0 )	{
				chrome.tabs.create( {	active: true, url: chrome.extension.getURL( "app.html" ) });				
			}
			else  {
				var winId = tabs[0].windowId;
				var tabId = tabs[0].id;

				chrome.tabs.query( { windowId: winId, url: chrome.extension.getURL( "app.html" ) }, function( tabs ){

				        if( tabs.length > 0 ){
				        	chrome.tabs.update( tabs[0].id, { active: true } );
				        }
						else {
							chrome.tabs.create( {	active: true, url: chrome.extension.getURL( "app.html" ) });
						}	


				});	
			}
});
