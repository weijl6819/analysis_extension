// ======================================================================================
//
//				Form for category and Feeds
//
// ======================================================================================

var FormFeed = new function(){

	var self = this;
	var value = null;
	var isForm = false;	
	var typeForm = null;
	
	// -----------------------------------------------------------------------------
	this.init = function( param, callback ){		
		
		$(".js-formfeed-close").off("click").on("click", function (e) {
			self.hide();
		});
		
	}
	
	// -----------------------------------------------------------------------------
	this.hide = function( d ){
		
		if (typeof d == 'undefined') d = 'slow';
		
		$("#app-content").animate({ left: '200px' }, d);
		isForm = false;
		typeForm = null;
	}	
	
	// -----------------------------------------------------------------------------
	this.show = function( type ){	

		if (isForm) {
			if (typeForm == type)	return self.hide(400);
		}
	
		$("#app-content").animate({ left: '470px' }, "slow");
		isForm = true;
		typeForm = type;
		
		if ( type == 'category') {
			$('.js-compose-list-enable').show();
			$('.js-compose-move-enable').hide();
			$('.js-compose-text-enable').show();
			$('.js-compose-input-enable').show();
			$('.js-filter-input-categories').show();
		}	
		else if ( type == 'manager') {
			$('.js-compose-list-enable').hide();
			$('.js-compose-move-enable').show();
			$(".js-add-button").hide();
			$('.js-remove-button').hide();
			$('.js-compose-text-enable').hide();
			$('.js-compose-input-enable').hide();
			$('.js-filter-input-categories').hide();
		}		
		
	}


	
		
	// -----------------------------------------------------------------------------	
}