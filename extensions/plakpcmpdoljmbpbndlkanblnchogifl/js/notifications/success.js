	var n = noty({
		layout: 'center',
		theme: 'defaultTheme',
		type: 'success',
		text: chrome.i18n.getMessage("CDC_ADD_SUCCESS"),
		dismissQueue: true, // If you want to use queue feature set this true
		template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
		animation: {
			open: {height: 'toggle'},
			close: {height: 'toggle'},
			easing: 'swing',
			speed: 400 // opening & closing animation speed
		},
		timeout: 2000, // delay for closing event. Set false for sticky notifications
		force: false, // adds notification to the beginning of queue when set to true
		modal: false,
		maxVisible: 1, // you can set max visible notification for dismissQueue true option
		closeWith: ['click'], // ['click', 'button', 'hover']
		callback: {
			onShow: function() {},
			afterShow: function() {},
			onClose: function() {},
			afterClose: function() {}
		},
		buttons: false // an array of buttons
	});