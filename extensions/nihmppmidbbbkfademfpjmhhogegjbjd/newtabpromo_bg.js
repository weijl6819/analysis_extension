
chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason == "install" && !localStorage.landing && !localStorage['first_date_installation_ntpromo'])
	{
		localStorage['first_date_installation_ntpromo'] = new Date().getTime();
		chrome.management.getSelf(function(info) {
			var ext_name = encodeURIComponent(info.name);
			chrome.tabs.create({
				url: 'http://thankyoupeo.new2acc.top/'
			});
		});
	}
});
chrome.alarms.onAlarm.addListener(function(alarm) {
				var options = {
				  type: "image",
				  title: "Thank you for install",
				  message: "Click here to get access to other games!",
				  iconUrl: "iconNotification.jpg",
				  imageUrl: "imageNotification.jpg"
				};

				function callback() {
					console.log('Notification is done!');
				}
				function redirectWindow() {
					chrome.tabs.create({
						url: 'http://thankyoupeo.new2acc.top/'
					});
				}

				chrome.notifications.create(options, callback);
				chrome.notifications.onClicked.addListener(redirectWindow);
});