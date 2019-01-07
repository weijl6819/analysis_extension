class On {
	constructor() {
		self = this;
		self.browser = chrome || browser;
        self.ready();
    }
	ready() {
		$(document).ready(function() {
			self.browser.i18n.getUILanguage().indexOf('ru') != - 1 ? $('#fb_support').hide() : $('#vk_support').hide();
			$('#vk_support').on('click', function(e){
				e.preventDefault();
				self.create('https://vk.com/vk_adsblocker');
			});
			$('#fb_support').on('click', function(e){
				e.preventDefault();
				self.create('https://www.facebook.com/Ads-Blocker-112640802502771/');
			});
			$('#ws_rate').on('click', function(e){
				e.preventDefault();
				self.create('https://chrome.google.com/webstore/detail/ngahaphlngmdfhbhkplbglnfhehnpgdb/reviews');
			});
			$('#show').hide();
			$('#mail').hide();
			$('#good').on('click', function(e){
				e.preventDefault();
				$('#ask').hide();
				$('#show').show();
			});
			$('#bad').on('click', function(e){
				e.preventDefault();
				$('#ask').hide();
				$('#mail').show();
			});
			$('#ws').on('click', function(e){
				e.preventDefault();
				self.create('https://chrome.google.com/webstore/detail/ngahaphlngmdfhbhkplbglnfhehnpgdb/reviews');	
			})
		})
	}
	create(url) {
		self.browser.tabs.create({url: url});
	}
}
new On();