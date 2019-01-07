var couponSites = [];
var records = [];
var manifest = chrome.runtime.getManifest();
var version = manifest.version;
var extensionName = manifest.name;
var notifs = [],
    notifsInfo = [],
    isdeliverNotifInQueue = 0,
    focusId = 0;
sessionStorage.setItem('lastNotif', 0); // last showed notif time
var isFirstThirty = 1; // Is first thirty seconds of extension load
var userEmail;
setTimeout(function() {
    isFirstThirty = 0;
}, 30000);

getCouponSites();
setPluginExistsCookie();
refreshStorage();

// Firehose
if (typeof AWS !== 'undefined') {

    firehose = new AWS.Firehose({ accessKeyId: 'AKIAIAHQWMHTZ7LNBH4A', secretAccessKey: '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', region: 'us-west-2' });

}

// GA
loadAnalyticsScript();

ga('create', 'UA-86031452-2', 'auto');
ga('set', 'checkProtocolTask', function() {});
ga('send', 'pageview', 'loaded');

/*============================================
        Chrome Event handlers
=============================================*/

var senderIds = ["63619779726"];

chrome.runtime.onInstalled.addListener(firstTimeRegistration);
chrome.runtime.onStartup.addListener(firstTimeRegistration);

// Query bonusapp.com cookies to get/set uid
chrome.cookies.get({ url: "https://www.bonusapp.com", name: "uid" }, function(cookie) {

    var hasToSetCookie = 0;

    // Cookie doen't exist (in case of first ever visit or cookie got deleted offline or cookie got deleted while extension is disabled)
    if (cookie == null) {
        initializeUid();
        var hasToSetCookie = 1;
    } else {
        // Cookie exists but uid in localStorage doesn't exist
        if (localStorage.uid == undefined) {
            localStorage.setItem('uid', cookie.value);
        }
        // Cookie exists but not the same as uid in localStorage
        if (cookie.value !== localStorage.uid) {
            var hasToSetCookie = 1;
        }
    }

    var setFrosttyCookiePromise = setFrosttyCookie(hasToSetCookie);

    chrome.runtime.onInstalled.addListener(function(response) {
        if (response.reason == 'install') {
            setFrosttyCookiePromise.then(function(res) {
                chrome.tabs.create({ url: "https://www.bonusapp.com/?welcome=1", active: false });
            });
            saveRecord('Frostty', response.reason);
        } else if (response.reason == 'update') {
            saveRecord(response.previousVersion, response.reason);
        }
    });

});

//On uid cookie change on bonusapp.com, set it back
chrome.cookies.onChanged.addListener(function(changeInfo) {

    if (changeInfo.cause.match(/^(explicit|expired_overwrite|evicted|expired)$/) && changeInfo.removed === true && (changeInfo.cookie.name === 'uid') && changeInfo.cookie.domain === '.bonusapp.com') {
        setFrosttyCookie(1);
    }

});

// If update is available
chrome.runtime.onUpdateAvailable.addListener(function(details) {

    chrome.runtime.reload();

});

//
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    var tabInfo = TabInfo(details.tabId, details.url, details);
}, {urls: ["<all_urls>"]});

// Read any updated/new tab for ecommerce url identification
chrome.tabs.onUpdated.addListener(function(id, changeInfo, tab) {
    var tabObj = new TabInfo(id, tab.url);
    //listens when a new url is entered & the tab is loading & not yet completed.
    if (changeInfo.status === "loading") {
        if (tab.url.search(/[bonusapp|frostty].com\/pricealert\/setpricealert.php/) > -1) {
            renderPageContent(tabObj);
        }
	    if (tabObj.isFilteredDomain && tabObj.isFilteredUrl) {
	        displayPopup(tabObj, false);
	    }
	    if (tabObj.isFilteredDomain) {
	        saveRecord(tabObj.url, 'pageView', tabObj.domain);
	        showDomainSpecificPopup(tabObj);
	    }
    }
    if(changeInfo.status = "complete") {
        tabObj.tabId = tabObj.id;
        tabObj.type = 'main_frame';
        isAdvertisedLink(tabObj, 1).then(function(isAdv){
        });
    }

});

// On browser Action Click
chrome.browserAction.onClicked.addListener(function(tab) {

    var tabObj = new TabInfo(tab.id, tab.url);
    if (tabObj.isFilteredDomain) {
        displayPopup(tabObj, true);
    } else {
        displayPopup(tabObj, true, true);
    }
    saveRecord(tabObj.url, 'click_browseraction', tabObj.domain);

});

// On message from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request._trackEvent && request._trackEvent == "emailCapture") {
        var xhr = new XMLHttpRequest();
        var param = "email=" + request.info1 + "&source=" + request.info2;
        xhr.open("POST", "https://www.bonusapp.com/users/email.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.send(param);
    }

    if(request._trackEvent && request._trackEvent == 'email') {
        localStorage.setItem('ec', 'true');    
    }

    if (request.tabObj)
        var tabObj = request.tabObj;
    else
        var tabObj = new TabInfo(sender.tab.id, sender.tab.url);
    if (request._trackEvent == 'openUrlInBkg') {
        if (toOpenUrl(tabObj.domain)) {
            openNewTab(request._trackEvent, request.url);
        }
    }
    saveRecord(request.url, request._trackEvent, tabObj.domain, request.info1, request.info2);

});

//On uninstall open this url
chrome.runtime.setUninstallURL("https://www.bonusapp.com/bye.php");

//On gcm ping
chrome.gcm.onMessage.addListener(function(info) {
    getNotif("gcm");
});

//focusId is used to display notification when browser is in focus
chrome.windows.onFocusChanged.addListener(function(windowId) {
    focusId = windowId;
    if (focusId !== -1) {
        deliverNotif("onFocusChange");
    } else {
        //        console.log("went out of focus");
    }
});

/* ===============================================================
chrome notification listeners
================================================================= */
chrome.notifications.onClicked.addListener(function(id) {
    var notifUrl = notifsInfo[id];
    var notifCategory = notifsInfo[id + "category"];
    chrome.windows.getCurrent(function(win) {
        if (win === undefined) {
            chrome.windows.create({ url: notifUrl });
        } else {
            chrome.tabs.create({ url: notifUrl });
        }
    });
    saveRecord(notifCategory, 'notif_click', '', notifUrl);
    chrome.notifications.clear(id, function() {});
});

chrome.notifications.onClosed.addListener(function(id, byUser) {
    var notifUrl = notifsInfo[id];
    var notifCategory = notifsInfo[id + "category"];
    if (byUser) {
        saveRecord(notifCategory, 'notif_close', '', notifUrl);
    }
    if (notifsInfo.length > 50) {
        setTimeout(function() {
            notifsInfo = [];
        }, 60000);
    }
});

/* Respond to the user's clicking one of the buttons */
chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    var notifCategory = notifsInfo[notifId + "category"];
    if (btnIdx === 0) {
        var notifUrl = notifsInfo[notifId + "buttonUrl1"];
        saveRecord(notifCategory, 'notif_click_button1', '', notifUrl);
    } else if (btnIdx === 1) {
        var notifUrl = notifsInfo[notifId + "buttonUrl2"];
        saveRecord(notifCategory, 'notif_click_button2', '', notifUrl);
    }
    chrome.windows.getCurrent(function(win) {
        if (win === undefined) {
            chrome.windows.create({ url: notifUrl });
        } else {
            chrome.tabs.create({ url: notifUrl });
        }
    });
});

/*=============================================
        Utility Functions
==============================================*/

// Object with tab related information
function TabInfo(id, url, details='') {

    urlInfo = checkUrl(url);
    var TabInfoJson = {
        id: id,
        url: url,
        isFilteredDomain: urlInfo.domainCheck,
        isFilteredUrl: urlInfo.filterCheck,
        store: urlInfo.store,
        domain: urlInfo.domain,
        domainExtractedWithCode: urlInfo.domainExtractedWithCode,
        isAdvertiserLink: urlInfo.isAdvertiserLink,
        advertisedRecently: isAdvertisedRecently(urlInfo.domain, urlInfo.isAdvertiserLink, urlInfo.domainCheck, urlInfo.domainExtractedWithCode, url),
        isShowRecentViewedDomain: urlInfo.isShowRecentViewedDomain
    }
    isAdvertisedLink(details);
    return TabInfoJson;

}

// Fetch coupon sites from backend server
function getCouponSites() {

    var xhr = new XMLHttpRequest();
    var param = "uid=" + localStorage.uid + "&version=" + version + "&extName=" + extensionName + "&ec=" + localStorage.ec;
    xhr.open("POST", extConfig.domainName + "/data/fetchcs.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.send(param);

    xhr.onload = function() {
        var response = xhr.responseText;
        if (xhr.status == 200 && xhr.readyState == 4) {
            localStorage.setItem('couponSites', response);
            couponSites = JSON.parse(response);
        } else {
            couponSites = JSON.parse(localStorage.getItem('couponSites'));
        }
    };

    xhr.onerror = function(err) {
        couponSites = JSON.parse(localStorage.getItem('couponSites'));
    };

}

// Check if url belongs to coupon site
function checkUrl(url) {

    var urlDomain = getDomainName(url);
    var urlInfo = {
        domainCheck: false,
        filterCheck: false,
        store: domain,
        domain: urlDomain,
        domainExtractedWithCode: urlDomain,
        isAdvertiserLink: false,
        isShowRecentViewedDomain: false
    };

    for (var domain in couponSites.sites) {
        var searchForString = "." + couponSites.sites[domain].store;
        if (url.indexOf(searchForString) != -1 || urlInfo.domain == couponSites.sites[domain].store) {
            urlInfo.domainCheck = true;
            urlInfo.store = couponSites.sites[domain].store;
            urlInfo.domain = domain;
            urlInfo.isShowRecentViewedDomain = couponSites.sites[domain].rv_domain;
            var filters = couponSites.sites[domain].filters;
            if (filters) {
                for (j = 0; j < filters.length; j++) {
                    if (url.search(filters[j]) != -1) {
                        urlInfo.filterCheck = true;
                    }
                }
            }
        }
    }

    for (var id in couponSites.advertiserLinks) {
        if (url.toLowerCase().match(couponSites.advertiserLinks[id].toLowerCase())) {
            urlInfo.isAdvertiserLink = true;
        }
    }

    return urlInfo;

}

function toOpenUrl(domain) {
    var domainToSet = domain + '_aff';
    var timeAfterLastSet = Math.floor(new Date().getTime() / 1000) - parseInt(localStorage.getItem(domainToSet));
    var timeToShowUrl = couponSites.sites[domain].aff_wait_hours * 60 * 60;
    if (timeAfterLastSet < timeToShowUrl) {
        return false;
    } else {
        localStorage.setItem(domainToSet, Math.floor(new Date().getTime() / 1000));
        return true;
    }
}

// Get domain name from url
function getDomainName(url) {

    var urlParts = url.replace('http://', '').replace('https://', '').split(/[/?#]/);
    var domain = urlParts[0];
    return domain;

}

function displayPopup(tabObj, fromBrowserAction = false, defaultPopup = false) {
	tabObj.tabId = tabObj.id;
	isAdvertisedLink(tabObj).then(function(isAdvertised) {
	    var xhr = new XMLHttpRequest();
	    xhr.open("POST", extConfig.domainName + '/popup/getcontent.php', true);
	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    var param = "url=" + encodeURIComponent(tabObj.url) + "&uid=" + localStorage.uid + "&store=" + tabObj.store + "&domain=" + tabObj.domain + "&fromBrowserAction=" + fromBrowserAction + "&isFilteredUrl=" + tabObj.isFilteredUrl + "&version=" + version + "&defaultPopup=" + defaultPopup + "&advertisedRecently=" + isAdvertised + "&extName=" + extensionName;
	    xhr.send(param);
	
	    xhr.onload = function() {
	        var response = JSON.parse(xhr.responseText);
	        if (response.html != "" && response.html != null) {
	            chrome.tabs.executeScript(tabObj.id, { file: "js/jquery.min.js" }, function() {
	                chrome.tabs.executeScript(tabObj.id, { file: "js/content.js" }, function() {
	                    chrome.tabs.executeScript(tabObj.id, { code: "insertContent('" + encodeURIComponent(response.html).replace(/'/g, "\\'") + "','" + fromBrowserAction + "')" });
	                });
	            });
	        }
	    }
	
	    xhr.onerror = function(err) {
	        console.error('Error in requesting server!');
	    };
	});
}

function renderPageContent(tabObj) {
    getRecentViewedProducts(tabObj).then(function(detailedItems, fromBrowserAction = false) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", extConfig.domainName + '/popup/get_pricealert_content.php', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var param = "url=" + encodeURIComponent(tabObj.url) + "&uid=" + localStorage.uid + "&store=" + tabObj.store + "&domain=" + tabObj.domain + "&fromBrowserAction=" + fromBrowserAction + "&isFilteredUrl=" + tabObj.isFilteredUrl + "&version=" + version + "&advertisedRecently=" + tabObj.advertisedRecently + "&rvProducts=" + JSON.stringify(detailedItems) + "&extName=" + extensionName;
        xhr.send(param);
        xhr.onload = function() {
            var response = JSON.parse(xhr.responseText);
            if (response.html != "" && response.html != null) {
                chrome.tabs.executeScript(tabObj.id, { file: "js/jquery.min.js" }, function() {
                    chrome.tabs.executeScript(tabObj.id, { file: "js/content.js" }, function() {
                        chrome.tabs.executeScript(tabObj.id, { code: "insertContent('" + encodeURIComponent(response.html).replace(/'/g, "\\'") + "','" + fromBrowserAction + "')" });
                    });
                });
            }
        }
        xhr.onerror = function(err) {
            console.error('Error in requesting server!');
        };
    });
}

function saveRecord(url, eventName, info = '', info1 = '', info2 = '') {

    var d = new Date();
    var formatDate = [d.getFullYear(),
        d.getMonth() + 1,
        d.getDate()
    ].join('-') + ' ' + [d.getHours(),
        d.getMinutes(),
        d.getSeconds()
    ].join(':');

    var data = {
        uid: localStorage.uid,
        date: formatDate,
        url: url,
        eventname: eventName,
        info: info
    };

    // Info1 and info2 are extra info parameters. If any of them are set append to data object
    if (info1 != '' || info2 != '') {
        data.info1 = info1;
        data.info2 = info2;
    }

    var record = {
        Data: JSON.stringify(data)
    };

    records.push(record);

    if (records.length > 10) {
        pushToFirehose();
    }

}

function pushToFirehose() {

    if (typeof firehose !== 'undefined') {

        var params = {
            Records: records,
            DeliveryStreamName: 'frostty'
        };
        records = [];

        firehose.putRecordBatch(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            }
        });

    }

}

function openNewTab(eventName, url) {

    console.log("Open affiliate url in new tab");

    chrome.tabs.create({ url: url, active: false }, function(response) {

        tabIdCreated = response.id;
        var intervalToCheck =
            setInterval(function() {
                chrome.tabs.get(tabIdCreated, function(info) {
                    if (info !== undefined) {
                        if (info.status == 'complete') {
                            clearInterval(intervalToCheck);
                            chrome.tabs.remove(tabIdCreated, function() {});
                        }
                    } else {
                        clearInterval(intervalToCheck);
                    }
                });
            }, 15000);

    });

}

function initializeUid() {

    if (localStorage.uid === undefined) {
        var randomNumber = Math.floor(Math.random() * 900) + 100;
        var uid = (new Date).getTime() + '' + randomNumber;
        uid = btoa(uid);
        localStorage.setItem('uid', uid);
    }

}

function setFrosttyCookie(flag) {

    return new Promise(function(resolve, reject) {

        if (flag) {

            var expiryTime = Math.floor(new Date().getTime() / 1000) + 365 * 24 * 60 * 60;

            console.log("Setting cookie to " + localStorage.uid);

            chrome.cookies.set({ url: "https://www.bonusapp.com", name: "uid", value: localStorage.uid, domain: ".bonusapp.com", path: '/', expirationDate: expiryTime }, function(cookie) {
                if (cookie == null) {
                    console.log("cookie not set to " + localStorage.uid);
                    resolve(); // D:Or should it be reject(); ?
                } else {
                    console.log("cookie set to " + localStorage.uid);
                    resolve();
                }
            });

        } else {

            resolve();

        }

    });

}

function setPluginExistsCookie() {

    var weekExpiryTime = Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60;

    chrome.cookies.set({ url: "https://www.bonusapp.com", name: "frosttyid", value: localStorage.uid, domain: ".bonusapp.com", path: '/', expirationDate: weekExpiryTime }, function(cookie) {
        if (cookie == null) {
            console.log("frosttyid cookie not set to " + localStorage.uid);
        } else {
            console.log("frosttyid cookie set to " + localStorage.uid);
        }
    });

}

// GA script
function loadAnalyticsScript() {

    (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

}

function isAdvertisedRecently(domain, isAdvertiserLink, isFilteredDomain, domainExtractedWithCode, url) {
	
    var key = domain + "_alreadyAdvertised";
    var isAdvertised = false;
    if (isFilteredDomain && (domain.search(domainExtractedWithCode)>-1 || domainExtractedWithCode.search(domain)>-1)) {
        if (isAdvertiserLink) {
            localStorage.setItem(key, Math.floor(new Date().getTime() / 1000));
            isAdvertised = true;
            saveRecord(url, 'advertisedUrl', domain);
        } else {
            var timeAfterLastSet = Math.floor(new Date().getTime() / 1000) - parseInt(localStorage.getItem(key));
            var timeToShowUrl = couponSites.sites[domain].aff_wait_hours * 60 * 60;
            if (timeAfterLastSet < timeToShowUrl) {
                isAdvertised = true;
            } else {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                }
            }
        }
    }
    return isAdvertised;

}

function getStorageLocal(key) {
	return new Promise(function(resolve, reject) {
		chrome.storage.local.get(key, function(items){
			resolve(items);
		});
	});
}

function setStorageLocal(value) {
	return new Promise(function(resolve, reject) {
		chrome.storage.local.set(value);
		resolve();
	});
}

function isAdvertisedLink(tabDetails, toUpdate=0) {
	return new Promise(function(resolve, reject) {
//		console.log(tabDetails);
		var advertisedTabs= [];
		getStorageLocal("advTabs").then( function(items){
//			var toUpdate = items[1];
			var toStore = 0;
			var toResolve  = false;
			var advertisedTabs = items['advTabs'];
			if(!advertisedTabs)
				advertisedTabs = [];
			for(var tId in advertisedTabs) {
				var tDetails = advertisedTabs[tId];
				if(tabDetails && tDetails && tDetails.expiresAt > Math.floor(new Date().getTime() / 1000)) {
					if(tDetails.tabId == tabDetails.tabId) {
						if(tDetails.domain == tabDetails.domain) {
							toResolve = true;
						}
						if(toUpdate == 1 && tDetails.domain == 'unknown') {
							advertisedTabs[tId].domain = tabDetails.domain;
							toStore = 1;
						}
					}
				} else {
					if(tDetails && tDetails.expiresAt <= Math.floor(new Date().getTime() / 1000)) {
						delete advertisedTabs[tId];
//						advertisedTabs.splice(tId, 1);
						toStore = 1;
					}
				}
			}
			if(tabDetails && tabDetails.url && tabDetails.tabId && tabDetails.type == 'main_frame') {
				for (var id in couponSites.advertiserLinks) {
			        if (tabDetails.url.toLowerCase().match(couponSites.advertiserLinks[id].toLowerCase())) {
			        	advertisedTabs[tabDetails.tabId]=({'tabId':tabDetails.tabId,expiresAt:Math.floor(new Date().getTime() / 1000)+couponSites.affWaitSec, domain: 'unknown'});
			        	toStore = 1;
			        	break;
			        }
			    }
			}
			if(toStore == 1) {
				setStorageLocal({advTabs:advertisedTabs});
			}
			resolve(toResolve);
		});
	});
}

function showDomainSpecificPopup(tabObj) {
    var url = tabObj.url;
    if (tabObj.isShowRecentViewedDomain == 1) {
        if (couponSites.show_badge == 1) {
            var showRvProds = '';
            if (localStorage.getItem('showRvProds')) {
                var showRvProds = localStorage.getItem('showRvProds');
            }
            chrome.browserAction.setBadgeBackgroundColor({ color: [85, 85, 85, 100] });
            chrome.browserAction.setBadgeText({ tabId: tabObj.id, text: showRvProds });
        }
        var rvRegexArray = couponSites.sites[tabObj.domain].rv_page_regex;
        if (rvRegexArray) {
            for (j = 0; j < rvRegexArray.length; j++) {
                rvRegexArray[j] = new RegExp(rvRegexArray[j]);
                if (url.search(rvRegexArray[j]) != -1) {
                    var matches = url.match(rvRegexArray[j]);
                    var itemId = tabObj.domain + '$rv$' + matches[1];
                    var price = 0;
                    var productDetails = setProductDetails({ itemId: itemId, price: price, url: url, prodKey: itemId, productUrl: url, imageUrl: '', domain: tabObj.domain }, tabObj);
                }
                break;
            }
        } else {
            console.log('not a single page');
        }
        chrome.browserAction.setPopup({ popup: "popup.html", tabId: tabObj.id });
    }

}

function setProductDetails(productObj, tabObj) {
    var xhrn = new XMLHttpRequest();
    xhrn.open("POST", extConfig.domainName + "/popup/aapi.php", true);
    xhrn.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var itemIds = [productObj.itemId];
    var prevDetails = {};
    prevDetails[productObj.itemId] = { 'url': escape(encodeURIComponent(tabObj.url)), 'domain': productObj.itemId.domain };
    var params = "url=" + encodeURIComponent(productObj.url) + "&uid=" + localStorage.uid + "&ids=" + JSON.stringify(itemIds) + "&version=" + version + "&domain=" + tabObj.domain + "&extName=" + extensionName + "&prev_details=" + JSON.stringify(prevDetails);
    xhrn.send(params);
    xhrn.onload = function() {
        var response = JSON.parse(xhrn.responseText);
        var detailedItems = response.detailedItems;
        if (Object.keys(detailedItems).length > 0) {
            var productInfo = detailedItems[productObj.itemId];
            productObj.price = productInfo.lowest_price;
            productObj.imageUrl = productInfo.image_url;
            productObj.title = productInfo.title;
            var idArr = productObj.itemId.split('$rv$');
            if (idArr[1])
                var captureId = idArr[1];
            else
                var captureId = productObj.itemId;
            saveRecord(tabObj.url, 'pagePrice', tabObj.domain, productInfo.lowest_price, captureId);
            saveProductInfoToDb(productObj);
        }
    };
}

function saveProductInfoToDb(productInfo) {
    localStorage.setItem('showRvProds', 1);
    productInfo.timeStamp = (new Date).getTime();
    var db;
    var request = indexedDB.open("userDb", 1);
    request.onupgradeneeded = function(event) {
        var thisDB = event.target.result;

        // Create an objectStore for this database
        if (!thisDB.objectStoreNames.contains("pricedrop")) {
            var objectStore = thisDB.createObjectStore("pricedrop", { autoIncrement: true, keypath: 'prodKey' });
            objectStore.createIndex("prodKey", "prodKey", { unique: true });
            objectStore.createIndex("timeStamp", "timeStamp", { unique: false });
        }
    };
    request.onerror = function(event) {
        // Do something with request.errorCode!
        console.log("error on indexdb open");
    };
    request.onsuccess = function(event) {
        db = event.target.result;
        var transaction = db.transaction(["pricedrop"], "readwrite");
        var store = transaction.objectStore("pricedrop");
        var myIndex = store.index('prodKey');
        var getKeyRequest = myIndex.getKey(productInfo.prodKey);
        getKeyRequest.onsuccess = function(event) {
            var key = getKeyRequest.result;
            if (key === undefined) {
                store.put(productInfo);
            } else {
                store.put(productInfo, key);
            }
        }
        var countRequest = store.count();
        countRequest.onsuccess = function() {
            if (countRequest.result > 40) {
                delCount = countRequest.result - 40;
                store.index("timeStamp").openCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (cursor && delCount > 0) {
                        delCount--;
                        console.log(delCount);
                        store.delete(cursor.primaryKey);
                        cursor.continue();
                    }
                };
            }
        }
    };
}

function firstTimeRegistration() {
    console.log('gcm id registering...');
    chrome.gcm.register(senderIds, function(gcmId) {
        if (localStorage.gcmId !== gcmId)
            storeIds("gcmId", gcmId);
    });
}

function storeIds(idName, idValue) {
    var xhr = new XMLHttpRequest();
    var param = "uid=" + localStorage.uid + "&" + idName + "=" + idValue + "&extName=" + extensionName;
    xhr.open("POST", extConfig.domainName + "/data/store_data.php", true, "user", "");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status == 200 && xhr.readyState == 4) {
            localStorage.setItem(idName, idValue);
        }
    };
    xhr.onerror = function(err) {
        console.error('There was an error in requesting the server to store ids!');
    };
    xhr.send(param);
}

function getNotif(notifPingId) {
    if (notifPingId !== undefined) {
        notifPingId = 1;
    } else {
        notifPingId = 0;
    }
    var xhr = new XMLHttpRequest();
    var param = "uid=" + localStorage.uid + "&gcm=" + notifPingId + "&extName=" + extensionName;

    xhr.open("POST", extConfig.domainName + "/notifications/get_notifications.php", true, "user", "");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        var response = xhr.responseText;
        if (isJsonString(response)) {
            var responseJson = JSON.parse(response);
            saveRecord(responseJson.message, "received_notif", '', response); //Any other parameters to capture??
            notifs.push(response);
            if (focusId !== -1) {
                console.log("browser is in focus");
                deliverNotif();
            } else {
                console.log("browser is not in focus. Wait for it");
            }
        }
    };
    xhr.onerror = function(err) {
        console.error('There was an error in requesting the server for notifications!');
    };
    xhr.send(param);
}

function deliverNotif(onTabUpdate) {
    //    console.log(sessionStorage.lastNotif);
    var timeAfterLastNotif = Math.floor(new Date().getTime() / 1000) - parseInt(sessionStorage.lastNotif);
    if ((timeAfterLastNotif >= 300) && notifs.length > 0 && isFirstThirty == 0 && (focusId !== -1)) {
        console.log("notif in queue. showing it!!");
        remove = notifs.splice(-1, 1);
        var responseJson = JSON.parse(remove);
        currentTime = (new Date).getTime();
        if (responseJson.expire > currentTime) {
            sessionStorage.setItem("lastNotif", Math.floor(new Date().getTime() / 1000));
            if (onTabUpdate !== undefined) {
                setTimeout(function() {
                    pushNotif(responseJson);
                }, 5000);
            } else {
                pushNotif(responseJson);
            }
        } else {
            console.log("notification expired", responseJson.expire, currentTime);
        }
    } else if (timeAfterLastNotif < 300 && isdeliverNotifInQueue == 0 && notifs.length > 0) {
        tryAgainAfter = (300 - timeAfterLastNotif) * 1000;
        console.log("notif recently shown so will be shown after " + tryAgainAfter + " seconds");
        isdeliverNotifInQueue = 1;
        setTimeout(function() {
            //            console.log("retrying after " + tryAgainAfter + " milliseconds");
            deliverNotif();
            isdeliverNotifInQueue = 0;
        }, tryAgainAfter);
    } else if (isFirstThirty == 1 && isdeliverNotifInQueue == 0 && notifs.length > 0) {
        console.log("first 30 seconds so retry creating it after 30 seconds");
        isdeliverNotifInQueue = 1;
        setTimeout(function() {
            console.log("retrying after 30 seconds");
            deliverNotif();
            isdeliverNotifInQueue = 0;
        }, 30000);
    } else if (focusId === -1) {
        //        console.log("browser went out of focus");
    } else if (isdeliverNotifInQueue == 1) {
        //        console.log("delivernotif is already in queue");
    } else {
        //        console.log("no notif in queue");
    }
}


function pushNotif(responseJson) {
    var object = responseJson.object;
    chrome.notifications.create(null, object, function(id) {
        notifsInfo[id] = responseJson.url;
        notifsInfo[id + "category"] = responseJson.message;
        notifsInfo[id + "buttonUrl1"] = responseJson.buttonUrl1;
        notifsInfo[id + "buttonUrl2"] = responseJson.buttonUrl2;
        if (chrome.runtime.lastError) {
            saveRecord(chrome.runtime.lastError.message, "notification_error");
            console.log("Notification create error : " + chrome.runtime.lastError.message);
        } else {
            saveRecord(responseJson.message, "showed_notif");
            console.log("notification created!!");
        }
    });
}

// returns true if parameter-str is json, false otherwise.
function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function getRecentViewedProducts(tabObj) {
    return new Promise(function(resolve, reject) {
        getProductsPricedrop().then(function(items) {
            if (items.length > 0) {
                var itemIds = [];
                var prevDetails = {};
                for (itemKey in items) {
                    itemIds.push(items[itemKey].itemId);
                    prevDetails[items[itemKey].itemId] = items[itemKey];
                    prevDetails[items[itemKey].itemId].productUrl = encodeURIComponent(prevDetails[items[itemKey].itemId].productUrl);
                    prevDetails[items[itemKey].itemId].imageUrl = encodeURIComponent(prevDetails[items[itemKey].itemId].imageUrl);
                    prevDetails[items[itemKey].itemId].title = escape(encodeURIComponent(prevDetails[items[itemKey].itemId].title));
                    prevDetails[items[itemKey].itemId].url = encodeURIComponent(prevDetails[items[itemKey].itemId].url);
                }
                var xhrn = new XMLHttpRequest();
                xhrn.open("POST", extConfig.domainName + "/popup/aapi.php", true);
                xhrn.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                var params = "url=" + encodeURIComponent(tabObj.url) + "&uid=" + localStorage.uid + "&ids=" + JSON.stringify(itemIds) + "&version=" + version + "&domain=" + tabObj.domain + "&extName=" + extensionName + "&prev_details=" + JSON.stringify(prevDetails);
                xhrn.onload = function() {
                    var response = JSON.parse(xhrn.responseText);
                    var detailedItems = response.detailedItems;
                    detailedItems = getDetailedItems(detailedItems, prevDetails);
                    resolve(detailedItems);
                };
                xhrn.onerror = function() {
                    detailedItems = prevDetails;
                    detailedItems = getDetailedItems(detailedItems, prevDetails);
                    resolve(detailedItems);
                };
                xhrn.send(params);
            } else {
                console.log('no items to set alert!!');
                resolve([]);
            }
        });
    });
}

function getDetailedItems(detailedItems, prevDetails) {
    if (Object.keys(detailedItems).length == 0) {
        detailedItems = prevDetails;
    }
    for (itemId in detailedItems) {
        detailedItems[itemId]['title'] = escape(encodeURIComponent(detailedItems[itemId]['title']));
        detailedItems[itemId]['prev_price'] = prevDetails[itemId].price;
        detailedItems[itemId]['product_url'] = encodeURIComponent(prevDetails[itemId].productUrl);
        detailedItems[itemId]['image_url'] = encodeURIComponent(prevDetails[itemId].imageUrl);
        detailedItems[itemId]['productPage'] = escape(encodeURIComponent(detailedItems[itemId]['productPage']));
        detailedItems[itemId]['dateTime'] = Math.floor((new Date().getTime()) - parseInt(prevDetails[itemId].timeStamp)) / (1000 * 60 * 60); //Diff in hours
        detailedItems[itemId]['timeStamp'] = prevDetails[itemId].timeStamp;
        detailedItems[itemId]['url'] = '';
        detailedItems[itemId]['productUrl'] = '';
        detailedItems[itemId]['imageUrl'] = '';
    }
    return detailedItems;
}

function getProductsPricedrop() {
    return new Promise(function(resolve, reject) {
        var db;
        var request = indexedDB.open("userDb", 1);
        request.onupgradeneeded = function(event) {
            var thisDB = event.target.result;

            // Create an objectStore for this database
            if (!thisDB.objectStoreNames.contains("pricedrop")) {
                var objectStore = thisDB.createObjectStore("pricedrop", { autoIncrement: true });
                objectStore.createIndex("prodKey", "prodKey", { unique: true });
                objectStore.createIndex("timeStamp", "timeStamp", { unique: false });
            }
            resolve([]);
        };
        request.onerror = function(event) {
            // Do something with request.errorCode!
            console.log("error on indexdb open");
            reject([]);
        };
        request.onsuccess = function(event) {
            db = event.target.result;
            var transaction = db.transaction(["pricedrop"], "readonly");
            var objectStore = transaction.objectStore("pricedrop");
            var items = [];
            objectStore.index("timeStamp").openCursor(null, "prev").onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    items.push(cursor.value);
                    cursor.continue();
                } else {
                    console.log(items);
                    resolve(items);
                }
            };
        }
    });
}

function refreshStorage() {
	chrome.storage.local.remove("advTabs");
}
