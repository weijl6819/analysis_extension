if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}
if (typeof Object.assign != "function") {
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) {
            "use strict";
            if (target == null) {
                throw new TypeError("Cannot convert undefined or null to object");
            }
            var to = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];
                if (nextSource != null) {
                    for (var nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}
(function () {
    var dom = {
        setStyle: function setStyle(e, obj) {
            for (var p in obj) {
                if (obj.hasOwnProperty(p))
                    e.style[p] = obj[p];
            }
        },
        setAttributes: function setAttributes(e, obj) {
            for (var p in obj) {
                if (obj.hasOwnProperty(p))
                    e.setAttribute(p, obj[p]);
            }
        },
        addListeners: function addListeners(e, obj) {
            for (var p in obj) {
                if (obj.hasOwnProperty(p))
                    e.addEventListener(p, obj[p]);
            }
        },
        addChildren: function addChildren(e, array, doc) {
            if (array) {
                for (var i = 0, len = array.length; i < len; ++i) {
                    e.appendChild(dom.createElement(array[i], doc));
                }
            }
        },
        createElement: function createElement(obj, doc) {
            var e = (doc || document).createElement(obj.n);
            dom.setStyle(e, obj.s);
            dom.setAttributes(e, obj.a);
            if (obj.t) {
                e.appendChild((doc || document).createTextNode(obj.t));
            }
            if (obj.h) {
                e.innerHTML += obj.h;
            }
            if (obj.id) {
                e.setAttribute("id", obj.id);
            }
            dom.addListeners(e, obj.l);
            dom.addChildren(e, obj.c, doc);
            return e;
        }
    };
    function injectWTTAPIContentScript(iframe, urlStr) {
        if (BrowserUtils.isAPIAvailable().tabsExecuteScriptFrameIdSupport) {
            iframe.addEventListener("load", function () {
                chrome.tabs.getCurrent(function (tab) {
                    chrome.webNavigation.getAllFrames({ tabId: tab.id }, function (iFrameDetailsArr) {
                        var iframeDetails = iFrameDetailsArr.find(function (iFrameDetails) { return iFrameDetails.url.replace(/(^\w+:|^)\/\//, "") === urlStr.replace(/(^\w+:|^)\/\//, ""); });
                        if (iframeDetails
                            && iframeDetails.parentFrameId === 0
                            && location.href.indexOf(PageUtils.getNewTabResourceUrl("", "")) === 0) {
                            var injectDetails_1 = {
                                runAt: "document_end",
                                allFrames: false,
                                frameId: iframeDetails.frameId
                            };
                            ["/js/logger.js", "/js/chrome.js", "/js/util.js", "/js/webTooltabAPIProxy.js"]
                                .forEach(function (jsFile) {
                                Object.assign(injectDetails_1, { file: jsFile });
                                chrome.tabs.executeScript(tab.id, injectDetails_1, function () {
                                    if (chrome.runtime.lastError) {
                                        console.log("extension: product: chrome.runtime.lastError = " + chrome.runtime.lastError.message);
                                    }
                                    else {
                                        console.log("extension: product: " + jsFile + " loaded");
                                    }
                                });
                            });
                        }
                    });
                });
            });
        }
        else {
            console.log("extension: product: WTTAPI content script injection is not supported");
        }
    }
    function appendParamsFromResourceUrl(newTabUrl) {
        var paramDelimiter = "?";
        var urlStringSearchIndex = window.location.href.indexOf(paramDelimiter);
        if (urlStringSearchIndex > -1) {
            var nameValues = UrlUtils.parseQueryString(location.href.substr(urlStringSearchIndex + paramDelimiter.length)).nameValues;
            if (nameValues) {
                nameValues.forEach(function (nameValue) {
                    newTabUrl = UrlUtils.appendParamToUrl(newTabUrl, nameValue.encodedName, nameValue.encodedValue || "");
                });
            }
        }
        return newTabUrl;
    }
    function loadWTT(urlStr) {
        if (navigator.onLine) {
            var ifr = document.getElementById("wtt-frame");
            ifr.setAttribute("src", urlStr);
            injectWTTAPIContentScript(ifr, urlStr);
        }
        else {
            document.body.removeChild(document.getElementById("wtt-frame"));
            var elem = dom.createElement({
                n: "div",
                s: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    "background-color": "#dddddd",
                    "text-align": "center",
                    display: "table"
                },
                c: [
                    {
                        n: "div", s: { display: "table-row" },
                        c: [
                            {
                                n: "span",
                                s: {
                                    color: "#535353",
                                    display: "table-cell",
                                    "vertical-align": "bottom",
                                    "font-size": "14pt"
                                },
                                t: "Please connect to the Internet to enable page functionality."
                            }
                        ]
                    },
                    {
                        n: "div", s: { display: "table-row" },
                        c: [
                            {
                                n: "span",
                                s: { display: "table-cell", "vertical-align": "bottom", "padding-bottom": "24px" },
                                c: [
                                    {
                                        n: "span",
                                        s: {
                                            "text-transform": "capitalize",
                                            "text-decoration": "none",
                                            color: "black",
                                            "font-size": "10pt"
                                        },
                                        h: "TM, &reg; + &copy; " + new Date().getFullYear() + " " + "CompanyName"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, document);
            document.body.appendChild(elem);
        }
    }
    var extensionState = new ChromeStorageLocal(chrome.storage.local, "state");
    extensionState.get().then(function (config) {
        var newTabURLWithParamPlaceHolders = config.toolbarData.newTabURL;
        var newTabUrl = appendParamsFromResourceUrl(TextTemplate.parse(newTabURLWithParamPlaceHolders, config.replaceableParams));
        newTabUrl = UrlUtils.appendParamToUrl(newTabUrl, PageUtils.stParamName, PageUtils.stParamValueTab);
        loadWTT(newTabUrl);
    }).catch(function (err) {
        console.log("Unable to get EXTENSION STATE::::", err);
    });
})();
