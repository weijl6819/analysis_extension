// ======================================================================================
//
//				Category
//
// ======================================================================================

var Category = new function(){

	var self = this;
	var containerNavigator = null;
	var container = null;

	var runMoreLoad = false;
	var moreCategory = {};

	var tempCategoryId = null;

	// -----------------------------------------------------------------------------
	this.init = function( ){

		containerNavigator = $('#container-navigator');
		container = $('#container');

		$("#add-category").off("click").on("click", function (e) {
				e.preventDefault();
				add_category( 0 );
		});

		$("#manager-category").off("click").on("click", function (e) {
				e.preventDefault();
				manager_category();
		});

		searchCategoryId = options.searchCategoryId;
		tempCategoryId = options.tempCategoryId;
		hideListCategoryId = options.hideListCategoryId;

		$('.js-app-search-input').autocomplete({
	      source: self.autocomplete,
	      minLength: 1,
	      delay: 300,
	      select: self.search_filter,
		  open: function(){
        	setTimeout(function () {
            	$('.ui-autocomplete').css({	'z-index': 9999,
            								'color': '#aab8c2',
    										'background-color': '#14171A',
    										'border': '1px solid #aab8c2'
            							  });
        		}, 0);
    	  }
	    });
		$(".js-search-delete-item").off("click").on("click", function (e) {
			e.preventDefault();
			self.clear_search_filter();
		});
		$(".js-perform-search").off("click").on("click", function (e) {
			e.preventDefault();
			$('.js-app').removeClass('collapsed');
			$('.js-app-search-input').focus();
		});

		$('.js-app-filter-input').bind("input", function (e) {
				var flt = $(this).val().toLowerCase();
				e.preventDefault();
				if (flt) {
					$('.js-perform-filter').addClass('activate');
				}
				else {
					$('.js-perform-filter').removeClass('activate');
				}
				var el = $(".js-compose-list").find(".js-column-nav-menu-item");
				el.each(function() {
      				str = $( this ).attr('data-sname');
      				if (!flt) $(this).show();
      				else if (str.indexOf(flt) != -1) $(this).show();
      				else $(this).hide();
    			});
		});
		$('.js-perform-filter').bind("click", function (e) {
				$('.js-app-filter-input').val('');
				$('.js-perform-filter').removeClass('activate');
				$(".js-compose-list").find(".js-column-nav-menu-item").show();
		});

	}

	// -----------------------------------------------------------------------------
	this.show = function( ){

		paint();

		if (searchCategoryId) {
			var v = self.get_id( searchCategoryId );
			$('.js-compose-search-item').show();
			$('.js-compose-search-title').attr('title', v.name).find('span').text(v.name);
			$('.js-compose-search-icon').attr('src', v.icon);
		}

	}

	// -----------------------------------------------------------------------------
	this.feed = function( ){

		Feed.appendFirstFeed = false;
		Feed.paint();

	}

	// -----------------------------------------------------------------------------
	this.is_show = function( id ){

		for (var i=0; i<showCategory.length; i++) {
			if (showCategory[i].id == id) return i;
		}
		return -1;
	}

	// -----------------------------------------------------------------------------
	this.get_id = function( id ){

		for (var i=0; i<dataCategory.length; i++) {
			if (dataCategory[i].id == id) return dataCategory[i];
		}
		return null;
	}

	// -----------------------------------------------------------------------------
	this.get_position = function( position ){

		for (var i=0; i<dataCategory.length; i++) {
			if (dataCategory[i].position == position) return dataCategory[i];
		}
		return null;
	}

	// -----------------------------------------------------------------------------
	this.set = function( cat ){

		for (var ii=0; ii<cat.length; ii++) {
			var f = true;
			for (var i=0; i<dataCategory.length; i++) {
				if (dataCategory[i].id == cat[ii].id) {
					dataCategory[i] = cat[ii];
					f = false;
					break;
				}
			}
			if (f) dataCategory.push(cat[ii]);
		}
		return;
	}

	// -----------------------------------------------------------------------------
	this.unset = function( id ){

		for (var i=0; i<dataCategory.length; i++) {
			if (dataCategory[i].id == id) {
				dataCategory.splice(i,1);
				break;
			}
		}
		return;
	}

	// -----------------------------------------------------------------------------
	this.repaint = function(  ){

		paint();
	}

	// -----------------------------------------------------------------------------
	function paint() {

		self.build_column();

		self.build_list_category();

		self.build_move_category();

	}

	// =============================COLUMN======================================= колонны в основном окне
	this.build_column = function( id ){

		if ( typeof id == 'undefined' ) {
			container.empty();
			for (var i=0; i<showCategory.length; i++) {
				if (searchCategoryId && searchCategoryId != showCategory[i].id) continue;
				var col = show_item_column( showCategory[i] );
				container.append(col);
			}
		}
		else {
			$('section.js-column[data-column="'+id+'"]').remove();
			var cat = self.get_id( id );
			var col = show_item_column( cat );
			container.append(col);
		}

		$('.js-column-scroller').off("scroll").on("scroll", function(e){

			if (runMoreLoad)  return;

			var ee = e.currentTarget;
			var col = $(ee).closest('section');
			var cat_id = col.attr('data-column');
			var hh = ee.scrollHeight;
			var height = $(ee).height();
			var top = $(ee).scrollTop();

			if ( hh-100 < height + top  ) {
				self.load_more( cat_id );
			}

		});

		if (tempCategoryId) {
			show_search_category_button();
		}	

	}

	// -----------------------------------------------------------------------------
	this.load_more = function( category_id ){

		if ( moreCategory[category_id] ) return;

		runMoreLoad = true;
		moreCategory[category_id] = 1;		// попытаемся считать

		var e = $('article.js-stream-item', $('section.js-column[data-column="'+category_id+'"]')).last();

		var last = e.attr('data-create');  //Feed.get_last_feed( category_id );

		self.read_more( category_id, last, function(ff){

			if (ff.length>0) {

				Feed.set( ff );

				Feed.appendFirstFeed = false;

				Feed.paint({ feeds: ff });

				delete moreCategory[category_id];
			}
			else {
				moreCategory[category_id] = 2;		// нет сведений
			}
			runMoreLoad = false;

		});

	}

	// -----------------------------------------------------------------------------
	function show_item_column( item ) {

		var sect = $('<section class="js-column column  column-type-message will-animate is-moving" data-column="'+item.id+'">'+
					 '  <div class="js-column-holder column-holder">'+
					 '    <div class="column-panel flex flex-column height-p--100">'+
					 '      <header class="js-column-header js-action-header flex-shrink--0 column-header" data-action="resetToTopColumn">'+
					 '        <div class="pull-left margin-hs column-type-icon icon">'+
				     '          <img class="icon-large-column" src="'+item.icon+'">'+
					 '        </div>'+
					 '        <h1 class="column-title txt-ellipsis">'+
					 '          <span class="column-head-title">'+item.name+'</span>'+
					 '        </h1>'+
					 '        <a class="js-action-remove-all-button column-remove-all-link" href="#" data-column="'+item.id+'" title="Archive all posts">'+
					 '          <i class="icon icon-clear-input"></i>'+
					 '        </a>'+
					 '        <a class="js-action-mark-all-button column-mark-all-link" href="#" data-column="'+item.id+'" title="Mark all as read">'+
					 '          <i class="icon icon-mark-read"></i>'+
					 '        </a>'+
					 '        <div class="js-column-count-value column-count-wrapped"></div>'+
					 '      </header>'+
					 '      <div class="js-column-ticker column-ticker position-rel">'+
					 '        <div class="js-ticker-container ticker-container" data-column="'+item.id+'" >'+
					 '        </div>'+
					 '      </div>'+
					 '      <div class="js-column-content column-content flex-auto position-rel flex flex-column height-p--100">'+
					 '        <div class="js-column-scroller js-dropdown-container column-scroller position-rel scroll-v flex-auto height-p--100 scroll-styled-v ">'+
					 '          <div class="js-feed-container chirp-container" data-column="'+item.id+'" >'+
					 '            <div class="js-feed-list-empty list-placeholder l-table pin-all">'+
					 '              <div class="l-cell">'+
					 '                <p class="txt-size--16">No updates so far...</p>'+
					 '              </div>'+
					 '            </div>'+
					 '          </div>'+
					 '        </div>'+
					 '      </div>'+
					 '    </div>'+
					 '  </div>'+
					 '</section>');

		$('.js-action-header-button', sect).off("click").on("click", function (e) {
				e.preventDefault();
				add_category( $(this).attr('data-column') );
		});

		$('.js-action-remove-all-button', sect).off("click").on("click", function (e) {
				e.preventDefault();
				Feed.remove_all_category( $(this).attr('data-column') );
		});

		$('.js-action-mark-all-button', sect).off("click").on("click", function (e) {
				e.preventDefault();
				Feed.mark_all_category( $(this).attr('data-column') );
		});

		if (options.show_posts_unmark)  sect.hide();

		return sect;
	}

	// ====================================================================
	// список категорий для выбора отображения  (Add Category)
	this.build_list_category = function(  ){

		var categories = [];
		for (var i=0; i<dataCategory.length; i++)  categories.push({ id:  dataCategory[i].id,
																	 show:  self.is_show(dataCategory[i].id),
																	 name: dataCategory[i].name,
																	 sname: dataCategory[i].name.toLowerCase(),
																	 description: dataCategory[i].description
																  })
		categories.sort( function( item1, item2 )  {
									return (item1.sname < item2.sname ? -1 : 1);
								} );

		$(".js-compose-list").empty();
		for (var i=0; i<categories.length; i++) {
			var ll = show_item_list( categories[i] );
			$(".js-compose-list").append(ll);
		}
	}
	// -----------------------------------------------------------------------------
	function show_item_list( item ) {

		var x = item.show != -1 ? "1" : "0";
		if ( tempCategoryId == item.id ) x = 2;

		var li = $('<li class="js-column-nav-menu-item column-nav-list-item" data-column="'+item.id+'" data-action="'+x+'" data-sname="'+item.sname+'">'+
				   '  <a class="drag-handle link-clean cf column-nav-link txt-size--17">'+
				   '     <div class="obj-left">'+
				   '        <i class="icon icon-check icon-large position-rel margin-t---5" data-action="drag">  </i>'+
				   '     </div>'+
				   '     <div class="js-column-title column-nav-menu-text nbfc" title="'+item.description+'">'+
				   build_category_name( item.name )+
				   '     </div>'+
				   '  </a>'+
				   '</li>');

		li.off("click").on("click", function (e) {
				e.preventDefault();
				var x = $(this).attr('data-action');
				var id = $(this).attr('data-column');
				if ( x == "0" ) {
					add_show_category(id);
					x = "1";
				}
				else if ( x == "1" ) {
					if (searchCategoryId == id) {
						x = "2";
						tempCategoryId = id;
						chrome.extension.sendRequest( { command:"setOptions", name: "temp_category_id", value: tempCategoryId } );
					}	
					else {
						remove_show_category(id);
						x = "0";
					}				
				}
				else if ( x == "2" )  {
					x = "1";
					tempCategoryId = null;
					chrome.extension.sendRequest( { command:"setOptions", name: "temp_category_id", value: 0 } );
				}
				$(this).attr('data-action', x);
		});

		return li;
	}
	// -----------------------------------------------------------------------------
	function build_category_name( name ) {

		var m = name.match(/\((.+?)\)$/im);

		var t1 = name, t2 ='', s = '';

		if ( m ) {
			t2 = m[0];
			t1 = t1.substring(0, m.index);
			s = 'style="width: 170px;"';
		}

		var h =  ' <span class="column-head-title add-category" '+s+'>'+t1+'</span>'+
				 ' <span class="column-head-id">'+t2+'</span>';

		return h;
	}
	// -----------------------------------------------------------------------------
	function add_show_category(id) {

		console.log('add_show_category', id);

		showList.push(id);

		self.load_show_category(  );

		self.build_move_category();

		chrome.extension.sendRequest( { command:"setShowCategory", list: showList });

		if (!searchCategoryId || searchCategoryId == id)  self.build_column(id);

		chrome.extension.sendRequest( { command:"showAddCategory", category_id: id }, function(info){

			console.log(info);

			Feed.set( info.feeds );

			Feed.appendFirstFeed = false;

			Feed.paint({feeds: info.feeds});

			FormModal.message({text: 'Category has been added'});

		});

	}
	function remove_show_category(id) {

		var k = showList.indexOf(id);
		if ( k != -1) showList.splice(k,1);
		
		self.load_show_category();

		$('section.js-column[data-column="'+id+'"]').remove();

		self.build_move_category();

		chrome.extension.sendRequest( { command:"setShowCategory", list: showList })

		chrome.extension.sendRequest( { command:"hideRemoveCategory", category_id: id });

		FormModal.message({text: 'Category has been removed'});
	}


	// ====================================================================
	// список категорий для перемещения
	this.build_move_category = function(  ){

		$(".js-compose-move").empty();
		if (showCategory.length) {
			for (var i=0; i<showCategory.length; i++) {
				if ( tempCategoryId == showCategory[i].id ) continue;
				var ll = show_item_move( showCategory[i] );
				$(".js-compose-move").append(ll);
			}
			$(".js-compose-move").sortable({
					revert:false,
					update: function(event, ui){
						//console.log(event, ui);
						var mid = ui.item.attr('data-column'),
							prev = -1,
							mcol = -1;
						showList = [];
						$('li.js-column-move-item').each(function( index ) {
							var id = $(this).attr('data-column');
							showList.push(id);
							if ( id == mid ) {
								mcol = prev;
							}
							prev = id;
						});

						self.load_show_category(  );

						self.move_column(mcol, mid);

						chrome.extension.sendRequest( { command:"setShowCategory", list: showList })
					}
			});
			$( "ul.js-compose-move, li.js-column-move-item" ).disableSelection();
		}
		else {
			$(".js-compose-move").append(
						'<li class="js-column-move-item column-nav-list-item">'+
					   	'  <a class="drag-handle link-clean cf padding-l--10 column-nav-link txt-size--17">'+
					    '     <div class="js-column-title nbfc">'+
					    '       <span class="title-manager column-no-categories-title">First, you need to add categories</span>'+
					    '     </div>'+
					    '  </a>'+
					    '</li>');
		}	

		if (hideListCategoryId) {
			for (var i=0; i<hideListCategoryId.length; i++) {
				var sect = $('section.js-column[data-column="'+hideListCategoryId[i]+'"]');
				sect.hide();
				var clmn = $('li.js-column-move-item[data-column="'+hideListCategoryId[i]+'"]').find('.js-column-select');
				clmn.addClass('hide-column');
			}
		}

	}
	// -----------------------------------------------------------------------------
	// категории для <Edit Category>
	function show_item_move( item ) {

		var li = $('<li class="js-column-move-item column-nav-list-item ui-state-default" data-column="'+item.id+'">'+
				   '  <a class="drag-handle link-clean cf padding-l--10 column-nav-link txt-size--17">'+
				   '     <i class="js-column-drag-handle is-movable column-drag-handle pull-left sprite sprite-drag-vertical"></i>'+
				   '     <div class="obj-left icon-manager icon icon-large txt-center position-rel">'+
				   '        <img class="icon-large-move" data-action="drag" src="'+item.icon+'">'+
				   '     </div>'+
				   '     <div class="js-column-title nbfc" title="'+item.description+'">'+
				   '       <span class="title-manager column-head-title">'+item.name+'</span>'+
				   '     </div>'+
				   '     <div class="js-column-select manager-nbfc-select">'+
				   '        <i class="icon icon-check icon-large-select position-rel" data-action="drag">  </i>'+
				   '     </div>'+
				   '  </a>'+
				   '</li>');

		$('.js-column-select', li).off("click").on("click", function (e) {
				e.preventDefault();
				var ee = $(this).closest('li');
				var x = ee.attr('data-column');
				var sect = $('section.js-column[data-column="'+item.id+'"]');
				if ( $(this).hasClass( 'hide-column' ) ) {
					$(this).removeClass('hide-column');
					sect.show();
					remove_hide_categoty(item.id);
				}
				else {
					$(this).addClass('hide-column');
					sect.hide();
					add_hide_categoty(item.id);
				}
		});

		return li;
	}

	// ------------------------------
	function add_hide_categoty( id ) {
		if (!hideListCategoryId)  hideListCategoryId = [id]
		else if (hideListCategoryId.indexOf(id) == -1) hideListCategoryId.push(id);
		chrome.extension.sendRequest( { command:"setOptions", name: "hide_list_category_id", value: JSON.stringify(hideListCategoryId) } );
	}
	function remove_hide_categoty( id ) {
		var k = hideListCategoryId.indexOf(id);
		if (k != -1) hideListCategoryId.splice(k,1);
		chrome.extension.sendRequest( { command:"setOptions", name: "hide_list_category_id", value: JSON.stringify(hideListCategoryId) } );
	}

	// =============================================================================
	// меняем местами колонки - после перемещения категорий
	this.move_column = function( ind, mid ){

		console.log('move_column', ind, mid);

		var mel = $('.js-column[data-column="'+mid+'"]', container);

		if (ind != -1) {
			var el = $('.js-column[data-column="'+ind+'"]', container);
			mel.detach().insertAfter( el );
		}
		else {
			var el = $('.js-column', container).filter( ':first' );
			mel.detach().insertBefore( el );
		}


	}

	// =============================================================================
	// открываем формы для настройки категорий
	function add_category( id ) {
		FormFeed.show('category', 0);
		//chrome.extension.sendRequest( { command:"getMarkFeeds"  } );
	}

	function manager_category( ) {
		FormFeed.show('manager', 0);
	}

	// -----------------------------------------------------------------------------
	// переносим данные по категориям в список отображаемых категорий  dataCategory --- (showList) ---> showCategory
	this.load_show_category = function( ) {
		showCategory = [];
		for (var i=0; i<showList.length; i++) {
			var x = self.get_id( showList[i] );
			if (x) showCategory.push(x);
		}
	}
	// -----------------------------------------------------------------------------
	this.read_more = function( category_id, last, callback ){

		var params = {};
		params[category_id] = last;

		chrome.extension.sendRequest( { command:"getFeed", params: params }, function( info ){

			callback(info.feeds);
		});

	}
	// -----------------------------------------------------------------------------
	this.autocomplete = function( request, response ){

		var list = [];
		var nn = request.term.toLowerCase();

		response( $.map(dataCategory, function(item){

			if (item.name.toLowerCase().indexOf(nn) != -1) {
				return{
					label: item.name,
					value: item.id
				}
			}

		}));
	}

	// -----------------------------------------------------------------------------
	function is_search_category( ) {

		var fl = false;
		for (var i=0; i<showCategory.length; i++) {
			if (showCategory[i].id == searchCategoryId) {
				fl = true;
				break;
			}
		}

		if (fl)  tempCategoryId = 0;
		else     tempCategoryId = searchCategoryId;

	}

	// -----------------------------------------------------------------------------
	this.search_filter = function( event, ui ){

        console.log(ui);	

		var label = ui.item.label;
		searchCategoryId = ui.item.value;

		is_search_category();

		if (tempCategoryId) { 
			var x = self.get_id( searchCategoryId );
			if (x) showCategory.push(x);
			add_show_category( searchCategoryId );

			chrome.extension.sendRequest( { command:"setOptions", name: "temp_category_id", value: tempCategoryId } );

			show_search_category_button();
		}	

		chrome.extension.sendRequest( { command:"setOptions", name: "search_category_id", value: searchCategoryId } );

		setTimeout( function(){
			$('.js-app-search-input').val('');
		}, 0);

		var v = self.get_id( searchCategoryId );
        console.log(v);	
		$('.js-compose-search-item').show();
		$('.js-compose-search-title').attr('title', label).find('span').text(label);

        if (v && v.icon) {	
		  $('.js-compose-search-icon').attr('src', v.icon);
		}
		else {
          chrome.extension.sendRequest( { command:"set_error_category" } );
		}  

		self.show();

		self.feed();

	}
	function show_search_category_button( ) {

		var html = $('<div class="search_category_button_form" id="search_category_button_form">'+
					 '  <div class="js-column-holder column-holder">'+
					 '    <div class="column-panel flex flex-column height-p--100">'+
					 '      <div class="search_category_button_wrapped">'+
					 '        <div class="search_category_button_action">'+
                     '           <div class="js-search_category_message_add category-message-add">Category has been added</div>'+
                     '           <button class="js-search_category_button_add button category-button-add" tabindex="1">Add to my categories</button>'+
                     '           <button class="js-search_category_button_back button category-button-back" tabindex="2">Back to my categories</button>'+
					 '        </div>'+
					 '      </div>'+
					 '    </div>'+
					 '  </div>'+
					 '</div>');

		container.append(html);		

		$('.js-search_category_button_add').off("click").on("click", function (e) {
			$('.js-column-nav-menu-item[data-column="'+tempCategoryId+'"]').attr('data-action', '1');
			tempCategoryId = null;
			chrome.extension.sendRequest( { command:"setOptions", name: "temp_category_id", value: 0 } );
			$('.js-search_category_button_add').remove();
			$('.js-search_category_message_add').show();
		});

		$('.js-search_category_button_back').off("click").on("click", function (e) {
			self.clear_search_filter();
		});

	}

	// -----------------------------------------------------------------------------
	this.clear_search_filter = function( ){

		searchCategoryId = null;
		
		if (tempCategoryId) {
			remove_show_category(tempCategoryId); 
			tempCategoryId = null;
			chrome.extension.sendRequest( { command:"setOptions", name: "temp_category_id", value: 0 } );

			$('#search_category_button_form').remove();
		}

		$('.js-compose-search-item').hide();

		self.show();

		setTimeout( function() {
			self.feed();	
		}, 100);
		

		chrome.extension.sendRequest( { command:"setOptions", name: "search_category_id", value: 0 } );
	}

	// -----------------------------------------------------------------------------
	this.show_columt_counts = function( counts ){

		for (var cat in counts) {
			if (counts[cat]) {
				$('section.js-column[data-column="'+cat+'"]').find('.js-column-count-value').html('<span class="column-count-wrapped-text">'+counts[cat]+'</span>');
			}
			else {
				$('section.js-column[data-column="'+cat+'"]').find('.js-column-count-value').empty();
			}
		}
	}

	// -----------------------------------------------------------------------------
	this.change_category = function( category ){

		for (var i=0; i<category.length; i++) {

			var sect = $('section.js-column[data-column="'+category[i].id+'"]');
			if (sect.length == 0)  continue;

			$('.column-head-title', sect).text(category[i].name);
			$('.icon-large-column', sect).attr('src', category[i].icon);

			var li = $('li.js-column-nav-menu-item[data-column="'+category[i].id+'"]');
			$('.column-head-title', li).text(category[i].name);
			$('.js-column-title', li).attr('title', category[i].description);

			var li = $('li.js-column-move-item[data-column="'+category[i].id+'"]');
			$('.column-head-title', li).text(category[i].name);
			$('.js-column-title', li).attr('title', category[i].description);

		}

	}

	// -----------------------------------------------------------------------------
}
