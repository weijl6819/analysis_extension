/** @module devtools.js
 * @copyright 2013-2015 Cardinal Path.  All rights reserved.  The unauthorized use, reproduction, modification or distribution of any or all of this code is expressly prohibited.
 */
chrome.devtools.panels.create("WASP", "img/WASPicon16.png", "panel.html", function(panel) {
	panel.onShown.addListener(function(win) {
		if (!win.WaspUI.viewController) {
			win.WaspUI.initiatePanel(panel);
		}
	});
}); 