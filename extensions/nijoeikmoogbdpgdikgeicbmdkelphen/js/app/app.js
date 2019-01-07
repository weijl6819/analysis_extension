var host = null;

var dataFeeds = [];
var dataCategory = [];
var showCategory = [];
var showList = [];
var options = {};
var countFeeds = {};
var dataTicker = null;

var isLoad = false;
var isFirstStart = false;

window.onload=function () {

	console.log('---onload----')

	if (isLoad) return;
	isLoad = true;

	host = document.location.host;

	var clp = get_cookie("is-collapsed") || 'no';
	if (clp == 'yes') $('.js-app').addClass('collapsed');
	else $('.js-app').removeClass('collapsed');
	$('#collapse-navigator-header').bind('click', function(){
		$('.js-app').toggleClass('collapsed');
		set_cookie("is-collapsed", $('.js-app').hasClass('collapsed') ? 'yes' : 'no');
	});
	$('#collapse-navigator-footer').bind('click', function(){
		$('.js-app').toggleClass('collapsed');
		set_cookie("is-collapsed", $('.js-app').hasClass('collapsed') ? 'yes' : 'no');
	});
	$('#addon-settings').bind('click', function(){
		chrome.extension.sendMessage( { action: "SettingOptions" } );
	});
	$('#addon-suggestion').bind('click', function(e){
		chrome.extension.sendMessage({akse: 'sendSuggestion' });
	});
	$('#show-unmark').bind('click', function(){
		console.log('show-unmark', options.show_posts_unmark);
		chrome.extension.sendRequest( { command:"setStateUnMark", value: !options.show_posts_unmark }, function(){
			var last = new Date().getTime();
			getFeeds({'all': last});
		});	
	});
	$('#mark-all-feeds').bind('click', function(e){
		console.log('mark-all-feeds');
		e.preventDefault();
		Feed.mark_all_feeds( );
	});


	chrome.extension.onRequest.addListener(function(message, sender, sendResponse) {

		console.log(message);
		if (message.action === 'loadNewFeed') {					// если произошли изменения на сервере (после интервального обращения)
			Feed.set( message.new_feeds );
			Feed.appendFirstFeed = options.showPostFirst;
			message.new_feeds.sort( function( item1, item2 )  {	return (item1.createdon < item2.createdon ? -1 : 1);	} );
			Feed.paint({feeds: message.new_feeds});
		}
		else if (message.action === 'loadNewCategory') {
			dataCategory = message.category;
			Category.show( );
		}
		else if (message.action === 'reloadApp') {
			location.reload(); 
		}
		else if (message.action === 'showCountFeeds') {
			if (!dataCategory || dataCategory.length == 0) location.reload();
			countFeeds = message.counts;
			Category.show_columt_counts( message.counts );
		}
		else if (message.action === 'removeListFeeds') {
			Feed.remove_list_feeds(message.list);
		}
		else if (message.action === 'changeCategory') {
			dataCategory = message.category;
			Category.change_category(message.category);
		}
		else if (message.action === 'showTicker') {
			dataTicker = message.ticker;
			Ticker.show(dataTicker, message.market_cap, message.market_dom);
		}
		else if (message.action === 'addonStartSuccess') {
			if (isFirstStart) {
				var last = new Date().getTime();
				getFeeds({'all': last});
			}
		}
	});

	// ------------- load file system
	var last = new Date().getTime();
	getFeeds({'all': last});
};

function getFeeds(params, callback ) {

	show_loading( true );

	chrome.extension.sendRequest( { command:"getFeed", params: params }, function( info ){

		console.log( info );

		if (info.isFirstStart)  isFirstStart = true;

		dataFeeds = info.feeds;
		dataCategory = info.category;
		showList = info.show_category;
		options = info.options;
		countFeeds = info.counts;

		dataTicker = info.ticker;

		Category.load_show_category( );

		FormFeed.init();
		FormModal.init();
		Category.init();
		Feed.init();

		Category.show( );

		if (dataTicker) Ticker.show(dataTicker, info.market_cap, info.market_dom);

		Category.feed( );

		Category.show_columt_counts( countFeeds );

		show_loading( false );

		if (options.show_posts_unmark) {
			//$('.js-show-unmark-label').text('Show all posts');
			$('#show-unmark').addClass('active');
		}
		else {
			//$('.js-show-unmark-label').text('Show new posts');
			$('#show-unmark').removeClass('active');
		}

	});

}

function show_loading( fl ) {

	if (fl) {
		var tt = $( '<div class="js-content-loading content-show-loading">'+
			        '  <div class="l-cell content-show-loading-wrapped">'+
			        '    <img src="/images/app/loading.gif">'+
			        '  </div>'+
			 		'</div>');

		$('#container').append(tt);			
	}
	else {
		$('.js-content-loading').remove();
	}				
}


window.onbeforeunload=function () {

	console.log('onbeforeunload');

};


// -----------------------------------------------------------------------------
