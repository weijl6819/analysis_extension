// ======================================================================================
//
//				Form for modal dialog
//
// ======================================================================================

var FormModal = new function(){

	var self = this;
	var value = null;
	
	var elemForm = false, elemMessage = false;
	var isForm = false;

	// -----------------------------------------------------------------------------
	this.init = function( ){		
		
		elemForm = $(".js-modals-container");
		elemMessage = $(".js-message-container");
		
	}
	
	// -----------------------------------------------------------------------------
	this.hide = function( ){

		elemForm.empty();
		
		isForm = false;
	}	
	
	// -----------------------------------------------------------------------------
	this.show = function( opt, onSuccess, onCancel ){	

		if (!opt) return;

		if (isForm) 	self.hide();

		if (!opt.title)  opt.title = 'Alert';

		if ('text' in opt) {

			elemForm.append(build(opt.title, opt.text, opt.checkbox));

			isForm = true;

		}

		// -----------------------------------------------------------------------------
		function build(title, text, mssg) {

			var html = $('<div class="modalfade"></div>'+
						 '<div class="modals-form">'+  
						 '  <div class="modals-form-header">'+
						 '	  <span class="modals-form-title">'+title+'</span>'+
						 '    <span class="modals-form-close"></span>'+
						 '  </div>'+
						 '  <div class="modals-form-message">'+
						 '    <div class="modals-form-message-text">'+  
						 '       <span>'+text+'</span>'+
						 '    </div>'+
						 '  </div>'+
						 '  <div class="modals-form-checkbox">'+
						 '  </div>'+
						 '  <div class="modals-form-action">'+
	                     '    <div class="modals-form-action-buttons">'+
	                     '      <button class="button modals-form-action-apply" tabindex="1">Ok</button>'+
	                     '      <button class="button modals-form-action-cancel" tabindex="2">Cancel</button>'+
	                     '    </div>'+
	                     '  </div>'+					 
						 '</div>');

			if (mssg) {
				var xx = $('<div class="modals-form-checkbox">'+
			               '  <fieldset>'+
			               '    <label>'+
			               '       <input type="checkbox" />'+
			               '       <span>Don`t ask me again</span>'+
			               '    </label>'+
			               '  </fieldset>'+
						   '</div');
				$('input', xx).prop("checked", options[mssg]);

				$('.modals-form-checkbox', html).append(xx);
			}

			$('.modals-form-close', html).off('click').on('click', function(e){
				e.preventDefault();
				self.hide();
				onCancel();
			});		

			$('.modals-form-action-apply', html).off('click').on('click', function(e){
				e.preventDefault();
				self.hide();
				onSuccess();

				if (mssg) {
					var x = $('input', xx).prop("checked");
					if (x) { 
						options[mssg] = true;
						chrome.extension.sendMessage( { action: "setValueOptions", name: mssg, value: true } );			
					}	
				}

			});		

			$('.modals-form-action-cancel', html).off('click').on('click', function(e){
				e.preventDefault();
				self.hide();
				onCancel();
			});		


			return html;
		}
	
		
	}

	// -----------------------------------------------------------------------------
	this.message = function( opt ){	

		console.log('message', opt);

		if ('text' in opt) {

			elemMessage.empty();

			var html = $('<div class="message-form">'+  
						 '  <div class="message-form-message">'+
						 '    <div class="message-form-message-text">'+  
						 '       <span>'+opt.text+'</span>'+
						 '    </div>'+
						 '  </div>'+
						 '</div>');

			html.off('click').on('click', function(e){
				e.preventDefault();
				elemMessage.empty();
			});		

			setTimeout( function(){
				elemMessage.empty();
			}, 2000)

			elemMessage.append( html );

		}	
	}	
		
	// -----------------------------------------------------------------------------	
}