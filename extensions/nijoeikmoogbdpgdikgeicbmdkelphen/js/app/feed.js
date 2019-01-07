// ======================================================================================
//
//				Feed
//
// ======================================================================================

var Feed = new function(){

	var self = this;
	var container = null;

	var lastFeed = {};

	this.appendFirstFeed = false;

	// -----------------------------------------------------------------------------
	this.init = function( param, callback ){

		container = $('#container');

	}

	// -----------------------------------------------------------------------------
	this.get_id = function( id ){

		for (var i=0; i<dataFeeds.length; i++) {
			if (dataFeeds[i].id == id) return dataFeeds[i];
		}
		return null;
	}

	// -----------------------------------------------------------------------------
	this.set = function( tw ){

		for (var ii=0; ii<tw.length; ii++) {
			var f =  true;
			for (var i=0; i<dataFeeds.length; i++) {
				if (dataFeeds[i].id == tw[ii].id) {
					tw[ii].mark = dataFeeds[i].mark;
					dataFeeds[i] = tw[ii];
					f =  false;
					break;
				}
			}
			if (f) dataFeeds.push(tw[ii]);
		}
		return;
	}
	this.markset = function( category_id ){

		for (var i=0; i<dataFeeds.length; i++) {
			if (dataFeeds[i].category_id == category_id) 	dataFeeds[i].mark = 1;
		}

	}

	this.markset_all = function( ){

		for (var i=0; i<dataFeeds.length; i++) dataFeeds[i].mark = 1;

	}

	// -----------------------------------------------------------------------------
	this.unset = function( id ){

		for (var i=0; i<dataFeeds.length; i++) {
			if (dataFeeds[i].id == id) {
				dataFeeds.splice(i,1);
				break;
			}
		}
		return;
	}
	this.unset_category = function( category_id ){

		var ll = [];
		for (var i=0; i<dataFeeds.length; i++) {
			if (dataFeeds[i].category_id != category_id) {
				ll.push( dataFeeds[i] );
			}
		}
		dataFeeds = ll;
		return;
	}

	// -----------------------------------------------------------------------------
	this.convert = function( title, visual, text, fl, type ) {

		if (!text && !title) return '';

		var ff = true;
		if (typeof type == 'undefined') ff = false;
		else if ( !type || type == '' || type == 'twitter' ) ff = false;

		var tt = '';
		if (title) tt += '<div class="feedly-content-title">'+title+'</div>';

		if (visual) {
			var fl = is_image(text, visual, true);
			if (!fl)  tt += '<img class="feedly-content-visual" src="'+visual+'"><br />';
		}

		tt += text;
		return tt;

	}

	// =================================================================
	function is_image( text, src, flag ) {

	  	var h = parseSRC(src);

	    var matches = text.match(/<img\s[^>]+>/gm);

	    if (matches) {
		    for (var i=0; i<matches.length; i++) {
		    	var str = matches[i];

				var m = str.match(/src="(.+?)"/);
				if (m) {

				  	var hh = parseSRC(m[1]);

					if (flag && h==hh) return true;

					var cc = m[1].replace(/^https:/,'').replace(/^http:/,'');
					var ss = src.replace(/^https:/,'').replace(/^http:/,'');

					if (cc == ss) return true;

				}
		    }
		}

	    return false;

	}
	function parseSRC( src )  {

		if ( !src )  return '';

	  	var h = parse_URL(src);

 		return h ? h.hostname + h.path : src;

	}


	// -----------------------------------------------------------------------------
	this.to_domain = function( text ) {

		if (!text) return '';

		if ( text.indexOf('feed/') == 0 ) {
			text = text.substring(5, text.length);

			var ff = parse_URL(text);

			return '<a href="'+ff.protocol+'//'+ff.hostname+'" target="_blank"><span>'+ff.hostname+'</span></a>'
		}
		else if ( /https?:\/\/(.+?)/i.test(text)) {
			var ff = parse_URL(text);
			return '<a href="'+ff.protocol+'//'+ff.hostname+'" target="_blank"><span>'+ff.hostname+'</span></a>'
		}
		else {
			return '';
		}

		return text;
	}

	// -----------------------------------------------------------------------------
	this.get_domain = function( text ) {

		if (!text) return '';

		var ff = parse_URL(text);
		if (ff) {
			if (ff.hostname == 'twitter.com') return '';
			var domain = ff.hostname.replace("www.","");
			return '<a href="'+ff.protocol+'//'+ff.hostname+'" target="_blank"><span>'+domain+'</span></a>'
		}

		return '';
	}

	// -----------------------------------------------------------------------------
	this.get_last_feed = function( categoryId ){

		return lastFeed[categoryId];
	}

	// -----------------------------------------------------------------------------
	function get_container(category_id) {
		return $('.js-feed-container[data-column="'+category_id+'"]', container);
	}

	// -----------------------------------------------------------------------------
	this.paint = function( params ){

		if ( typeof params == 'undefined' ) params = {};

		if ( params.category ) {
			clear_feed(params.category);
			for (var i=0; i<dataFeeds.length; i++) {
				if ( dataFeeds[i].category_id == params.category ) {
					show_feed_item( dataFeeds[i] );
				}
			}
		}
		else if ( params.feed ) {
			show_feed_item( params.feed );
		}
		else if ( params.feeds ) {
			for (var i=0; i<params.feeds.length; i++) {
				show_feed_item( params.feeds[i] );
			}
		}
		else {		// all
			for (var i=0; i<showCategory.length; i++) {
				clear_feed(showCategory[i].id);
			}

			if (dataFeeds && dataFeeds.length>0) {
				for (var j=0; j<dataFeeds.length; j++) {
					show_feed_item( dataFeeds[j] );
				}
			}
			else {
				if (showCategory.length>0) {
					var tt = $( '<div class="js-content-all-empty content-all-empty">'+
						        '  <div class="l-cell content-all-empty-wrapped">'+
						        '    <p class="txt-size--16">No new posts yet</p>'+
						        '    <a class="js-click-all-empty"><p class="txt-size--16">Turn off "Show new posts only"</p></a>'+
						        '  </div>'+
						 		'</div>');
				}	
				else {			
					var tt = $( '<div class="js-content-all-empty content-all-empty">'+
						        '  <div class="l-cell content-all-empty-wrapped">'+
						        '    <p class="txt-size--16">First, you need to add new categories</p>'+
						        '  </div>'+
						 		'</div>');
				}	
				$('#container').append(tt);
				$('.js-click-all-empty', tt).off('click').on("click", function (e) {
					$( "#show-unmark" ).trigger( "click" );
				});
			}
		}

	}

	function show_feed_item( tw ) {

		//if (tw.id != 533) return;
		//if (tw.category_id == 11) console.log(tw);

		if (options.show_posts_unmark && tw.mark == 1 ) return;

		var categoryId = tw.category_id;
		if ( !lastFeed[categoryId] )  lastFeed[categoryId] = tw.createdon;
		if ( tw.createdon < lastFeed[categoryId] )  lastFeed[categoryId] = tw.createdon;

		var bl = get_container(tw.category_id);

		var ee = $('article.js-stream-item[data-id="'+tw.id+'"]');

		if ( ee.length > 0) {
			var col = ee.closest('section');
			var cat_id = parseInt(col.attr('data-column'));
			if ( !!tw.is_delete ) {
				ee.remove();
				return;
			}
			else if (categoryId != cat_id ) {	
				ee.remove();
				ee.length = 0;
			}	
		}

		if ( ee.length == 0) {
			if ( tw.show == 0 ) return;
			if ( !!tw.is_delete )  return;
			// добавляем
			ee = show_item_article( tw );

			var el = $('.js-stream-item', bl);
			if (el.length>0) {
				var ff = true;
				if ( self.appendFirstFeed && tw.mark == 0 ) {
					ee.insertBefore($(el[0]));
					ff = false;
				}
				else {
					for ( var jj=0; jj<el.length; jj++ ) {
						var crt = parseInt($(el[jj]).attr('data-create'));
						if (tw.createdon > crt) {
							ee.insertBefore($(el[jj]));
							ff = false;
							break;
						}
					}
				}	
				if (ff) {
					bl.append(ee);
				}
			}
			else {
				bl.append(ee);
			}
		}
		else {
			if ( tw.show == 0 ) {		// не опубликовано
				ee.remove();			//  удаляем
				return;
			}
			$('.js-timestamp', ee).html(get_time(tw.createdon));
			$(ee).attr('data-show', tw.show);
		}
		$('.js-feed-author', ee).html( build_html_author(tw.author) );

		$('.js-feed-text', ee).html( self.convert(tw.title, tw.visual, tw.text, false, tw.feed_type) );

		if (tw.feed_url) {
			var xx = $('.feedly-content-title', ee);
			if (xx.length)	{
				$('.feedly-content-title', ee).off('click').on("click", function (e) {
					var win = window.open(tw.feed_url, '_blank');
  					win.focus();
  					if (tw.mark=="0") mark_feed( tw.id );
				}).css('cursor', 'pointer');
			}
			else {
				$('.js-feed-body', ee).off('click').on("click", function (e) {
					var target = e.target;
					while (target != this) {
						if (target.nodeName == 'A') {
  							return;
						}
						target = target.parentNode;
						}
					var win = window.open(tw.feed_url, '_blank');
  					win.focus();
  					if (tw.mark=="0") mark_feed( tw.id );
				}).css('cursor', 'pointer');
			}
		}

		message_list_empty(tw.category_id);
		return;
	}

	function show_item_article( item ) {

		var tt = $('<article class="stream-item js-stream-item" data-mark="'+item.mark+'" data-id="'+item.id+'" data-create="'+item.createdon+'">'+
				   '  <div class="js-stream-item-header item-box-header">'+
				   '    <div class="feed-main-action">'+
				   '      <ul class="js-feed-main-actions feed-actions full-width ">'+
				   '        <li class="feed-action-item pull-right margin-r--20 ">'+
				   '          <a class="js-main-action-remove feed-action " href="#" rel="refeed"  title="Archive this post">'+
				   '            <i class="icon icon-close txt-center"></i>'+
				   '            <span class="is-vishidden">Remove</span>'+
				   '          </a>'+
				   '        </li>'+
				   '        <li class="feed-action-item pull-right margin-r--13">'+
				   '          <a class="js-main-action-mark feed-action feed-action-mark" href="#" rel="reply" title="Mark this post">'+
				   '            <i class="icon icon-check txt-center"></i>'+
				   '            <span class="is-vishidden">Mark</span>'+
				   '            <span class="reply-triangle"></span>'+
				   '          </a>'+
				   '        </li>'+
				   '      </ul>'+
				   '    </div>'+
				   '  </div>'+
				   '  <div class="js-stream-item-content item-box">'+
				   '    <div class="js-feed feed">'+
				   '      <header class="feed-header js-feed-header flex flex-row flex-align--baseline">'+
				   '        <div class="js-feed-author feed-header-author account-link block flex-auto">'+
				   '        </div>'+
				   '        <time class="feed-timestamp js-timestamp txt-mute flex-shrink--0">'+
				   '          '+get_time(item.createdon)+
				   '        </time>'+
				   '        <div class="js-feed-stream-url feed-header-url account-link block flex-auto">'+
				   '        </div>'+
				   '      </header>'+
				   '      <div class="feed-body js-feed-body">'+
				   '        <div class="nbfc txt-size-variable--12 txt-ellipsis">  </div>'+
				   '        <p class="js-feed-text feed-text with-linebreaks"></p>'+
				   '      </div>'+
				   '    </div>'+
				   '  </div>'+
				   '</article>');


		$('.js-feed-author', tt).html( build_html_author(item.author) );
		$('.js-feed-text', tt).html( self.convert(item.title, item.visual, item.text, false, item.feed_type) );
		if (item.feed_type != 'twitter') $('.js-feed-stream-url', tt).html( self.get_domain(item.feed_url) );

		if ( item.mark == "1") {
			$('.js-main-action-mark', tt).attr('title','Unmark this post');
		}
		$('.js-main-action-mark', tt).off('click').on("click", function (e) {
			mark_feed( item.id )
		});
		
		$('.js-main-action-remove', tt).off('click').on("click", function (e) {
			remove_feed( item.id )
		});

		return tt;
	}

	// -----------------------------------------------------------------------------
	function build_html_author(author) {

		if ( author.indexOf('<') == 0 ) {
			return author;
		}
		else {
			return '<div class="feed-twitter-profile-name"><span class="account-inline txt-ellipsis"><b class="fullname link-complex-target">'+author+'</b></span></div>';
		}
	}
	// -----------------------------------------------------------------------------
	function message_list_empty(category_id) {

		var bl = get_container(category_id);
		var el = $('.js-stream-item', bl);			// все записи

		if (el.length==0) {
			bl.find('.js-feed-list-empty').show();
		}
		else {
			bl.find('.js-feed-list-empty').hide();
			if (options.show_posts_unmark) {
				$('section.js-column[data-column="'+category_id+'"]').show();
			}		
			$('.js-content-all-empty').remove();
		}



	}

	// =============================================================================
	function clear_feed(category_id) {
		get_container(category_id).find('.js-stream-item').remove();
	}

	// -----------------------------------------------------------------------------
	function mark_feed( id ) {
		var el = $('article.js-stream-item[data-id="'+id+'"]');

		var ff = self.get_id(id);
		
		ff.mark = ff.mark == 0 ? 1 : 0;
		self.set([ff]);

		el.attr("data-mark", ff.mark);

		$('.js-main-action-mark', el).attr('title',ff.mark == 1 ? 'Unmark this post' : 'Mark this post');

		chrome.extension.sendRequest( { command:"setMarkFeed", id: id, value: ff.mark });
	}

	function remove_feed( id ) {

		var el = $('article.js-stream-item[data-id="'+id+'"]');
		el.remove();			//  удаляем

		var ff = self.get_id(id);
		message_list_empty(ff.category_id)

		self.unset( id );

		chrome.extension.sendRequest( { command:"setHideFeed", id: id });
	}

	this.remove_list_feeds = function( list ) {

		for(var i=0; i<list.length; i++)  {
			self.unset( list[i] );
			$('article.js-stream-item[data-id="'+list[i]+'"]').remove();
		}

	}	

	this.remove_all_category = function( category_id ) {

		var bl = $('section.js-column[data-column="'+category_id+'"]');

		if (options["dont_ask_remove_all"]) {
			onSuccess();
		}
		else {
			FormModal.show( { title: "Confirmation required", text: 'Do you want to Archive all posts?', checkbox: "dont_ask_remove_all" }, onSuccess, onCancel );
		}

		// ---------------------------------
		function onSuccess() {

			self.unset_category(category_id);

			clear_feed(category_id);

			message_list_empty(category_id);

			chrome.extension.sendRequest( { command:"setHideListFeeds", category_id: category_id }, function(){

				get_container(category_id).find('.js-column-count-value').empty();
				
			});

		}
		// ---------------------------------
		function onCancel() {

		}

	}

	this.mark_all_category = function( category_id ) {

		var bl = $('section.js-column[data-column="'+category_id+'"]');

		if (options["dont_ask_mark_all"]) {
			onSuccess();
		}
		else {
			FormModal.show( { title: "Confirmation required", text: 'Do you want to Mark all posts as read?', checkbox: "dont_ask_mark_all" }, onSuccess, onCancel );	
		}
		

		// ---------------------------------
		function onSuccess() {

			$('article.js-stream-item', bl).attr("data-mark", '1');

			self.markset(category_id);

			get_container(category_id).find('.js-column-count-value').empty();

			chrome.extension.sendRequest( { command:"setMarkListFeeds", category_id: category_id });
				

		}
		// ---------------------------------
		function onCancel() {

		}

	}

	this.mark_all_feeds = function( ) {

		if (options["dont_ask_mark_all"]) {
			onSuccess();
		}
		else {
			FormModal.show( { title: "Confirmation required", text: 'Do you want to Mark all posts as read?', checkbox: "dont_ask_mark_all" }, onSuccess, onCancel );	
		}
		

		// ---------------------------------
		function onSuccess() {

			$('article.js-stream-item').attr("data-mark", '1');

			self.markset_all();

			$('.js-column-count-value').empty();

			chrome.extension.sendRequest( { command:"setMarkAllFeeds" });
				

		}
		// ---------------------------------
		function onCancel() {

		}

	}


	// -----------------------------------------------------------------------------
}
