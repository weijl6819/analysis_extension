
var LinguaLeoContextMenu = function () {

    return {
        transItemId: null,
        loginItemId: null,
        readabilityItemId: null,

        setItemVisibility: function(itemId, isVisible) {
            chrome.contextMenus.update(itemId, {
                documentUrlPatterns: isVisible ? ['http://*/*', 'https://*/*'] : ["http://item.not.visible/*"]
            });
        },

        /*createLoginItem: function(callback) {
            lingualeo.contextMenu.loginItemId = chrome.contextMenus.create({
                title: kango.i18n.getMessage('login'),
                contexts: ['all'],
                onclick: callback
            });
        },*/

        createTranslationItem: function(callback) {
            lingualeo.contextMenu.transItemId = chrome.contextMenus.create({
                title: kango.i18n.getMessage('contextAddToDict'),
                contexts: ['page', 'frame', 'selection', 'editable'],
                onclick: function(onClickData, tab) {
                    if (/*onClickData.selectionText && */callback) {
                        callback(onClickData.pageUrl, tab.title, tab);
                    }
                }
            });
        },

        /*createReadabilityItem: function(callback) {
            lingualeo.contextMenu.readabilityItemId = chrome.contextMenus.create({
                title: kango.i18n.getMessage('simplifyPage'),
                contexts: ['all'],
                onclick: callback
            });
        },*/

        /*setLoginItemVisibility: function(isVisible) {
            lingualeo.contextMenu.setItemVisibility(lingualeo.contextMenu.loginItemId, isVisible);
        },*/

        setTranslationItemVisibility: function(isVisible) {
            lingualeo.contextMenu.setItemVisibility(lingualeo.contextMenu.transItemId, isVisible);
        }

        /*setReadabilityItemVisibility: function(isVisible) {
            lingualeo.contextMenu.setItemVisibility(lingualeo.contextMenu.readabilityItemId, isVisible);
        },*/

        /*updateTranslationItem: function(textToTranslate) {
            chrome.contextMenus.update(lingualeo.contextMenu.transItemId, {
                title: textToTranslate
                       ? kango.i18n.getMessage('contextAddTextToDict').replace(/\$1/, textToTranslate)
                       : kango.i18n.getMessage('contextAddToDict')
            });
        }*/
    };
};