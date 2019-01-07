var socket = null;

window.addEventListener( "load", function(){

	getLanguage();

	var st = 0;

	if( coinFeed.Utils.isVersionChanged() && !coinFeed.noWelcome )	{
		var url = null;

		if (coinFeed.Prefs.get("install_time") == 0)  {
			coinFeed.Gamp.install();
			//url = "http://fvd-downloader.everhelper.me/";
			//url = "http://www.fvddownloader.com/";
			st = 1;
		}
		else {
			//url = "http://www.fvddownloader.com/";
			st = 2;
		}

		if( url )	{
			chrome.tabs.create({
						url: url,
						active: true
					});
		}

	}

	if( coinFeed.Prefs.get( "install_time" ) == 0 )	{
		coinFeed.Prefs.set( "install_time", new Date().getTime() )
		//chrome.tabs.create({ url: 'http://nimbus.everhelper.me/welcome-to-clipper-chrome.php', active: true });
	}

	// устанавливаем страницу при удаление
	chrome.runtime.setUninstallURL("http://fvdmedia.com/daily-coin-feed/");

	// --------------------------------------------------------------------------------
	chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

			if (request.action === 'SettingOptions') {
				displaySettings(  );
			}
			else if (request.akse == 'ApplyOptions') {
				chrome.extension.sendRequest({ action:"reloadApp"  });
			}
			else if (request.action === 'openService') {
				openService(request);
			}
			else if (request.action == 'setValueOptions') {
				coinFeed.Prefs.set(request.name, request.value);
			}
			else if (request.akse == 'sendSuggestion') {
				sendSuggestion();
			}

	});

	coinFeed.Request.init();

	coinFeed.Storage.init( st );

	coinFeed.Gamp.run();

	//coinFeed.Socket.init();

}, false );

chrome.tabs.onActivated.addListener(function (info) {
    set_popup(info.tabId);
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
});
chrome.management.onUninstalled.addListener(function(){
	coinFeed.Gamp.uninstall();
});

function getLanguage() {

	coinFeed.language = coinFeed.Prefs.get( "language" );
	if ( coinFeed.language == 'auto' ) coinFeed.language = window.navigator.userLanguage || window.navigator.language;
	if ( ['en', 'ru'].indexOf(coinFeed.language) == -1)  coinFeed.language = 'en';

}

function capitalize(s) {
  return s.replace(/\S/, function(m) { return m.toUpperCase(); });
}

function openService(request) {

	chrome.tabs.query( 	{}, function( tabs ){
						if( tabs.length > 0 )  {
							if (request.tabId) {
								for (var i=0; i<tabs.length; i++) {
									if (request.tabId == tabs[i].id) {
										foundTabId = tabs[i].id;
										chrome.tabs.update( foundTabId, {
																		active: true
																		} );
										return;
									}
								}
							}
							else if (request.url) {
								for (var i=0; i<tabs.length; i++) {
									if (request.url == tabs[i].url) {
										foundTabId = tabs[i].id;
										chrome.tabs.update( foundTabId, {
																		active: true
																		} );
										return;
									}
								}
							}
						}

						chrome.tabs.create( {	active: request.active,
												url: request.url
											}, function( tab ){
												coinFeed.Storage.set( request.id, {tabId: tab.id } );
											}
										);
			} );
}

// ------------------------------------
var message_popup = function (badge_text) {

	chrome.browserAction.setBadgeText({text: badge_text});
	chrome.browserAction.setBadgeBackgroundColor({ color: "#555" });
		
};

// ------------------------------------
var set_popup = function (tabId, callback) {

	chrome.tabs.query( 	{  }, function( tabs ){

		if( tabs.length > 0 )	{
			for (var i=0; i<tabs.length; i++) {
				if (tabs[i].id == tabId ) {

					if (chrome.extension.getURL('app.html') == tabs[i].url) {
						chrome.browserAction.setPopup({ popup: '' });
					}
					else {
						chrome.browserAction.setPopup({ popup: 'popup.html' });
					}

				}	
			}
		}
	});

};

// ----------------------------------------------
navigateUrl = function( url, callback ){
	chrome.tabs.query( 	{
					url:  url
				}, function( tabs ){

							if( tabs.length > 0 )
							{
								foundTabId = tabs[0].id;
								chrome.tabs.update( foundTabId, {
																active: true
																} );
							}
							else
							{
								chrome.tabs.create( {	active: true,
														url: url
													}, function( tab ){
														if (callback) callback(tab);
													}
												);
							}
			} );
}
// ---------------------------------------- ОПЦИИ  --------------------------
displaySettings = function( )  {

	chrome.tabs.query( 	{
					url: chrome.extension.getURL( "/options.html" )
				}, function( tabs ){

							if( tabs.length > 0 ) {
								foundTabId = tabs[0].id;
								chrome.tabs.update( foundTabId, {
																active: true
																} );
							}
							else  {
								chrome.tabs.create( {	active: true,
														url: chrome.extension.getURL("/options.html")
													}, function( tab ){ }
												);
							}
			} );

}
// ---------------------------------------- sendSuggestion  --------------------------
sendSuggestion = function( )  {

	chrome.tabs.query( 	{
					url: chrome.extension.getURL( "/feedback.html" )
				}, function( tabs ){

							if( tabs.length > 0 ) {
								foundTabId = tabs[0].id;
								chrome.tabs.update( foundTabId, {
																active: true
																} );
							}
							else  {
								chrome.tabs.create( {	active: true,
														url: chrome.extension.getURL("/feedback.html")
													}, function( tab ){ }
												);
							}
			} );

}


// ------------------------------------
