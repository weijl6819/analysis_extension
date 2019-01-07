$(function() {
	chrome.extension.getBackgroundPage().app.get(function(app) {
		$('#options input').on('change', function() {
			var self = $(this);
			var value;

			if(self.is(':checkbox')) {
				value = self.is(':checked');
			} else {
				value = self.val();
			}

			app.userOptions.set(self.attr('name'), value);
		});

		app.userOptions.keys().forEach(function(key) {
			var inp = $('#options input[name="' + key + '"]');
			var value = app.userOptions.get(key);

			if(inp.is(':checkbox')) {
				inp.attr('checked', value);
			} else {
				inp.val(value);
			}
		});
	});
});
