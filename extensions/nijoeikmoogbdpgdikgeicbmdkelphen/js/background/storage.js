if (window == chrome.extension.getBackgroundPage()) {

	(function(){

		var Storage = function(){

			//const INTERVAL_CHECK_SERVER = 180000;
			const INTERVAL_CHECK_SERVER = 30000;

			//const INTERVAL_FIRST_FEED = 7 * 24 * 3600000;   // начинаем неделю назад
			const INTERVAL_FIRST_FEED = 3 * 24 * 3600000;   // начинаем неделю назад
			const ICON_BLANK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABBCAYAAAAngwHRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU1QzEzMjI2RkU2OTExRTY5NzBBRjhFNzIxREExMkE3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU1QzEzMjI3RkU2OTExRTY5NzBBRjhFNzIxREExMkE3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTVDMTMyMjRGRTY5MTFFNjk3MEFGOEU3MjFEQTEyQTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTVDMTMyMjVGRTY5MTFFNjk3MEFGOEU3MjFEQTEyQTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7JJNGxAAAMjUlEQVR42uxcS48cVxU+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';

			var self = this;

			var lastFeedDon = 0;
			var main_category = [];
			var data_category = [];
			var ticker = null;
			var market_cap, market_dom;
			var error_category = false;

			var isFirstStart = true;

			// ===============================================================
			this.init = function( st ){

				chrome.browserAction.setIcon({ path: chrome.extension.getURL('images/coin.feed.main_off_32.png') });
				chrome.browserAction.setPopup({ popup: '' });

				coinFeed.WebSQL.init( st, function(){

					if (st == 1) {
						start_install();
					}
					else {
						start_run();
					}
					
				});

				// --------------------------------------------------------------------------------
				chrome.extension.onRequest.addListener( function(request, sender, sendResponse) {

						console.log(request);
						if (request.command === 'getFeed') {
							self.get_feeds( request.params, sendResponse );
							coinFeed.Gamp.pageview();
						}
						else if (request.command === 'setShowCategory') {
							main_category = request.list;
							coinFeed.Prefs.set( "show_category", main_category.join(',')  )
						}
						else if (request.command === 'showAddCategory') {
							show_add_category( request.category_id, sendResponse );
						}
						else if (request.command === 'hideRemoveCategory') {
							hide_remove_category( request.category_id );
						}
						else if (request.command === 'setMarkFeed') {
							mark_feed( request.id, request.value );
						}
						else if (request.command === 'setHideFeed') {
							hide_feed( request.id );
						}
						else if (request.command === 'setMarkListFeeds') {
							if (request.list) mark_list_feeds( request.list );
							else if (request.category_id) mark_category_feeds( request.category_id );
						}
						else if (request.command === 'setMarkAllFeeds') {
							mark_all_feeds();
						}
						else if (request.command === 'setHideListFeeds') {
							if (request.list) hide_list_feeds( request.list, sendResponse );
							else if (request.category_id) hide_category_feeds( request.category_id, sendResponse );
						}
						else if (request.command === 'setOptions') {
							coinFeed.Prefs.set(request.name, request.value);
						}
						else if (request.command === 'getMarkFeeds') {
							coinFeed.WebSQL.sendQueue({action:'counts', category: main_category, callback: self.show_count_no_mark });
							//coinFeed.WebSQL.count_no_mark(main_category, self.show_count_no_mark);
						}
						else if (request.command === 'setStateUnMark') {
							coinFeed.Prefs.set( "show_posts_unmark", request.value );
							sendResponse();
						}
						else if (request.command === 'set_error_category') {
							error_category = true;
						}
				});

			}

			// ---------------------------------------------------------------
			function start_run() {

				// последняя новость
				lastFeedDon = coinFeed.Prefs.get( "last_feed_editedon" );
				if ( lastFeedDon == 0 ) lastFeedDon = parseInt((new Date().getTime() - INTERVAL_FIRST_FEED)/1000);

				// просматриваемые категории
				var x = coinFeed.Prefs.get( "show_category" );
				main_category = [];
				x.split(',').forEach( function(i){
					if (i) {
						if (main_category.indexOf(i) == -1) main_category.push(i);
					}
				});

				// все категории сервера
				try {
					x = coinFeed.Prefs.get( "list_category" );
					if (typeof x == 'undefined' || !x || x == 'undefined') {
						data_category = [];
						coinFeed.Prefs.set( "list_category", JSON.stringify(data_category) );
					}
					else {
						data_category = JSON.parse(x);
					}
				}
				catch(ex) {
					data_category = [];
					coinFeed.Prefs.set( "list_category", JSON.stringify(data_category) );
					console.log(ex);
				}

				chrome.browserAction.setIcon({ path: chrome.extension.getURL('images/coin.feed.main_32.png') });
				chrome.browserAction.setPopup({ popup: 'popup.html' });

				// обращение к серверу
				check(true);

				// для отображения на иконке аддона
				coinFeed.WebSQL.sendQueue({action:'counts', category: main_category, callback: self.show_count_no_mark });

				// резервный по часовой запуск
				setInterval( function(){
						isRun = false;
						start_check(10*INTERVAL_CHECK_SERVER);
				},  60*INTERVAL_CHECK_SERVER);

			}

			// ---------------------------------------------------------------
			function zapolnit( feeds, type ) {

				if (!feeds || feeds.length==0)  return [];

				var ff = [];

				for (var i=0; i<feeds.length; i++) {

					if (type && feeds[i].is_delete) continue;

					ff.push({ 	id: 		 feeds[i].id,
								category_id: feeds[i].category_id,
								author: 	 feeds[i].author,
								title: 	  	 feeds[i].title,
								text:        feeds[i].text,
								visual:      feeds[i].visual,
								show:        feeds[i].show,
								mark:        0,
								createdon:   feeds[i].createdon,
								editedon:    feeds[i].editedon,
								vers:        feeds[i].vers,
								feed_url:    feeds[i].feed_url,
								feed_type:   feeds[i].feed_type,
								is_delete:   feeds[i].is_delete
						    });

				}

				return ff;
			}	

			// ---------------------------------------------------------------
			function start_install() {

				coinFeed.Request.start_addon( function( info ){

					console.log('start_addon', info);
					
					if (info && info.category) {

						data_category = info.category;
						for (var i=0; i<data_category.length; i++) if (!data_category[i].icon) data_category[i].icon = ICON_BLANK;
						//coinFeed.Prefs.set( "list_category", JSON.stringify(data_category) );	

						main_category = info.show;
						coinFeed.Prefs.set( "show_category", main_category.join(',')  );

						chrome.browserAction.setIcon({ path: chrome.extension.getURL('images/coin.feed.main_32.png') });
						chrome.browserAction.setPopup({ popup: 'popup.html' });

						// данные по новостям
						var feeds = zapolnit( info.feeds, true );

						lastFeedDon = info.readdon;
						coinFeed.Prefs.set( "last_feed_editedon", lastFeedDon );

						if (feeds.length>0) {
							coinFeed.WebSQL.sendQueue({action:'insert', feeds: feeds, callback: start_run});							
						}
						else {
							start_run();
						}

					}
					else {
						start_run();
					}	

				});


			}

			// ===============================================================
			this.get_feeds = function(params, callback ){

				console.log('get_feeds', isFirstStart, params);

				var info = { category: data_category, feeds: [],  show_category: main_category,  ticker: ticker, market_cap: market_cap, market_dom: market_dom }

				var v = coinFeed.WebSQL.enable_version_feed();

				var cats = [];
				for ( var k in params )  {
					if ( k == 'all' )  {
						for (var jj=0; jj<main_category.length; jj++)  cats.push({ category_id: main_category[jj], last_createdon: params[k]});
						break;
					}
					else {
						cats.push({ category_id: k, last_createdon: params[k]});
					}
				}

				var x1 = coinFeed.Prefs.get("search_category_id");
				var x2 = coinFeed.Prefs.get("hide_list_category_id");
				var x3 = coinFeed.Prefs.get("temp_category_id");

				info.options = {  searchCategoryId: (x1 ? parseInt(x1) : null),
								  tempCategoryId: (x3 ? parseInt(x3) : null),
								  hideListCategoryId: (x2 ? JSON.parse(x2) : null),
								  showPostFirst:       _b(coinFeed.Prefs.get("show_posts_first")), 
								  show_posts_unmark:   _b(coinFeed.Prefs.get("show_posts_unmark")), 
								  dont_ask_mark_all:   _b(coinFeed.Prefs.get("dont_ask_mark_all")), 
								  dont_ask_remove_all: _b(coinFeed.Prefs.get("dont_ask_remove_all")),
								  show_prices_updates: _b(coinFeed.Prefs.get( "show_prices_updates" )),
								  show_mini_graphs:    _b(coinFeed.Prefs.get( "show_mini_graphs" )),
							   }

				if (isFirstStart) {
					info.isFirstStart = true;
					callback( info );
					return;
				}

				coinFeed.WebSQL.sendQueue({	action:   'read', 
											category: cats, 
											callback: function( feeds ){							
														info.feeds = feeds;
														if (callback) callback( info );
													}	
				});

			}

			// ===============================================================
			var isRun = false;
			var timerCheck = null;
			function start_check( t ) {
				timerCheck = setTimeout( function(){
					if (!isRun)  check( false );
				}, typeof t != 'undefined' && t ? t : INTERVAL_CHECK_SERVER)
			}
			function stop_check( ) {
				clearTimeout(timerCheck);
				timerCheck = null;
			}
			// ----------------------------------------------
			function check( flag ) {

				flag = !!flag;
				console.log('-check---', flag, lastFeedDon, new Date(lastFeedDon*1000).toString())
				isRun = true;
				isNet = true;

				var feeds = [];

				coinFeed.Utils.Async.chain([
					function(next) {			// первый запуск - нужны данные по всем категориям

						if (flag || !data_category || !data_category.length || error_category) {
							coinFeed.Request.categories(function( info ){
								console.log(info);
								if ( info ) { 
									data_category = info.category;
									chrome.extension.sendRequest({action:"changeCategory", category: data_category  });
									coinFeed.Prefs.set( "list_category", JSON.stringify(data_category) );
									error_category = false;	
								}	
								next();
							});	
						}
						else {
							next();	
						}

					},	
					function(next) {			// запрос на сервер

						coinFeed.Request.load(lastFeedDon, main_category, function( info ){

							console.log(info);
							if ( info ) { 
								isNet = true;

								lastFeedDon = info.readdon;
								coinFeed.Prefs.set( "last_feed_editedon", lastFeedDon );
								
								feeds = zapolnit( info.feeds, false );


/*								// данные по новостям
								if (info.feeds && info.feeds.length>0) {
									for (var i=0; i<info.feeds.length; i++) {

										feeds.push({ id: 		  info.feeds[i].id,
													 category_id: info.feeds[i].category_id,
													 author: 	  info.feeds[i].author,
													 title: 	  info.feeds[i].title,
													 text:        info.feeds[i].text,
													 visual:      info.feeds[i].visual,
													 show:        info.feeds[i].show,
													 mark:        0,
													 createdon:   info.feeds[i].createdon,
													 editedon:    info.feeds[i].editedon,
													 vers:        info.feeds[i].vers,
													 feed_url:    info.feeds[i].feed_url,
													 feed_type:   info.feeds[i].feed_type,
													 is_delete:   info.feeds[i].is_delete
												  });

									}

								}*/

								// данные по категориям
								merge_category( info.category, next);
							}	
							else {
								isNet = false;
								next();	
							}
							
						});

					},
					function(next) {			// запросим данные по ticker

						var x1 = coinFeed.Prefs.get( "show_prices_updates" );
						var x2 = coinFeed.Prefs.get( "show_mini_graphs" );

						if ( !x1 && !x2 )  {
							ticker = null;
							next();
							return;
						}

						var listTicker = [];
						for (var i=0; i<data_category.length; i++) {
							if (main_category.indexOf(data_category[i].id.toString()) != -1 && data_category[i].ticker) {
								var m = data_category[i].ticker.split(';');

								listTicker.push({ticker: m[0], category_id: data_category[i].id  });
							}
						}	

						if (listTicker.length>0) {						
							coinFeed.Ticker.get(listTicker, function(tt, cap, dom){
								ticker = tt;
								market_cap = cap; 
								market_dom = dom;
								next();
							});
						}
						else {
							next();
						}
					},
					function(next) {			// отобразим данные по ticker
						if (ticker) {
							chrome.extension.sendRequest({action:"showTicker", ticker: ticker, market_cap: market_cap, market_dom: market_dom  });
							next();
						}
						else {
							next();
						}
					},
					function(next) {			// анализируем новости и добавляем в базу аддона

						if (feeds.length>0) {
							coinFeed.WebSQL.sendQueue({action:'insert', feeds: feeds, callback: next});							
						}
						else {
							next();
						}

					},
					function(next) {			// подправим отображение на экране
						if (flag) {						// первое обращенние - ни чего не делаем

							isFirstStart = false;

							//chrome.browserAction.setIcon({ path: chrome.extension.getURL('images/coin.feed.main_32.png') });
							//chrome.browserAction.setPopup({ popup: 'popup.html' });

							chrome.extension.sendRequest({action:"addonStartSuccess"  });							

							next();
						}
						else if (feeds.length>0) {			// это новые новости - их отобразим на экране
//						if (feeds.length>0) {			// это новые новости - их отобразим на экране
							/*var k = {}, f = [];
							for (var i=0; i<feeds.length; i++) {
								var cat_id = feeds[i].category_id;
								if ( !k[cat_id] )  k[cat_id] = 0;
								k[cat_id]++;
								if (k[cat_id]<40)  f.push( feeds[i] );
							}
							console.log(f);*/

							chrome.extension.sendRequest({action:"loadNewFeed", new_feeds: feeds  });
							next();
						}
						else {
							next();
						}
					},
					function(next) {			// считаем данные

						if (isNet)  coinFeed.Request.runQueue( );

						isRun = false;
						if (feeds.length>0) {
							start_check( INTERVAL_CHECK_SERVER );
						}
						else {
							start_check( 1 * INTERVAL_CHECK_SERVER );
						}

					}
				]);

			}
			// -----------------------------------------------------------
			function merge_category( newCategory, callback ) {

				if ( compare_category( newCategory ) ) {

					coinFeed.Request.categories(function( info ){
						if ( info ) { 
							data_category = info.category;
							chrome.extension.sendRequest({action:"changeCategory", category: data_category  });
							coinFeed.Prefs.set( "list_category", JSON.stringify(data_category) );	
						}	
						callback();
					});	
				}
				else {

					callback();

				}

			}	

			function compare_category( newCategory ) {

				if ( data_category.length != newCategory.length )  return true;

				for (var i=0; i<data_category.length; i++) {

					var a = poisk(data_category[i].id, newCategory);
					if ( !a ) return true;

					if ( a.name !== data_category[i].name )  return true;
					if ( a.editedon !== data_category[i].editedon )  return true;
					if ( a.description !== data_category[i].description )  return true;
					if ( a.ticker !== data_category[i].ticker )  return true;
				}

				for (var i=0; i<newCategory.length; i++) {

					var a = poisk(newCategory[i].id, data_category);
					if ( !a ) return true;

					if ( a.name !== newCategory[i].name )  return true;
					if ( a.editedon !== newCategory[i].editedon )  return true;
					if ( a.description !== newCategory[i].description )  return true;
					if ( a.ticker !== newCategory[i].ticker )  return true;
				}

				return false;

				// -------------
				function poisk(id, array) {

					for (var jj=0; jj<array.length; jj++) {
						if ( array[jj].id == id )  return array[jj];
					}

					return null;
				}

			}	

			// ===============================================================
			function show_add_category( id, callback ) {

				var category = null;
				var feeds = [];

				coinFeed.Utils.Async.chain([
					function(next) {			// считаем новую категорию и добавим ее в общий список

						//coinFeed.Request.load(parseInt((new Date().getTime() - INTERVAL_FIRST_FEED)/1000), [id], function( info ){
						coinFeed.Request.preload([id], function( info ){

							if (info) {

								category = info.category;
								//feeds = info.feeds;

								feeds = zapolnit( info.feeds, true );

								var f = [];
								for (var i=0; i<feeds.length && i<40; i++)  f.push (feeds[i] );

								callback({ category: category, feeds: f });

								next();
							}
							else {
								coinFeed.Request.sendQueue({action: 'preload', category_id: id, callback: run_queue_add_category});
								callback({ feeds: [] });
							}	

						});
					},
					function(next) {			// анализируем новости и добавляем в базу аддона

						if (feeds.length>0) {

							coinFeed.WebSQL.sendQueue({action:'insert', feeds: feeds, callback: next});

						}
						else {
							next();
						}

					},
					function(next) {
						
					}
				]);
			}

			function run_queue_add_category( info ) {

				category = info.category;

				var feeds = zapolnit( info.feeds, true );

				if (feeds.length>0) {

					chrome.extension.sendRequest({action:"loadNewFeed", new_feeds: feeds  });

					coinFeed.WebSQL.sendQueue({action:'insert', feeds: feeds });

				}


			}	

			// ===============================================================
			function hide_remove_category( id ) {

				coinFeed.WebSQL.sendQueue({action:'delete_category', category_id: id  });

			}

			// ===============================================================
			this.get_main_category = function(){
				return main_category;
			}
				
			this.show_count_no_mark = function(info){

				var x = 0;
				for (var k in info) {
					x += info[k];
				}

				if (x) {
					message_popup(x.toString());
				}
				else {
					message_popup('');
				}
				chrome.extension.sendRequest({action:"showCountFeeds", counts: info  });

			}

			// ===============================================================
			function mark_feed( id, value ) {

				coinFeed.WebSQL.sendQueue({action:'mark_feed', id: id, value: value  });

			}
			// ---------------------------------------------------------------
			function mark_all_feeds( category_id ) {

				coinFeed.WebSQL.sendQueue({action:'mark_all_feeds'  });

			}
			// ---------------------------------------------------------------
			function mark_category_feeds( category_id ) {

				coinFeed.WebSQL.sendQueue({action:'mark_category_feeds', category_id: category_id  });

			}
			// ---------------------------------------------------------------
			function mark_list_feeds( list ) {

				coinFeed.WebSQL.sendQueue({action:'mark_list_feeds', list: list  });


			}
			// ===============================================================
			function hide_feed( id ) {

				coinFeed.WebSQL.sendQueue({action:'delete_feed', id: id  });

			}
			// ---------------------------------------------------------------
			function hide_category_feeds( category_id, callback ) {

				coinFeed.WebSQL.sendQueue({action:'delete_category_feeds', category_id: category_id  });

			}
			// ---------------------------------------------------------------
			function hide_list_feeds( list, callback ) {

				coinFeed.WebSQL.sendQueue({action:'delete_list_feeds', list: list  });

			}
			// ===============================================================
			this.socket_feeds_remove = function( list ){

				if (!list || list.length==0) return;
				var ll = list.split(',');

				coinFeed.WebSQL.sendQueue({action:'delete_list_feeds', list: ll  });

				chrome.extension.sendRequest({action:"removeListFeeds", list: ll  });

			}	
			// ---------------------------------------------------------------
			this.socket_feeds_add = function( list ){

				var listId = [];
				for (var i=0; i<list.length; i++) {
					if( main_category.indexOf(list[i].category_id) != -1 ) listId.push( list[i].id );	
				}
				if (listId.length == 0) return;

				var feeds = [];

				coinFeed.Utils.Async.chain([
					function(next) {			// считаем новую категорию и добавим ее в общий список

						coinFeed.Request.read(listId, function( info ){

							for (var i=0; i<info.length; i++) {

								feeds.push({ id: 		  info[i].id,
											 category_id: info[i].category_id,
											 author: 	  info[i].author,
											 title: 	  info[i].title,
											 text:        info[i].text,
											 visual:      info[i].visual,
											 show:        info[i].show,
											 mark:        0,
											 createdon:   info[i].createdon,
											 editedon:    info[i].editedon,
											 vers:        info[i].vers,
											 feed_url:    info[i].feed_url,
											 feed_type:   info[i].feed_type
										  });
							}

							next();
						});
					},
					function(next) {			// анализируем новости и добавляем в базу аддона

						if (feeds.length>0) {

							coinFeed.WebSQL.sendQueue({action:'insert', feeds: feeds, callback: next});
						}

					},
					function(next) {

						chrome.extension.sendRequest({action:"loadNewFeed", new_feeds: feeds  });

					}
				]);

				
			}	
			// ---------------------------------------------------------------
			this.socket_category_edit = function( category_id ){

				
			}	
			// ===============================================================
		}

		this.Storage = new Storage();

	}).apply(coinFeed);

}
else
{
	coinFeed.Storage = chrome.extension.getBackgroundPage().coinFeed.Storage;
}
