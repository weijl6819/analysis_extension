// ======================================================================================
//
//				Feed
//
// ======================================================================================

var Ticker = new function(){

	var self = this;

	// -----------------------------------------------------------------------------
	this.show = function( ticker, market_cap, market_dom ){

		console.log(ticker);

		for (var k in ticker) {

			var cat_id = ticker[k].category_id;
			var e = $('.js-ticker-container[data-column="'+cat_id+'"]');
			if (e.length>0) {

				if ( options.show_prices_updates || options.show_mini_graphs ) {
					e.attr('style', 'border-bottom: 1px solid #d9dde0;');
				}
				else {
					e.removeAttr('style', 'border-bottom: 1px solid #d9dde0;');
				}	

				var x = $('.js-ticker-price-container', e);

				if ( options.show_prices_updates ) {
					if (x.length>0) {
						set_price( x, ticker[k] )
					}
					else {
						e.append(build_price( ticker[k] ));	
					}	
				}
				else {
					if (x.length>0) x.remove();
				}

				var x = $('.js-ticker-image-container', e);

				if ( options.show_mini_graphs ) {
					if (x.length>0) {
						$('.js-ticker-image-elem', x).attr('src', ticker[k].image);
					}
					else {
						e.append(build_image( ticker[k] ));
					}	
				}	
				else {
					if (x.length>0) x.remove();
				}
			}	

		}

		// market
		$('.js-app-market-cap').html(str_market(market_cap));
		$('.js-app-dominance').html(str_dominance(market_dom));

	}

	// -----------------------------------------------------------------------------
	function str_market( val ) {

		var s1 = '<span style="font-stretch: ultra-condensed; font-size: 0.8em;">$</span>';
		var s2 = '<span style="font-stretch: ultra-condensed; font-size: 0.9em;">B</span>';

		var x;
		if (val > 1000000000) {
			x = parseInt(val/1000000000);
			return s1+x+s2;
		}
		else if (val > 1000000) {
			x = parseInt(val/1000000);
			return s1+x+'M';
		}
		else if (val > 1000) {
			x = parseInt(val/1000);
			return s1+x+'K';
		}
		else {
			return s1+x;
		}
	}	
	function str_dominance( val ) {

		x = parseInt(val*10)/10;

		return x+'<span style="font-stretch: ultra-condensed; font-size: 0.8em;">%</span>';

	}	

	// -----------------------------------------------------------------------------
	function build_price( tick ) {

		var h = $('<div class="js-ticker-price-container ticker-header-container">'+
				  '  <div class="ticker-header-row" >'+
				  '    <div class="ticker-header-cell" title="" style="top: 0px; left: 0px; height: 34px; width: 105px;">'+	
				  '	     <div class="ticker-cell-label-container">'+    
				  '        <div ref="eLabel" class="ticker-header-cell-label">'+    
				  ' 	     <span ref="eText" class="ticker-header-cell-text">Price</span>'+
				  '        </div>'+
				  '      </div>'+
				  '    </div>'+
				  '    <div class="ticker-header-cell" title="" style="top: 0px; left: 105px; height: 34px; width: 70px;">'+	
				  '	     <div class="ticker-cell-label-container">'+    
				  '        <div ref="eLabel" class="ticker-header-cell-label">'+    
				  ' 	     <span ref="eText" class="ticker-header-cell-text">1h</span>'+
				  '        </div>'+
				  '      </div>'+
				  '    </div>'+
				  '    <div class="ticker-header-cell" title="" style="top: 0px; left: 175px; height: 34px; width: 70px;">'+	
				  '	     <div class="ticker-cell-label-container">'+    
				  '        <div ref="eLabel" class="ticker-header-cell-label">'+    
				  ' 	     <span ref="eText" class="ticker-header-cell-text">24h</span>'+
				  '        </div>'+
				  '      </div>'+
				  '    </div>'+
				  '    <div class="ticker-header-cell" title="" style="top: 0px; left: 245px; height: 34px; width: 70px;">'+	
				  '	     <div class="ticker-cell-label-container">'+    
				  '        <div ref="eLabel" class="ticker-header-cell-label">'+    
				  ' 	     <span ref="eText" class="ticker-header-cell-text">7d</span>'+
				  '        </div>'+
				  '      </div>'+
				  '    </div>'+
				  '  </div>'+
				  '</div>'+
				  '<div role="row" row-id="'+tick.id+'" class="ticker-row">'+
				  '  <div role="row" class="js-ticker-price ticker-cell" style="top: 0px; left: 0px;   height: 34px; width: 94px;">$ '+tick.price_usd+'</div>'+
				  '  <div role="row" class="js-ticker-percent1 ticker-cell" style="top: 0px; left: 105px; height: 34px; width: 59px;">'+tick.percent_change_1h+'%</div>'+
				  '  <div role="row" class="js-ticker-percent2 ticker-cell" style="top: 0px; left: 175px; height: 34px; width: 59px;">'+tick.percent_change_24h+'%</div>'+
				  '  <div role="row" class="js-ticker-percent3 ticker-cell" style="top: 0px; left: 245px; height: 34px; width: 59px;">'+tick.percent_change_7d+'%</div>'+
				  '</div>');

		set_price( h, tick );

		h.off('click').on("click", function (e) {
			var url = 'https://coincheckup.com/coins/'+tick.id+'/charts/basic';
			var win = window.open(url, '_blank');
			win.focus();
		});

		return h;
	}

	function set_price( h, tick ) {

		h.find('.js-ticker-price_usd').text('$ '+tick.price_usd);
		h.find('.js-ticker-percent2').text(tick.percent_change_1h);
		h.find('.js-ticker-percent3').text(tick.percent_change_24h);
		h.find('.js-ticker-percent4').text(tick.percent_change_7d);


		if (tick.percent_change_1h < -20)	h.find('.js-ticker-percent1').addClass('negtresh2');
		else if (tick.percent_change_1h < -10)	h.find('.js-ticker-percent1').addClass('negtresh1');
		else if (tick.percent_change_1h < -0)	h.find('.js-ticker-percent1').addClass('negtresh0');
		else if (tick.percent_change_1h > 20)	h.find('.js-ticker-percent1').addClass('tresh2');
		else if (tick.percent_change_1h > 10)	h.find('.js-ticker-percent1').addClass('tresh1');
		else h.find('.js-ticker-percent1').addClass('tresh0');	

		if (tick.percent_change_24h < -20)	h.find('.js-ticker-percent2').addClass('negtresh2');
		else if (tick.percent_change_24h < -10)	h.find('.js-ticker-percent2').addClass('negtresh1');
		else if (tick.percent_change_24h < -0)	h.find('.js-ticker-percent2').addClass('negtresh0');
		else if (tick.percent_change_24h > 20)	h.find('.js-ticker-percent2').addClass('tresh2');
		else if (tick.percent_change_24h > 10)	h.find('.js-ticker-percent2').addClass('tresh1');
		else h.find('.js-ticker-percent2').addClass('tresh0');	

		if (tick.percent_change_7d < -20)	h.find('.js-ticker-percent3').addClass('negtresh2');
		else if (tick.percent_change_7d < -10)	h.find('.js-ticker-percent3').addClass('negtresh1');
		else if (tick.percent_change_7d < -0)	h.find('.js-ticker-percent3').addClass('negtresh0');
		else if (tick.percent_change_7d > 20)	h.find('.js-ticker-percent3').addClass('tresh2');
		else if (tick.percent_change_7d > 10)	h.find('.js-ticker-percent3').addClass('tresh1');
		else h.find('.js-ticker-percent3').addClass('tresh0');	

	}	

	// -----------------------------------------------------------------------------
	function build_image( tick ) {

		var h = $('<div class="js-ticker-image-container ticker-image-container">'+
				  '  <div class="ticker-image-wrapped" >'+
				  '    <img class="js-ticker-image-elem ticker-image-elem" src="'+tick.image+'">'+	
				  '  </div>'+
				  '</div>');

		h.off('click').on("click", function (e) {
			var url = 'https://coinmarketcap.com/currencies/'+tick.id+'/';
			var win = window.open(url, '_blank');
			win.focus();
		});

		return h;

	}	
	
		



	// -----------------------------------------------------------------------------
}
