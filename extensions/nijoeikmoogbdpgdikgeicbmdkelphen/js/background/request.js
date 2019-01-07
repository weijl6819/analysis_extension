if (window == chrome.extension.getBackgroundPage()) {

	(function(){

		var Request = function(){

			var self = this;
			var lastCreateDon = 0;
			var urlApi = null;
			var urlStart = null;
			var urlPreload = null;
			var urlRead = null;
			var urlCategory = null;

			// ===============================================================
			this.init = function(  ){

				//console.log("Request - init ");

				if (coinFeed.gMode == 'test') {
					urlApi = 'http://localhost:8181/api/coin/';
					urlStart = 'http://localhost:8181/api/start/addon';
					urlRead = 'http://localhost:8181/api/feeds/';
					urlPreload = 'http://localhost:8181/api/add/';
					urlCategory = 'http://localhost:8181/api/categories/';
				}
				else {
					urlApi = 'https://rssreader.everhelper.me/api/coin/';
					urlStart = 'https://rssreader.everhelper.me/api/start/addon';
					urlRead = 'https://rssreader.everhelper.me/api/feeds/';
					urlPreload = 'https://rssreader.everhelper.me/api/add/';
					urlCategory = 'https://rssreader.everhelper.me/api/categories/';
				}

			}

			this.load = function( lastEditeDon, category, callback ){

				var list = category.length>0 ? category.join(',') : 'a';

				var url = urlApi + lastEditeDon.toString() + '/' + list;

        		coinFeed.Utils.getAJAX( url, null, function(content){

					if (content) {
						var info = JSON.parse(content);
						callback(info);
					}
					else {
						console.log(content);
						callback(null);
					}

				});
			}

			this.preload = function( categoryId, callback ){

				console.log('request.preload:', categoryId);

				var url = urlPreload + categoryId.toString();

        		coinFeed.Utils.getAJAX( url, null, function(content){

					if (content) {
						var info = JSON.parse(content);
						callback(info);
					}
					else {
						console.log(content);
						callback(null);
					}

				});
			}

			this.start_addon = function( callback ){

				var url = urlStart;

        		coinFeed.Utils.getAJAX( url, null, function(content){

					if (content) {
						var info = JSON.parse(content);
						callback(info);
					}
					else {
						console.log(content);
						callback(null);
					}

				});
			}

			this.read = function( listId, callback ){

				var url = urlRead + listId.join(',');

        		coinFeed.Utils.getAJAX( url, null, function(content){

					if (content) {
						var info = JSON.parse(content);
						callback(info);
					}
					else {
						console.log(content);
						callback(null);
					}

				});
			}

			this.categories = function( callback ){

				var url = urlCategory;

        		coinFeed.Utils.getAJAX( url, null, function(content){

					if (content) {
						var info = JSON.parse(content);
						callback(info);
					}
					else {
						console.log(content);
						callback(null);
					}

				});
			}

			// ===============================================================================
			// организация очереди для изменения в базе
			var requestQueue = [];
			var isRun = false;
			// -----------------------------------
			this.sendQueue = function( options ){

				//console.log('--sendQueue--', options.action);

				requestQueue.push(options);

		

			}	
			// -----------------------------------
			this.runQueue = function( ){

				//console.log('--runQueue--', requestQueue.length, isRun);

				if (!isRun) {
					if ( requestQueue.length>0 ) {

						isRun = true;
						var opt = requestQueue.shift();

						run_request( opt, function(info){

							isRun = false;
							if (info) {
								opt.callback(info);
								self.runQueue( );							
							}
							else {
								requestQueue.push(opt);
							}

						})
					}
				}
			}	
			// -----------------------------------
			function run_request( options, callback ){

				//console.log('--run_request--', options.action);

				if (options.action == 'preload') {

					self.preload([options.category_id], function( info ){

						callback(info);
				
					});
				}
				else {
					callback({});
				}

			}	


			// ===============================================================

		}

		this.Request = new Request();

	}).apply(coinFeed);

}
else
{
	coinFeed.Request = chrome.extension.getBackgroundPage().coinFeed.Request;
}
