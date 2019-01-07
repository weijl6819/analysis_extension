if (window == chrome.extension.getBackgroundPage()) {

	(function(){

		var Ticker = function(){

			var self = this;

			const API_TICKER_URL = "https://api.coinmarketcap.com/v1/ticker/?limit=5000";
			const API_GLOBAL_URL = "https://api.coinmarketcap.com/v1/global/";
			const PAGE_URL = [ "https://coinmarketcap.com/", "https://coinmarketcap.com/2", "https://coinmarketcap.com/3" ];

			const INTERVAL_UPDATE_IMAGE = 3600000;  // каждый час

			var current_ticker = {};
			var update_time = 0;
			var market_cap = 0;
			var market_dom = 0;

			// ===============================================================
			this.init = function( ){

			}

			// ------------------------------------------------
			this.get = function( list, callback ){

				if (update_time+INTERVAL_UPDATE_IMAGE < (new Date).getTime()) {
					current_ticker = {};
				}

        		coinFeed.Utils.getAJAX( API_TICKER_URL, null, function(content){

					if (content) {
						var info = JSON.parse(content);
						//console.log(info);						

						build(list, info, function(){

							self.get_global( function() {

								callback(current_ticker, market_cap, market_dom);

							})
							
						});
						
					}
					else {
						console.log(content);
						callback(null);
					}

				});
						
			}

			// ------------------------------------------------
			this.get_global = function( callback ){

        		coinFeed.Utils.getAJAX( API_GLOBAL_URL, null, function(content){

					if (content) {
						var info = JSON.parse(content);
						//console.log(info);						

						market_cap = info['total_market_cap_usd']; 
						market_dom = info['bitcoin_percentage_of_market_cap'];

						callback();
						
					}
					else {
						console.log(content);
						callback(null);
					}

        		});	

			}	

			// ------------------------------------------------
			function get_image(callback) {

				update_time = (new Date).getTime();

   				for (var k in current_ticker) {  
   					current_ticker[k].old_image = current_ticker[k].image;
   					current_ticker[k].image = null;
   				}	

				coinFeed.Utils.Async.arrayProcess(PAGE_URL, function(url, apNext) {

	        		coinFeed.Utils.getAJAX( url, null, function(content){

	        			if (content) {

	        				var f = check( content );

	        				if (f) {
	        					callback();
	        				}
	        				else {
	        					apNext();
	        				}

	        			}

					});
						
				}, function() {		

					callback();

				});


				// ----------------------
				function check( content ) {

					var fl = true;

    				for (var k in current_ticker) {

    					var id = 'id-'+k;

    					var pattern = '<tr\\sid="id-'+k+'"(.|\\n)*?<\\/tr>';
						var rx = new RegExp(pattern, 'im');
    					

	    				var matches = content.match(rx);   
	    				if (matches) {

	    					var block = matches[0];

	    					var pat = '<td>(.|\\n)*?<\\/td>';
							var reg = new RegExp(pat, 'im');

		    				var m = block.match(reg);   
		    				if (m) {

		    					var tt = m[0];
			    				var mm = tt.match(/src="(.+?)"/im);   

			    				if (mm) {
			    					current_ticker[k].image = mm[1]+'?'+Math.random();
			    				}
		    				}	
	    					
	    				} 					
    				}

    				for (var k in current_ticker) {
    					if ( !current_ticker[k].image ) return false;
    				}	

    				return true;
				}

				// ----------------------
				function dominance( content ) {


   					var pattern = '<ul(.|\\n)*?<\\/ul>';
					var rx = new RegExp(pattern, 'gm');
    				var matches = content.match(rx);   

	    			if (matches) {
						for (var i=0; i<matches.length; i++) {
							var m = matches[i].match(/<ul\sclass="(.+?)"/im);   	
							if (m) {
								if (m[1].indexOf('stat-counters') != -1) {
									var text = matches[i];
									var mm = text.match(/<li>(.+?)<\/li>/gm);   	
									for (var ii=0; ii<mm.length; ii++) {
									}	
								}
							}								
						}

	    			}	

				}	
				// ---------------------

			}	


			// ------------------------------------------------
			function build(list, info, callback) {

				// уберем не активные
				for (var k in current_ticker) {

					if ( poisk(k) == -1 ) {
						delete current_ticker[k];
					}


				}	

				// заполним новыми значениями
				var flag = false;
				for (var i=0; i<info.length; i++) {

					var kk = poisk(info[i].id);
					if ( kk != -1 ) {

						if ( !current_ticker[info[i].id] ) { 
							current_ticker[info[i].id] = {  id: info[i].id, 
															name: info[i].name, 
															symbol: info[i].symbol, 
															category_id: list[kk].category_id, 
															image: null
														 };
							flag = true;							 
						}								 

						current_ticker[info[i].id].volume = info[i]['24h_volume_usd'];
						current_ticker[info[i].id].percent_change_1h = info[i].percent_change_1h;
						current_ticker[info[i].id].percent_change_7d = info[i].percent_change_7d;
						current_ticker[info[i].id].percent_change_24h = info[i].percent_change_24h;
						current_ticker[info[i].id].price_btc = info[i].price_btc;
						current_ticker[info[i].id].price_usd = info[i].price_usd;
						current_ticker[info[i].id].rank = info[i].rank;
						current_ticker[info[i].id].available_supply = info[i].available_supply;
						current_ticker[info[i].id].max_supply   = info[i].max_supply;
						current_ticker[info[i].id].total_supply = info[i].total_supply;

						if (Math.abs(info[i].percent_change_1h) >5 ) flag = true;	

					}
				}

				// картинки
				if (flag) {
					get_image(callback);
				}
				else {
					callback();	
				}
				

				// ------------
				function poisk(name) {

					for (var ii=0; ii<list.length; ii++) {
						if (list[ii].ticker === name) return ii;
					}

					return -1;
				}

			}


		}

		this.Ticker = new Ticker();

	}).apply(coinFeed);

}
else
{
	coinFeed.Ticker = chrome.extension.getBackgroundPage().coinFeed.Ticker;
}
