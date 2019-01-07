/************************************************************************************
  This is your background code.
  For more information please visit our wiki site:
  http://docs.crossrider.com/#!/guide/scopes_background
*************************************************************************************/

appAPI.ready(function($) {

  // Place your code here (ideal for handling browser button, global timers, etc.)

		appAPI.browserAction.setResourceIcon('icons/icon.png');

    	appAPI.browserAction.onClick(function() { 

			appAPI.message.toActiveTab("do things");

    	});

});

