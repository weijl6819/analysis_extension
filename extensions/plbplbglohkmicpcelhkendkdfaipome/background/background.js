var _gConst = {
    STATUS_NEW: 0,
    STATUS_INPROCESS: 1,
    STATUS_COMPLETE: 2,

    MSG_TYPE_START_SEARCH: 0,
    MSG_TYPE_SEARCH_COMPLETED: 10,

    MSG_TYPE_IMAGE_ADD_START: 20,
    MSG_TYPE_REFIGURE_ADD_START: 21,
    MSG_TYPE_ADD_COMPLETED: 30,

    MSG_TYPE_USER_LOGGED_IN: 40,
    MSG_TYPE_USER_LOGGED_OUT: 50,
    MSG_TYPE_USER_LOGGED_IN_ON_SITE: 41,
    MSG_TYPE_USER_LOGGED_OUT_ON_SITE: 51,
    MSG_TYPE_CHECK_COMPLETED: 60,
    MSG_TYPE_POPUP_OPENED: 70,
    MSG_TYPE_ADD_FIGURE_TO_COLLECTION: 80,
    MSG_TYPE_GET_FOUND_FIGURES: 90,
    MSG_TYPE_BADGE_NA: 100,

    MSG_TYPE_REFIGURE_IMAGES_COLLECTED: 110,
    MSG_TYPE_IS_EXTENSION_INSTALLED: 120,

    MSG_TYPE_SEARCH_OPEN_MARKER: 130,

    POPUP_ERROR_FIG_NOT_PARSED: 'Image was not parsed',
    POPUP_ERROR_FIG_DUPLICATE: 'Image is already selected',

    ERROR_NOT_LOGGED: 'Please log in first.',
    FIGURE_ADDED: 'Figures were successfully added',

    MAX_FIGURES_PER_COLLECTION: 30,

    EXTENSION_DOMAIN: 'https://refigure.org',
    AUTH_COOKIE: 'Authentication',

    PROCESSORS: {
        //predefined parsers
        '*://journals.plos.org/*': true,
        '*://collections.plos.org/*': true,
        '*://*.elifesciences.org/*': true,
        '*://elifesciences.org/*': true,
        '*://www.ncbi.nlm.nih.gov/pmc/articles/*': true,
        '*://*.figshare.com/*': true,
        '*://figshare.com/*': true,

        //open access
        '*://openjournalsystems.com/*': true,
        '*://www.hindawi.com/*': true,
        '*://www.scielo.br/*': true,
        '*://journals.openedition.org/*': true,
        '*://www.mdpi.com/*': true,
        '*://www.springeropen.com/*': true,
        // '*://onlinelibrary.wiley.com/*': true,
        '*://elpub.ru/*': true,
        '*://www.biomedcentral.com/*': true,
        '*://www.fda.gov/*': true,
        '*://www.nih.gov/*': true,
        '*://www.cancer.gov/*': true,
        '*://www.frontiersin.org/*': true,
        '*://www.authorea.com/*': true,
        '*://sciencematters.io/*': true,
        '*://www.who.int/*': true,
        '*://europepmc.org/*': true,
        '*://www.sitcancer.org/*': true,
        '*://www.immunohorizons.org/*': true,
        '*://www.cdc.gov/mmwr/*': true,
        '*://www.europeangovernance-livingreviews.org/*': true,
        '*://www.jstatsoft.org/*': true,
        '*://genomebiology.biomedcentral.com/*': true,
        '*://msb.embopress.org/*': true,
        '*://www.materialstoday.com/*': true,
        '*://econtheory.org/*': true,
        '*://journals.aps.org/prx/*': true,
        '*://advances.sciencemag.org/*': true,
        '*://wellcomeopenresearch.org/*': true,
        '*://gatesopenresearch.org/*': true,
        '*://www.micropublication.org/*': true,
        '*://www.ijmm.org/*': true,
        '*://www.dovepress.com/*': true,

        //permitted access
        '*://www.degruyter.com/*': 'h4.freeAccess',
        '*://www.sciencedirect.com/*': '.OpenAccessLabel',
        //'*://link.springer.com/*': true,
        //'*://www.atypon.com/*': true,
        //'*://www.ebsco.com/*': true,
        //'*://www.dovepress.com/*': true,
        '*://www.cell.com/*': '.OALabel.OAicon',
        '*://*.onlinelibrary.wiley.com/*': '.open-access',
        '*://www.nature.com/*': 'abbr[title="Open Access"]',
        '*://www.tandfonline.com/*': '.accessIconLocation',
        '*://www.thelancet.com/*': '.OALabel.OAicon',
        '*://academic.oup.com/*': '.icon-availability_open',
        '*://link.springer.com/*': '.open-access',
        '*://journals.sagepub.com/*': '.accessIcon.openAccess'
    }
};

var _gApiURL;

(function () {
    var permissions = chrome.runtime.getManifest().permissions,
        i;
    for (i = 0; i < permissions.length; i++) {
        if (permissions[i].match(/^http/)) {
            _gApiURL = permissions[i].replace(/\*$/, '');
            break;
        }
    }

}());

_gApiURL = _gApiURL || 'https://localhost:8181/api/';

var tabsData = {},
    $user = null;

chrome.storage.local.get('userInfo', function (usr) {
    $user = usr.userInfo;
});

function updateBrowserAction(tab) {
    if (isTabToProceed(tab)) {
        var t = tabsData[tab.id];
        //TODO change icon accordingly status and number of found figures
        if (t && t.contentScriptLoaded) {
            t.badgeText = '';
            if (t.status === _gConst.STATUS_NEW) {
                t.badgeText = '';
            } else if (t.status === _gConst.STATUS_INPROCESS) {
                setTimeout(function () {
                    if (t.badgeText === '') {
                        chrome.browserAction.enable(tab.id);
                        chrome.browserAction.setBadgeText({tabId: tab.id, text: ''});
                        console.log('enable extension after parsing figures timeout');
                    }
                }, 10000);
            } else {
                if (!t.foundFigures || t.foundFigures.length === 0) {
                    // no figures found on the page or an error occurred
                    t.badgeText = '0';
                } else {
                    // found figures on the page
                    t.badgeText = t.foundFigures.length + '/' + t.inMetapublications.length;
                }
            }
            chrome.browserAction.setBadgeText({tabId: tab.id, text: t.badgeText});
        }
    } else {
        // an empty or service tab
        chrome.browserAction.setBadgeText({tabId: tab.id, text: ''});
    }
}

function isTabToProceed(tab) {
    return tab.url && tab.url.indexOf('http') === 0;
}

function startSearchFiguresIfNeed(tab) {
    if (isTabToProceed(tab)) {
        var t = tabsData[tab.id];
        if (t) {
            if ((t.url && t.url !== tab.url) || !t.url) {
                // the tab is just loaded or URL has changed, so start search figures
                t.url = tab.url;
                var _request = {type: _gConst.MSG_TYPE_START_SEARCH};
                getParseStatus(tab.id)
                    .then(function (res) {
                        console.log('Adding figures ON:', res);
                        _request.isFiguresAddable = true;
                    }, function (res) {
                        console.log('Adding figures OFF:', res);
                    })
                    .finally(function () {
                        t.status = _gConst.STATUS_INPROCESS;
                        chrome.tabs.sendMessage(tab.id, _request, function () {
                            t.contentScriptLoaded = true;
                        });
                    });
            }
        }
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (sender.tab && request.type === _gConst.MSG_TYPE_SEARCH_COMPLETED) {
            onParseFiguresComplete(request, sender.tab);
        }
        if (sender.tab && request.type === _gConst.MSG_TYPE_CHECK_COMPLETED) {
            chrome.browserAction.enable(sender.tab.id);
            console.log('enable extension on parsing figures complete message');
            onSearchFiguresComplete(request, sender.tab);
        }
        if (request.type === _gConst.MSG_TYPE_USER_LOGGED_IN) {
            console.log('Signed in as', request.user);
            chrome.storage.local.set({
                userInfo: request.user
            });
            $user = request.user;
        }
        if (request.type === _gConst.MSG_TYPE_USER_LOGGED_OUT) {
            chrome.storage.local.remove('userInfo');
            $user = null;
        }
        if (request.type === _gConst.MSG_TYPE_GET_FOUND_FIGURES) {
            sendResponse({
                // TODO: sometimes it gets TypeError: Cannot read property 'foundFigures' of undefined
                foundFigures: tabsData[request.tabId].foundFigures,
                inMetapublications: tabsData[request.tabId].inMetapublications
            });
        }
        if (request.type === _gConst.MSG_TYPE_BADGE_NA) {
            chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: 'n/a'});
        }
        return true;
    }
);

chrome.runtime.onMessageExternal.addListener(function (request, sender, callback) {
    switch (request.type) {
        case _gConst.MSG_TYPE_USER_LOGGED_IN_ON_SITE:
            console.log('Signed in as', request.user);
            chrome.storage.local.set({
                userInfo: request.user
            });
            $user = request.user;
            break;
        case _gConst.MSG_TYPE_USER_LOGGED_OUT_ON_SITE:
            chrome.storage.local.remove('userInfo');
            $user = null;
            break;
        case _gConst.MSG_TYPE_IS_EXTENSION_INSTALLED:
            callback({success: true});
            break;
    }
});

function onParseFiguresComplete(result, tab) {
    var t = tabsData[tab.id];
    if (t) {
        t.figures = result.figures;
    }
}

function onSearchFiguresComplete(result, tab) {
    var t = tabsData[tab.id];
    if (t) {
        t.status = _gConst.STATUS_COMPLETE;
        t.foundFigures = result.figures;
        t.inMetapublications = result.inMetapublications;
        update(tab.id);
    }
}

function update(tabId) {
    if (tabsData[tabId] && tabsData[tabId].status !== _gConst.STATUS_INPROCESS) {
        chrome.tabs.get(tabId, function (tab) {
            startSearchFiguresIfNeed(tab);
            updateBrowserAction(tab);
        });
    }
}

function createNewTabData(tabId) {
    tabsData[tabId] = {
        status: _gConst.STATUS_NEW,
        url: '',
        figures: [],
        foundFigures: [],
        contentScriptLoaded: false
    };
}

chrome.tabs.onCreated.addListener(function (tab) {
    console.log('created tab', tab.id);
    createNewTabData(tab.id);
    update(tab.id);
});

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
    if (change.status) {
        console.log('updated tab', tabId, tab.id);
        if (change.status === 'complete') {
            if (change.url === undefined) {
                // reload the current page
                createNewTabData(tabId);
            }
            update(tabId);
        } else {
            chrome.browserAction.disable(tabId);
            console.log('disable extension on update, current tab status:', change.status);
        }
    }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log('activated tab', activeInfo);
    update(activeInfo.tabId);
});

chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) {
    console.log('replaced tab', addedTabId, removedTabId);
    var t = tabsData[removedTabId];
    if (t) {
        tabsData[addedTabId] = t;
        delete tabsData[removedTabId];
    }
});

// Ensure the current selected tab is set up.
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    update(tabs[0].id);
});

function getParseStatus(tabId) {
    if ($user && $user.Flags && $user.Flags.UNFILTERED_EXTENSION) {
        return Promise.resolve('privileged user');
    }

    return new Promise(function (resolve, reject) {
        var key = false,
            reg,
            protectedUrls = Object.keys(_gConst.PROCESSORS);

        for (var i = 0; i < protectedUrls.length; i++) {
            reg = new RegExp(escapeRegExp(protectedUrls[i]));
            if (tabsData[tabId].url.match(reg)) {
                key = protectedUrls[i];
                break;
            }
        }
        //url don't match
        if (!key) {
            return reject('url don\'t match');
        }
        //open access
        if (_gConst.PROCESSORS[key] === true) {
            return resolve('permitted unconditionally');
        }
        //otherwise let's find it
        var message = {
            type: _gConst.MSG_TYPE_SEARCH_OPEN_MARKER,
            key: key
        };
        chrome.tabs.sendMessage(tabId, message, function (res) {
            if (res) {
                resolve('open access');
            } else {
                reject('restricted access');
            }
        });

        /**
         * Makes valid regexp string from manifest.content_scripts.matches format
         * @param {String} str
         * @return {*} string for regexp constructor
         */
        function escapeRegExp(str) {
            return str.replace(/[\-\[\]\/{}()+?.\\^$|]/g, '\\$&').replace(/\*/g, '.*');
        }
    });
}
