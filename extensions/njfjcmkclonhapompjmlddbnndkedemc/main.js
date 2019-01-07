function MyExtension() {
	var self = this;
	kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
		self._onCommand();
	});
}

MyExtension.prototype = {

	_onCommand: function() {
		kango.browser.tabs.create({url: 'http://www.radiobells.com/?utm_campaign=chromeextension&utm_source=googlewebstore&utm_medium=toolbar'});
	}
};

var extension = new MyExtension();