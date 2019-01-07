
window.addEventListener( "load", function(){
	
	try{
		coinFeed.Options.init();
	}
	catch( ex ){
		
	}
	
	coinFeed.Locale.localizeCurrentPage();

	// -------- события на Click
	document.getElementById("suggestion").addEventListener( "click", function( event ){
		chrome.runtime.sendMessage({akse: 'sendSuggestion' });
	}, false );

	document.getElementById("save_setting").addEventListener( "click", function( event ){
		coinFeed.Options.applyChanges( );
	}, false );

	document.getElementById("close_setting").addEventListener( "click", function( event ){
		window.close();
	}, false );
	
});