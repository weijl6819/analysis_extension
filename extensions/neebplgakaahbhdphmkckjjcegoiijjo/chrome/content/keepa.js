var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.checkStringArgs = function(b, h, e) {
  if (null == b) {
    throw new TypeError("The 'this' value for String.prototype." + e + " must not be null or undefined");
  }
  if (h instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + e + " must not be a regular expression");
  }
  return b + "";
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(b, h, e) {
  b != Array.prototype && b != Object.prototype && (b[h] = e.value);
};
$jscomp.getGlobal = function(b) {
  return "undefined" != typeof window && window === b ? b : "undefined" != typeof global && null != global ? global : b;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(b, h, e, w) {
  if (h) {
    e = $jscomp.global;
    b = b.split(".");
    for (w = 0; w < b.length - 1; w++) {
      var r = b[w];
      r in e || (e[r] = {});
      e = e[r];
    }
    b = b[b.length - 1];
    w = e[b];
    h = h(w);
    h != w && null != h && $jscomp.defineProperty(e, b, {configurable:!0, writable:!0, value:h});
  }
};
$jscomp.polyfill("String.prototype.startsWith", function(b) {
  return b ? b : function(b, e) {
    var h = $jscomp.checkStringArgs(this, b, "startsWith");
    b += "";
    var r = h.length, n = b.length;
    e = Math.max(0, Math.min(e | 0, h.length));
    for (var A = 0; A < n && e < r;) {
      if (h[e++] != b[A++]) {
        return !1;
      }
    }
    return A >= n;
  };
}, "es6", "es3");
$jscomp.polyfill("String.prototype.endsWith", function(b) {
  return b ? b : function(b, e) {
    var h = $jscomp.checkStringArgs(this, b, "endsWith");
    b += "";
    void 0 === e && (e = h.length);
    e = Math.max(0, Math.min(e | 0, h.length));
    for (var r = b.length; 0 < r && 0 < e;) {
      if (h[--e] != b[--r]) {
        return !1;
      }
    }
    return 0 >= r;
  };
}, "es6", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.Symbol = function() {
  var b = 0;
  return function(h) {
    return $jscomp.SYMBOL_PREFIX + (h || "") + b++;
  };
}();
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var b = $jscomp.global.Symbol.iterator;
  b || (b = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[b] && $jscomp.defineProperty(Array.prototype, b, {configurable:!0, writable:!0, value:function() {
    return $jscomp.arrayIterator(this);
  }});
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(b) {
  var h = 0;
  return $jscomp.iteratorPrototype(function() {
    return h < b.length ? {done:!1, value:b[h++]} : {done:!0};
  });
};
$jscomp.iteratorPrototype = function(b) {
  $jscomp.initSymbolIterator();
  b = {next:b};
  b[$jscomp.global.Symbol.iterator] = function() {
    return this;
  };
  return b;
};
$jscomp.polyfill("Array.from", function(b) {
  return b ? b : function(b, e, w) {
    $jscomp.initSymbolIterator();
    e = null != e ? e : function(b) {
      return b;
    };
    var h = [], n = b[Symbol.iterator];
    if ("function" == typeof n) {
      for (b = n.call(b); !(n = b.next()).done;) {
        h.push(e.call(w, n.value));
      }
    } else {
      n = b.length;
      for (var A = 0; A < n; A++) {
        h.push(e.call(w, b[A]));
      }
    }
    return h;
  };
}, "es6", "es3");
$jscomp.iteratorFromArray = function(b, h) {
  $jscomp.initSymbolIterator();
  b instanceof String && (b += "");
  var e = 0, w = {next:function() {
    if (e < b.length) {
      var r = e++;
      return {value:h(r, b[r]), done:!1};
    }
    w.next = function() {
      return {done:!0, value:void 0};
    };
    return w.next();
  }};
  w[Symbol.iterator] = function() {
    return w;
  };
  return w;
};
$jscomp.polyfill("Array.prototype.entries", function(b) {
  return b ? b : function() {
    return $jscomp.iteratorFromArray(this, function(b, e) {
      return [b, e];
    });
  };
}, "es6", "es3");
(function() {
  var b = window, h = !1, e = "console", w = "clear";
  String.prototype.hashCode = function() {
    var a = 0, c;
    if (0 === this.length) {
      return a;
    }
    var d = 0;
    for (c = this.length; d < c; d++) {
      var b = this.charCodeAt(d);
      a = (a << 5) - a + b;
      a |= 0;
    }
    return a;
  };
  1.2 < Math.random() && (w = e = "c");
  var r = window.opera || -1 < navigator.userAgent.indexOf(" OPR/"), n = -1 < navigator.userAgent.toLowerCase().indexOf("firefox"), A = -1 < navigator.userAgent.toLowerCase().indexOf("edge/"), Y = n ? "firefox" : "chrome", q = !r && !n && !A, K = q ? "keepaChrome" : r ? "keepaOpera" : A ? "keepaEdge" : "keepaFirefox", G = !1;
  try {
    G = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  } catch (a) {
  }
  if (q) {
    try {
      chrome.runtime.sendMessage("hnkcfpcejkafcihlgbojoidoihckciin", {type:"isActive"}, null, function(a) {
        a && a.isActive && (h = !0);
      });
    } catch (a) {
    }
  }
  A && (window.chrome = window.browser);
  var H = {}, O = 0, L = [], M = {}, P = 0;
  if (q || r || n || A) {
    chrome.runtime.onMessage.addListener(function(a, c, d) {
      if (c.tab && c.tab.url || c.url) {
        switch(a.type) {
          case "getStorage":
            a.key && k.get(a.key, function() {
            });
            d({value:window.localStorage});
            break;
          case "getFreshStorage":
            if (1000 < Date.now() - O) {
              return k.iframeWin.postMessage({type:"getAllForKeepaBox"}, "*"), L.push(function() {
                d({value:H});
              }), !0;
            }
            d({value:H});
            break;
          case "setStorage":
            k.set(a.key, a.val);
            d({value:window.localStorage});
            break;
          case "removeStorage":
            k.remove(a.key);
            d({value:window.localStorage});
            break;
          case "getFilters":
            d({value:z.getFilters()});
            break;
          case "sendData":
            a = a.val;
            if (null != a.ratings) {
              if (c = a.ratings, 1000 > P) {
                if ("f1" == a.key) {
                  if (c) {
                    for (var b = c.length; b--;) {
                      var C = c[b];
                      null == C ? c.splice(b, 1) : (C = a.domainId + C.asin, M[C] ? c.splice(b, 1) : (M[C] = 1, P++));
                    }
                    0 < c.length && u.sendPlainMessage(a);
                  }
                } else {
                  u.sendPlainMessage(a);
                }
              } else {
                M = null;
              }
            } else {
              u.sendPlainMessage(a);
            }
            d({});
            break;
          case "log":
            t.quiet || console.log(a.val);
            d({});
            break;
          case "refreshStorage":
            t.refreshSettings();
            d({value:window.localStorage});
            break;
          default:
            d({});
        }
      }
    });
    window.onload = function() {
      var a = document.getElementById("keepa_storage");
      a.src = "https://keepa.com/storageProxy" + (n ? "Firefox" : "") + ".html";
      a.onload = function() {
        document.getElementById("keepa_storage");
        t.register();
      };
    };
    try {
      chrome.browserAction.onClicked.addListener(function(a) {
        chrome.tabs.create({url:"https://keepa.com/#!manage"});
      });
    } catch (a) {
      console.log(a);
    }
  }
  var k = {storage:chrome.storage.local, contextMenu:function() {
    try {
      "Off" === k.storage.contextMenuActive ? chrome.contextMenus.removeAll() : (chrome.contextMenus.create({title:"View products on Keepa", contexts:["page"], documentUrlPatterns:"*://*.amazon.com/* *://*.amzn.com/* *://*.amazon.co.uk/* *://*.amazon.de/* *://*.amazon.fr/* *://*.amazon.it/* *://*.amazon.ca/* *://*.amazon.com.mx/* *://*.amazon.com.au/* *://*.amazon.es/* *://*.amazon.co.jp/* *://*.amazon.in/* *://*.amazon.com.br/*".split(" ")}), chrome.contextMenus.onClicked.addListener(function(a, 
      c) {
        chrome.tabs.sendMessage(c.id, {key:"collectASINs"}, {}, function(a) {
          "undefined" != typeof a && chrome.tabs.create({url:"https://keepa.com/#!viewer/" + encodeURIComponent(JSON.stringify(a))});
        });
      }));
    } catch (a) {
      console.log(a);
    }
  }, addComma:function(a, c) {
    null == c && (c = domain);
    return 5 != c ? (a / 100).toFixed(2) : a.toFixed(0);
  }, formatCurrency:function(a, c, d) {
    if ("" == a) {
      return a;
    }
    a = a.toString().replace(/[$\u20ac\uffe5\u00a3,-]/g, "");
    isNaN(a) && (a = "0");
    a = Math.floor(100 * a + 0.50000000001);
    var b = a % 100;
    a = Math.floor(a / 100).toString();
    10 > b && (b = "0" + b);
    for (var C = 0; C < Math.floor((a.length - (1 + C)) / 3); C++) {
      a = a.substring(0, a.length - (4 * C + 3)) + "," + a.substring(a.length - (4 * C + 3));
    }
    null == d && (d = domain);
    return 5 == d || c ? a : a + "." + b;
  }, log:function(a) {
    t.quiet || console.log(a);
  }, iframeWin:null, operationComplete:!1, init:function() {
    k.iframeWin = document.getElementById("keepa_storage").contentWindow;
    k.iframeWin.postMessage({type:"getAll"}, "*");
    t.convertToStorage();
    var a = null;
    k.get(["token", "hashSynced"], function(c) {
      a = c.token;
      !a && (q || n || A) && (c = chrome.storage.sync, "undefined" == c && (c = chrome.storage.local), "undefined" != c && c.get("KeepaHash", function(d) {
        if (!chrome.runtime.lastError) {
          try {
            var c = d.KeepaHash;
            c && 64 == c.length ? (k.set("token", c), console.log("loaded token from sync")) : k.get({token:t.Guid.newGuid()}, function(c) {
              a = c.token;
            });
          } catch (C) {
            t.reportBug("r9 " + C);
          }
        }
      }));
    });
    chrome.storage.onChanged.addListener(function(a, d) {
      if ("local" == d) {
        for (var c in a) {
          d = a[c], "string" != typeof d.oldValue && (d.oldValue = JSON.stringify(d.oldValue)), "string" != typeof d.newValue && (d.newValue = JSON.stringify(d.newValue)), d.oldValue != d.newValue && k.iframeWin.postMessage({type:"set", key:c, value:d.newValue}, "*");
        }
      }
    });
    window.addEventListener("message", function(a) {
      var d = a.data;
      if (d) {
        if ("string" === typeof d) {
          try {
            d = JSON.parse(d);
          } catch (S) {
            return;
          }
        }
        if (d.log) {
          console.log(d.log);
        } else {
          var c = function() {
          };
          if (a.origin != t.url && a.origin != t.testUrl) {
            var b = z.getMessage();
            if (null != b && ("function" == typeof b.onDone && (c = b.onDone, delete b.onDone), "undefined" == typeof b.sent && d.sandbox && a.source == document.getElementById("keepa_data").contentWindow)) {
              if (d.sandbox == b.url) {
                z.setStatTime(40);
                try {
                  a.source.postMessage({key:"data", value:b}, "*");
                } catch (S) {
                  z.abortJob(407), c();
                }
              } else {
                d.isUrlMsg ? z.abortJob(405) : (b = z.getOutgoingMessage(b, d.sandbox), u.sendMessage(b)), c();
              }
            }
          } else {
            switch(d.type) {
              case "get":
                k.set(d.key, d.value);
                break;
              case "getAllForKeepaBox":
                b = {};
                c = !0;
                for (var e in d.value) {
                  e.startsWith("test_") || (a = d.value[e]) && "null" != a && "" != a && "undefined" != a && (b[e] = a, c = !1);
                }
                if (!c) {
                  for (H = b, O = Date.now(); 0 < L.length;) {
                    if (e = L.pop(), null != e) {
                      e(b);
                    } else {
                      break;
                    }
                  }
                }
                break;
              case "getAll":
                e = d.value;
                c = {};
                a = !0;
                for (b in e) {
                  var h = e[b];
                  h && "null" != h && "" != h && "undefined" != h && (c[b] = h, a = !1);
                }
                a || k.setAll(c);
                break;
              case "update":
                k.get(d.key, function(a) {
                  a[d.key] != d.value && (d.value ? k.set(d.key, d.value) : k.remove(d.key));
                });
            }
          }
        }
      }
    });
    try {
      chrome.notifications.onButtonClicked.addListener(function(b, d) {
        "unvalidInstallSource" == b ? window.open("https://chrome.google.com/webstore/detail/keepacom-price-tracker/neebplgakaahbhdphmkckjjcegoiijjo") : "optPermission" == b ? chrome.runtime.openOptionsPage(function() {
        }) : 0 == d ? window.open(b) : 1 == d && (null != a && 64 == a.length ? window.open("https://keepa.com/r/" + a + "manage") : window.open("https://keepa.com/#manage"));
      });
    } catch (c) {
    }
  }, set:function(a, b, d) {
    var c = {};
    c[a] = b;
    k.storage.set(c, d);
    k.iframeWin.postMessage({type:"set", key:a, value:b}, "*");
    "token" == a && 64 == b.length && (q || n || A) && (a = chrome.storage.sync, "undefined" != a && a.set({KeepaHash:b}, function() {
    }));
  }, remove:function(a, b) {
    k.storage.remove(a, b);
    k.iframeWin.postMessage({type:"remove", key:a}, "*");
  }, get:function(a, b) {
    "function" != typeof b && (b = function() {
    });
    k.storage.get(a, function(d) {
      if ("string" == typeof a && void 0 == d[a]) {
        if (d = t.defaultSettings[a]) {
          k.set(a, d);
          var c = {};
          c[a] = d;
          b(c);
        } else {
          b({});
        }
      } else {
        b(d);
      }
    });
  }, getAll:function(a) {
    k.storage.get(a);
  }, setAll:function(a, b) {
    k.storage.set(a, b);
    void 0 != a.token && 64 == a.token.length && (q || n || A) && (b = chrome.storage.sync, "undefined" != b && b.set({KeepaHash:a.token}, function() {
    }));
  }};
  (q || r || n) && k.contextMenu();
  var t = {quiet:!0, version:"3.30", browser:1, url:"https://keepa.com", testUrl:"https://test.keepa.com", getDomain:function(a) {
    switch(a) {
      case "com":
        return 1;
      case "co.uk":
        return 2;
      case "de":
        return 3;
      case "fr":
        return 4;
      case "co.jp":
        return 5;
      case "ca":
        return 6;
      case "cn":
        return 7;
      case "it":
        return 8;
      case "es":
        return 9;
      case "in":
        return 10;
      case "com.mx":
        return 11;
      case "com.br":
        return 12;
      case "com.au":
        return 13;
      default:
        return 1;
    }
  }, objectStorage:[], Guid:function() {
    var a = function(b, c, e) {
      return b.length >= c ? b : a(e + b, c, e || " ");
    }, b = function() {
      var a = (new Date).getTime();
      return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, function(b) {
        var d = (a + 16 * Math.random()) % 16 | 0;
        a = Math.floor(a / 16);
        return ("x" === b ? d : d & 7 | 8).toString(16);
      });
    };
    return {newGuid:function() {
      var d = "undefined" != typeof window.crypto.getRandomValues;
      if ("undefined" != typeof window.crypto && d) {
        d = new window.Uint16Array(16);
        window.crypto.getRandomValues(d);
        var c = "";
        for (h in d) {
          var e = d[h].toString(16);
          e = a(e, 4, "0");
          c += e;
        }
        var h = c;
      } else {
        h = b();
      }
      return h;
    }};
  }(), convertToStorage:function() {
    chrome.storage.local.get("migrated", function(a) {
      if (void 0 == a.migrated) {
        a = {migrated:1};
        for (var b in localStorage) {
          var d = localStorage[b];
          d && "function" != typeof d && (a[b] = d);
        }
        chrome.storage.local.set(a, function() {
          chrome.runtime.lastError || localStorage.clear();
        });
      }
    });
  }, defaultSettings:{s_merchantChart:"111", s_range:"2160", s_zoom:"0", s_extreme:"0", s_dateFormat:"D, M j G:i", s_percent:"5", s_merchantTrack:"100", s_boxVertical:"200", s_boxHorizontal:"0", s_boxType:"0", s_alerts:"0", s_alertTimer:"900000", extremeFilter:"0", revealStock:"0", optOut_crawl:"0"}, resetSettings:function() {
    console.log("loading default settings.");
    for (var a in t.defaultSettings) {
      k.set(a, t.defaultSettings[a]);
    }
    k.set("install", Date.now());
    k.set("token", t.Guid.newGuid());
  }, settingsArray:"s_merchantChart s_range s_zoom s_extreme s_dateFormat s_percent s_merchantTrack s_boxVertical s_boxHorizontal s_boxType s_alerts s_alertTimer extremeFilter revealStock".split(" "), refreshSettings:function() {
  }, register:function() {
    k.init();
    n ? k.set("addonVersionFirefox", t.version) : k.set("addonVersionChrome", t.version);
    try {
      chrome.runtime.setUninstallURL("https://dyn.keepa.com/app/stats/?type=uninstall&version=" + K + "." + t.version);
    } catch (a) {
    }
    try {
      !r && q && "neebplgakaahbhdphmkckjjcegoiijjo" != chrome.runtime.id && "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && chrome.notifications.create("unvalidInstallSource", {type:"basic", iconUrl:"../../icons/i100.png", title:"Your Keepa installation is not from an official source!", message:"Please uninstall Keepa and reinstall it from the Chrome Web Store", buttons:[{title:"Open Chrome Web Store", iconUrl:"../../icons/i16.png"}], priority:2}, function(a) {
      });
    } catch (a) {
      t.reportBug(a);
    }
    q && setTimeout(function() {
      k.get("noFreshInstall", function(a) {
        if ("undefined" == typeof a.noFreshInstall) {
          try {
            k.set("noFreshInstall", 1), chrome.notifications.create("firstInstall", {type:"basic", iconUrl:"../../icons/i100.png", title:"Hi there and thanks for using Keepa!", message:"This extension does not add any context menus or browser buttons. You can access it directly on any Amazon product page.", priority:2}, function(a) {
            });
          } catch (c) {
            t.reportBug(c);
          }
        }
      });
    }, 3000);
    k.get(["s_merchantChart", "token"], function(a) {
      void 0 != a.s_merchantChart && void 0 != a.token && 64 == a.token.length || t.resetSettings();
    });
    (q || r || n || A) && window.setTimeout(function() {
      u.initWebSocket();
    }, 1000);
  }, unregister:function() {
  }, log:function(a) {
    k.log(a);
  }, lastBugReport:0, reportBug:function(a, b) {
    k.get(["install", "token"], function(d) {
      var c = d.install, e = Date.now();
      if (!(12E5 > e - t.lastBugReport || /(dead object)|(Script error)|(setUninstallURL)|(File error: Corrupted)|(operation is insecure)|(\.location is null)/i.test(a))) {
        t.lastBugReport = e;
        var h = "bug";
        try {
          e = {};
          for (var k in navigator) {
            !navigator.hasOwnProperty(k) || "string" != typeof navigator[k] && "number" != typeof navigator[k] || (e[k] = navigator[k]);
          }
          h = JSON.stringify(e, null, "&emsp;").replace(/(\r\n)|\n/g, "<br>");
        } catch (I) {
        }
        var n = "", u = t.version;
        b = b || "";
        try {
          n = Error().stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
        } catch (I) {
        }
        try {
          n = n.replace(/chrome-extension:\/\/.*?\/content\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
        } catch (I) {
        }
        try {
          n = '<span style="color: #999; font-size: xx-small">' + K + ":" + u + "-" + c + "&emsp;" + n + "</span>";
        } catch (I) {
        }
        if ("object" == typeof a) {
          try {
            a = JSON.stringify(a);
          } catch (I) {
          }
        }
        setTimeout(function() {
          t.httpPost("https://dyn.keepa.com/service/bugreport/?user=" + d.token + "&type=" + Y + "&version=" + u, a + "<br><br>" + n + "<br><br>" + h + "<br>" + b, null, !1);
        }, 50);
      }
    });
  }, httpGet:function(a, b, d) {
    var c = new XMLHttpRequest;
    b && (c.onreadystatechange = function() {
      4 == c.readyState && b.call(this, c.responseText);
    });
    c.withCredentials = d;
    c.open("GET", a, !0);
    c.send();
  }, httpPost:function(a, b, d, e) {
    var c = new XMLHttpRequest;
    d && (c.onreadystatechange = function() {
      4 == c.readyState && d.call(this, c.responseText);
    });
    c.withCredentials = e;
    c.open("POST", a, !0);
    c.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    c.send(b);
  }};
  window.onerror = function(a, b, d, e, h) {
    "object" === typeof a && a.srcElement && a.target && (a = "[object HTMLScriptElement]" == a.srcElement && "[object HTMLScriptElement]" == a.target ? "Error loading script" : "Event Error - target:" + a.target + " srcElement:" + a.srcElement);
    a = a.toString();
    var c = "";
    e = e || 0;
    var k = h.stack;
    if (h && k) {
      c = k;
      try {
        c = k.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;"), c = c.replace(/http|s:\/\/.*?\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
      } catch (S) {
      }
    }
    a = "error: " + a + " url: " + (b || document.location.toString()) + " line: " + parseInt(d || 0) + " col: " + parseInt(e || 0) + " date: " + new Date + " stack: " + c;
    t.reportBug(a);
    return !1;
  };
  var Q = 0;
  if (q || r || n || A) {
    var u = {server:["wss://push.keepa.com", "wss://push2.keepa.com"], serverIndex:0, clearTimeout:0, webSocket:null, sendPlainMessage:function(a) {
      G || (a = JSON.stringify(a), u.webSocket.send(pako.deflate(a)));
    }, sendMessage:function(a) {
      if (!G) {
        z.clearIframe();
        var c = pako.deflate(JSON.stringify(a));
        z.clearMessage();
        u.webSocket.send(c);
        403 == a.status && z.endSession(Q);
        b[e][w]();
      }
    }, initWebSocket:function() {
      G || k.get(["token", "optOut_crawl"], function(a) {
        var b = a.token, d = a.optOut_crawl;
        if (b && 64 == b.length) {
          var e = function() {
            delete localStorage.session;
            if (null == u.webSocket || 1 != u.webSocket.readyState) {
              u.serverIndex %= u.server.length;
              if ("undefined" == typeof d || "undefined" == d || null == d || "null" == d) {
                d = "0";
              }
              h && (d = "1");
              var a = new WebSocket(u.server[u.serverIndex] + "/apps/cloud/?user=" + b + "&app=" + K + "&version=" + t.version + "&optOut=" + d);
              a.binaryType = "arraybuffer";
              a.onmessage = function(a) {
                a = a.data;
                var b = null;
                a instanceof ArrayBuffer && (a = pako.inflate(a, {to:"string"}));
                try {
                  b = JSON.parse(a);
                } catch (S) {
                  t.reportBug(S, a);
                  return;
                }
                108 != b.status && (b.domainId && (Q = b.domainId), z.clearIframe(), z.onMessage(b));
              };
              a.onclose = function(a) {
                setTimeout(function() {
                  e();
                }, 60000 * 6 * Math.random());
              };
              a.onerror = function(b) {
                u.serverIndex++;
                a.close();
              };
              a.onopen = function() {
                z.abortJob(414);
              };
              u.webSocket = a;
            }
          };
          e();
        }
      });
    }};
  }
  if (q || r || n || A) {
    var z = function() {
      function a(a) {
        try {
          m.stats.times.push(a), m.stats.times.push(Date.now() - m.stats.start);
        } catch (g) {
        }
      }
      function c(b, d) {
        b.sent = !0;
        a(25);
        var l = b.key, c = b.messageId;
        b = b.stats;
        try {
          var f = B[E]["session-id"];
        } catch (R) {
          f = "";
        }
        l = {key:l, messageId:c, stats:b, sessionId:f, payload:[], status:200};
        for (var g in d) {
          l[g] = d[g];
        }
        return l;
      }
      function d(b) {
        E = m.domainId;
        T = q(B);
        "object" != typeof B[E] && (B[E] = {});
        "undefined" == typeof m.headers.Accept && (m.headers.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*!/!*;q=0.8");
        k(b, !b.isAjax, function(d) {
          a(0);
          var l = {payload:[]};
          if (d.match(H)) {
            l.status = 403;
          } else {
            if (b.contentFilters && 0 < b.contentFilters.length) {
              for (var g in b.contentFilters) {
                var f = d.match(new RegExp(b.contentFilters[g]));
                if (f) {
                  l.payload[g] = f[1].replace(/\n/g, "");
                } else {
                  l.status = 305;
                  l.payload[g] = d;
                  break;
                }
              }
            } else {
              l.payload = [d];
            }
          }
          try {
            b.stats.times.push(3), b.stats.times.push(t.lastBugReport);
          } catch (y) {
          }
          "undefined" == typeof b.sent && (l = c(b, l), u.sendMessage(l));
        });
      }
      function h(b) {
        E = m.domainId;
        T = q(B);
        "object" != typeof B[E] && (B[E] = {});
        "undefined" == typeof m.headers.Accept && (m.headers.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*!/!*;q=0.8");
        a(4);
        k(b, !b.isAjax, function(d, l) {
          a(6);
          if ("undefined" == typeof b.sent) {
            var g = {};
            try {
              for (var f = d.evaluate("//comment()", d, null, XPathResult.ANY_TYPE, null), e = f.iterateNext(), h = ""; e;) {
                h += e.textContent, e = f.iterateNext();
              }
              if (d.querySelector("body").textContent.match(H) || h.match(H)) {
                g.status = 403;
                if ("undefined" != typeof b.sent) {
                  return;
                }
                g = c(b, g);
                u.sendMessage(g);
                return;
              }
            } catch (F) {
            }
            a(7);
            if (b.scrapeFilters && 0 < b.scrapeFilters.length) {
              var k = {}, m = {}, n = {}, D = "", r = null, w = function() {
                if ("" === D) {
                  g.payload = [r];
                  g.scrapedData = n;
                  for (var a in m) {
                    g[a] = m[a];
                  }
                } else {
                  g.status = 305, g.payload = [r, D, ""];
                }
                try {
                  b.stats.times.push(99), b.stats.times.push(t.lastBugReport);
                } catch (ca) {
                }
                "undefined" == typeof b.sent && (g = c(b, g), u.sendMessage(g));
              }, z = function(a, b, g) {
                var c = [];
                if (!a.selector) {
                  if (!a.regExp) {
                    return D = "invalid selector, sel/regexp", !1;
                  }
                  c = d.querySelector("html").innerHTML.match(new RegExp(a.regExp));
                  if (!c || c.length < a.reGroup) {
                    g = "regexp fail: html - " + a.name + g;
                    if (!1 === a.optional) {
                      return D = g, !1;
                    }
                    r += " // " + g;
                    return !0;
                  }
                  return c[a.reGroup];
                }
                var f = b.querySelectorAll(a.selector);
                0 == f.length && (f = b.querySelectorAll(a.altSelector));
                if (0 == f.length) {
                  if (!0 === a.optional) {
                    return !0;
                  }
                  D = "selector no match: " + a.name + g;
                  return !1;
                }
                if (a.parentSelector && (f = [f[0].parentNode.querySelector(a.parentSelector)], null == f[0])) {
                  if (!0 === a.optional) {
                    return !0;
                  }
                  D = "parent selector no match: " + a.name + g;
                  return !1;
                }
                if ("undefined" != typeof a.multiple && null != a.multiple && (!0 === a.multiple && 1 > f.length || !1 === a.multiple && 1 < f.length)) {
                  g = "selector multiple mismatch: " + a.name + g + " found: " + f.length;
                  if (!1 === a.optional) {
                    return D = g, !1;
                  }
                  r += " // " + g;
                  return !0;
                }
                if (a.isListSelector) {
                  return k[a.name] = f, !0;
                }
                if (!a.attribute) {
                  return D = "selector attribute undefined?: " + a.name + g, !1;
                }
                for (var e in f) {
                  if (f.hasOwnProperty(e)) {
                    b = f[e];
                    if (!b) {
                      break;
                    }
                    if (a.childNode) {
                      a.childNode = Number(a.childNode);
                      b = b.childNodes;
                      if (b.length < a.childNode) {
                        g = "childNodes fail: " + b.length + " - " + a.name + g;
                        if (!1 === a.optional) {
                          return D = g, !1;
                        }
                        r += " // " + g;
                        return !0;
                      }
                      b = b[a.childNode];
                    }
                    b = "text" == a.attribute ? b.textContent : "html" == a.attribute ? b.innerHTML : b.getAttribute(a.attribute);
                    if (!b || 0 == b.length || 0 == b.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
                      g = "selector attribute null: " + a.name + g;
                      if (!1 === a.optional) {
                        return D = g, !1;
                      }
                      r += " // " + g;
                      return !0;
                    }
                    if (a.regExp) {
                      var l = b.match(new RegExp(a.regExp));
                      if (!l || l.length < a.reGroup) {
                        g = "regexp fail: " + b + " - " + a.name + g;
                        if (!1 === a.optional) {
                          return D = g, !1;
                        }
                        r += " // " + g;
                        return !0;
                      }
                      c.push("undefined" == typeof l[a.reGroup] ? l[0] : l[a.reGroup]);
                    } else {
                      c.push(b);
                    }
                    if (!a.multiple) {
                      break;
                    }
                  }
                }
                return a.multiple ? c : c[0];
              };
              e = !1;
              f = {};
              for (var q in b.scrapeFilters) {
                f.pageType = q;
                a: {
                  if (e) {
                    break;
                  }
                  f.pageFilter = b.scrapeFilters[f.pageType];
                  f.pageVersionTest = f.pageFilter.pageVersionTest;
                  h = d.querySelectorAll(f.pageVersionTest.selector);
                  0 == h.length && (h = d.querySelectorAll(f.pageVersionTest.altSelector));
                  if (0 != h.length) {
                    if ("undefined" != typeof f.pageVersionTest.multiple && null != f.pageVersionTest.multiple) {
                      if (!0 === f.pageVersionTest.multiple && 2 > h.length) {
                        break a;
                      }
                      if (!1 === f.pageVersionTest.multiple && 1 < h.length) {
                        break a;
                      }
                    }
                    if (f.pageVersionTest.attribute) {
                      var B = null;
                      B = "text" == f.pageVersionTest.attribute ? "" : h[0].getAttribute(f.pageVersionTest.attribute);
                      if (null == B) {
                        break a;
                      }
                    }
                    var C = f.pageType;
                    f.revealMAP = f.pageFilter.revealMAP;
                    f.revealed = !1;
                    f.afterAjaxFinished = function(c) {
                      return function() {
                        var f = 0, l = [], e = 500, h = [], D = !1;
                        a(26);
                        var p = {}, t;
                        for (t in c.pageFilter) {
                          p.sel = c.pageFilter[t];
                          if (!(p.sel.name == c.pageVersionTest.name || c.revealed && "revealMAP" == p.sel.name)) {
                            var u = d;
                            if (p.sel.parentList) {
                              var v = [];
                              if ("undefined" != typeof k[p.sel.parentList]) {
                                v = k[p.sel.parentList];
                              } else {
                                if (!0 === z(c.pageFilter[p.sel.parentList], u, c.pageType)) {
                                  v = k[p.sel.parentList];
                                } else {
                                  break;
                                }
                              }
                              m[p.sel.parentList] || (m[p.sel.parentList] = []);
                              u = 0;
                              p.appendedHTMLOnce = !1;
                              var y = {}, F;
                              for (F in v) {
                                if (v.hasOwnProperty(F)) {
                                  if ("stock" == p.sel.name) {
                                    u++;
                                    try {
                                      var x = void 0, q = void 0;
                                      p.sel.selector && (x = v[F].querySelector(p.sel.selector));
                                      p.sel.altSelector && (q = v[F].querySelector(p.sel.altSelector));
                                      q && (q = q.getAttribute(p.sel.attribute));
                                      if (x && q) {
                                        var B = x.querySelector('input[type="submit"]'), C = document.createElement("input");
                                        C.name = B.getAttribute("name");
                                        C.value = B.getAttribute("value");
                                        var R = document.createElement("input");
                                        R.type = "hidden";
                                        var V = p.sel.regExp.split(";");
                                        R.name = V[0];
                                        R.value = V[1];
                                        h.push(q);
                                        x.appendChild(R);
                                        x.appendChild(C);
                                        var E = Array.from((new FormData(x)).entries());
                                        y.postData = [];
                                        for (q = 0; q < E.length; q++) {
                                          var N = E[q];
                                          null != N && 2 == N.length && ("mbbq" == N[0] && (N[1] = 0), y.postData.push(N[0] + "=" + encodeURIComponent(N[1])));
                                        }
                                        y.postData = y.postData.join("&").replace(/%20/g, "+");
                                        y.url = "https://" + (new URL(b.url)).hostname + x.getAttribute("action");
                                        e = p.sel.reGroup;
                                        l.push(function(a, c) {
                                          return function() {
                                            var d = 0 == l.length;
                                            f++;
                                            var e = new XMLHttpRequest, k = !1, v = function() {
                                              k = !0;
                                              0 == --f && 0 == l.length ? w() : 0 < l.length && l.shift()();
                                            }, y = setTimeout(v, 4000), p = function(c) {
                                              for (var f = 0; f < h.length; f++) {
                                                var l = h[f];
                                                try {
                                                  var e = 0;
                                                  a: for (; e < m[a.sel.parentList].length; e++) {
                                                    var k = -1, v = m[a.sel.parentList][e];
                                                    if (!(v[a.sel.name] >= k)) {
                                                      for (var p in v) {
                                                        if (v[p] == l) {
                                                          var y = JSON.parse(a.sel.childNode);
                                                          y[0] = y[0].replace("[ID]", l);
                                                          var n = c.match(new RegExp(y[0]));
                                                          if (n && !(2 > n.length)) {
                                                            var q = n[1].match(new RegExp(y[1]));
                                                            q && 2 == n.length && (k = q[1], !v[a.sel.name] || v[a.sel.name] < k) && (m[a.sel.parentList][e][a.sel.name] = k);
                                                            break a;
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                } catch (ea) {
                                                  try {
                                                    a.appendedHTMLOnce || (a.appendedHTMLOnce = !0, g.payload || (g.payload = [""]), null == g.payload[0] && (g.payload[0] = ""), g.payload[0] += " // toofast", b.dbg2 && g.payload.push(c));
                                                  } catch (fa) {
                                                  }
                                                }
                                              }
                                              !D && 0 < c.indexOf(a.sel.parentSelector) && (D = !0);
                                              return !d;
                                            };
                                            e.onreadystatechange = function() {
                                              k || 4 != e.readyState || (clearTimeout(y), 200 == e.status && !p(e.responseText) && D && (f++, A(c.url, "GET", null, 4000, function(a) {
                                                p(a);
                                                0 == --f && 0 == l.length && w();
                                              })), 0 == --f && 0 == l.length && w());
                                            };
                                            e.onerror = v;
                                            e.open("POST", c.url, !0);
                                            e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                            e.send(c.postData);
                                          };
                                        }(p, y));
                                      }
                                    } catch (aa) {
                                    }
                                  } else {
                                    if ("revealMAP" == p.sel.name) {
                                      y.revealMAP$33 = p.sel, x = void 0, x = y.revealMAP$33.selector ? v[F].querySelector(y.revealMAP$33.selector) : v[F], null != x && x.textContent.match(new RegExp(y.revealMAP$33.regExp)) && (x = b.url.match(/(B[A-Z0-9]{9}|\d{9}(!?X|\d))/)[1], q = c.pageFilter.sellerId, "undefined" == typeof q || null == q || null == x || 2 > x.length || (q = v[F].querySelector(p.sel.childNode).value, null == q || 20 > q + 0 || (x = y.revealMAP$33.altSelector.replace("OFFERID", 
                                      q).replace("ASINID", x), f++, y.mapIndex = F + "", A(x, "GET", null, 3000, function(a) {
                                        return function(b) {
                                          try {
                                            var g = c.pageFilter.price;
                                            if (g && g.regExp) {
                                              if (b.match(/no valid offer--/)) {
                                                m[a.revealMAP$33.parentList][a.mapIndex] || (m[a.revealMAP$33.parentList][a.mapIndex] = {}), m[a.revealMAP$33.parentList][a.mapIndex][a.revealMAP$33.name] = -1;
                                              } else {
                                                var d = b.match(new RegExp("price info--\x3e(?:.|\\n)*?" + g.regExp + "(?:.|\\n)*?\x3c!--")), e = b.match(/price info--\x3e(?:.|\n)*?(?:<span.*?size-small.*?">)([^]*?<\/span)(?:.|\n)*?\x3c!--/);
                                                if (!d || d.length < g.reGroup) {
                                                  r += " // " + (" priceMAP regexp fail: " + b + " - " + g.name + c.pageType);
                                                } else {
                                                  var h = d[g.reGroup];
                                                  m[a.revealMAP$33.parentList][a.mapIndex] || (m[a.revealMAP$33.parentList][a.mapIndex] = {});
                                                  m[a.revealMAP$33.parentList][a.mapIndex][a.revealMAP$33.name] = h;
                                                  null != e && 2 == e.length && (m[a.revealMAP$33.parentList][a.mapIndex][a.revealMAP$33.name + "Shipping"] = e[1].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                                }
                                              }
                                            }
                                          } catch (da) {
                                          }
                                          0 == --f && 0 == l.length && w();
                                        };
                                      }(y), function() {
                                        0 == --f && 0 == l.length && w();
                                      }))));
                                    } else {
                                      x = z(p.sel, v[F], c.pageType);
                                      if (!1 === x) {
                                        break;
                                      }
                                      if (!0 !== x) {
                                        if (m[p.sel.parentList][F] || (m[p.sel.parentList][F] = {}), p.sel.multiple) {
                                          for (var G in x) {
                                            x.hasOwnProperty(G) && (x[G] = x[G].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                          }
                                          x = x.join("\u271c\u271c");
                                          m[p.sel.parentList][F][p.sel.name] = x;
                                        } else {
                                          m[p.sel.parentList][F][p.sel.name] = x.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                                        }
                                      }
                                    }
                                  }
                                }
                                y = {url:y.url, postData:y.postData, revealMAP$33:y.revealMAP$33, mapIndex:y.mapIndex};
                              }
                            } else {
                              v = z(p.sel, u, c.pageType);
                              if (!1 === v) {
                                break;
                              }
                              if (!0 !== v) {
                                if (p.sel.multiple) {
                                  for (var H in v) {
                                    v.hasOwnProperty(H) && (v[H] = v[H].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                  }
                                  v = v.join();
                                } else {
                                  v = v.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                                }
                                n[p.sel.name] = v;
                              }
                            }
                          }
                          p = {sel:p.sel, appendedHTMLOnce:p.appendedHTMLOnce};
                        }
                        try {
                          if (1 == l.length || (e + "").endsWith("8") && 0 < l.length) {
                            l.shift()();
                          } else {
                            for (p = 0; p < l.length; p++) {
                              setTimeout(function() {
                                0 < l.length && l.shift()();
                              }, p * e);
                            }
                          }
                        } catch (aa) {
                        }
                        0 == f && 0 == l.length && w();
                      };
                    }(f);
                    if (f.revealMAP) {
                      if (e = d.querySelector(f.revealMAP.selector), null != e) {
                        f.url = e.getAttribute(f.revealMAP.attribute);
                        if (null == f.url || 0 == f.url.length) {
                          f.afterAjaxFinished();
                          break;
                        }
                        0 != f.url.indexOf("http") && (e = document.createElement("a"), e.href = b.url, f.url = e.origin + f.url);
                        n[f.revealMAP.name] = "1";
                        f.url = f.url.replace(/(mapPopover.*?)(false)/, "$1true");
                        f.xhr = new XMLHttpRequest;
                        f.hasTimeout = !1;
                        f.ti = setTimeout(function(a) {
                          return function() {
                            a.hasTimeout = !0;
                            a.afterAjaxFinished();
                          };
                        }(f), 4000);
                        f.xhr.onreadystatechange = function(a) {
                          return function() {
                            if (!a.hasTimeout && 4 == a.xhr.readyState) {
                              clearTimeout(a.ti);
                              if (200 == a.xhr.status) {
                                var b = a.xhr.responseText;
                                if (a.revealMAP.regExp) {
                                  var g = b.match(new RegExp(a.revealMAP.regExp));
                                  if (!g || g.length < a.revealMAP.reGroup) {
                                    if (g = d.querySelector(a.revealMAP.selector)) {
                                      var c = g.cloneNode(!1);
                                      c.innerHTML = b;
                                      g.parentNode.replaceChild(c, g);
                                    }
                                  } else {
                                    n[a.revealMAP.name] = g[a.revealMAP.reGroup], n[a.revealMAP.name + "url"] = a.url;
                                  }
                                }
                              }
                              a.revealed = !0;
                              a.afterAjaxFinished();
                            }
                          };
                        }(f);
                        f.xhr.onerror = f.afterAjaxFinished;
                        f.xhr.open("GET", f.url, !0);
                        f.xhr.send();
                      } else {
                        f.afterAjaxFinished();
                      }
                    } else {
                      f.afterAjaxFinished();
                    }
                    e = !0;
                  }
                }
                f = {pageFilter:f.pageFilter, pageVersionTest:f.pageVersionTest, revealed:f.revealed, pageType:f.pageType, hasTimeout:f.hasTimeout, afterAjaxFinished:f.afterAjaxFinished, xhr:f.xhr, ti:f.ti, revealMAP:f.revealMAP, url:f.url};
              }
              a(8);
              if (null == C) {
                D += " // no pageVersion matched";
                g.payload = [r, D, b.dbg1 ? l : ""];
                g.status = 308;
                a(10);
                try {
                  b.stats.times.push(99), b.stats.times.push(t.lastBugReport);
                } catch (F) {
                }
                "undefined" == typeof b.sent && (g = c(b, g), u.sendMessage(g));
              }
            } else {
              a(9), g.status = 306, "undefined" == typeof b.sent && (g = c(b, g), u.sendMessage(g));
            }
          }
        });
      }
      function k(c, g, d) {
        J = c;
        var l = c.messageId;
        setTimeout(function() {
          null != J && J.messageId == l && (J = J = null);
        }, c.timeout);
        c.onDone = function() {
          J = null;
        };
        if (g) {
          a(11), g = document.getElementById("keepa_data"), g.removeAttribute("srcdoc"), g.src = c.url;
        } else {
          if (1 == c.httpMethod && (c.scrapeFilters && 0 < c.scrapeFilters.length && (K = c), !M && (M = !0, c.l && 0 < c.l.length))) {
            for (g = 0; g < c.l.length; g++) {
              var f = c.l[g];
              try {
                for (var h = window, k = 0; k < f.path.length - 1; k++) {
                  h = h[f.path[k]];
                }
                if (f.b) {
                  h[f.path[k]](L[f.index], f.a, f.b);
                } else {
                  h[f.path[k]](L[f.index], f.a);
                }
              } catch (V) {
              }
            }
            b[e][w]();
          }
          A(c.url, O[c.httpMethod], c.postData, c.timeout, function(g) {
            a(12);
            if ("o0" == c.key) {
              d(g);
            } else {
              var f = document.getElementById("keepa_data_2");
              f.src = "";
              g = g.replace(/src=".*?"/g, 'src=""');
              if (null != m) {
                m.block && (g = g.replace(new RegExp(m.block, "g"), ""));
                a(13);
                var l = !1;
                f.srcdoc = g;
                a(18);
                f.onload = function() {
                  a(19);
                  l || (f.onload = void 0, l = !0, a(20), setTimeout(function() {
                    a(21);
                    var b = document.getElementById("keepa_data_2").contentWindow;
                    try {
                      d(b.document, g);
                    } catch (Z) {
                      t.reportBug(Z), I(410);
                    }
                  }, 80));
                };
              }
              b[e][w]();
            }
          });
        }
      }
      function r() {
        try {
          var a = document.getElementById("keepa_data");
          a.src = "";
          a.removeAttribute("srcdoc");
        } catch (D) {
        }
        try {
          var b = document.getElementById("keepa_data_2");
          b.src = "";
          b.removeAttribute("srcdoc");
        } catch (D) {
        }
        J = null;
      }
      function A(b, g, c, d, f) {
        var e = new XMLHttpRequest;
        if (f) {
          var l = !1, h = setTimeout(function() {
            l = !0;
            z.abortJob(413);
          }, d || 15000);
          e.onreadystatechange = function() {
            l || (2 == e.readyState && a(27), 4 == e.readyState && (clearTimeout(h), a(29), 503 != e.status && (0 == e.status || 399 < e.status) ? z.abortJob(415, [e.status]) : 50 > e.responseText.length && g == O[0] ? z.abortJob(416) : f.call(this, e.responseText)));
          };
          e.onerror = function() {
            z.abortJob(408);
          };
        }
        e.open(g, b, !0);
        null == c ? e.send() : e.send(c);
      }
      function q(a) {
        var b = "", c = "", d;
        for (d in a[E]) {
          b += c + d + "=" + a[E][d] + ";", c = " ";
        }
        return b;
      }
      function G(a) {
        delete B["" + a];
        localStorage.cache = pako.deflate(JSON.stringify(B), {to:"string"});
      }
      function I(a, g) {
        if (null != m) {
          if ("undefined" != typeof m.sent) {
            return;
          }
          var d = c(m, {});
          g && (d.payload = g);
          d.status = a;
          u.sendMessage(d);
          r();
        }
        b[e][w]();
      }
      var K = null, m = null, H = /automated access/, L = [function(a) {
        if (!(20 < Q) && null == m && 0 < a.url.indexOf("eywords")) {
          var b = a.url.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|jp|ca|fr|es|it|cn|in|com\.mx|com\.br|com\.au)\/(?:.*?arch\/ajax|s)\/.*?rh=(.*?)(?:$|&)/), c = 0;
          null != b && 3 == b.length ? c = 200 : (b = a.url.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|jp|ca|fr|es|it|cn|in|com\.mx|com\.br|com\.au)\/(?:.*?arch\/ajax|s)\/.*?words=(.*?)(?:$|&)/), null != b && 3 == b.length && (c = 201));
          0 != c && (a = (b[1] + b[2]).hashCode(), W[a] || (W[a] = 1, 20 < ++Q && (W = {}), u.sendPlainMessage({key:"i1", payload:[b[1], b[2]], status:c})));
        }
      }, function(a) {
        if (null != m) {
          var b = !0;
          if (m.url == a.url) {
            U = a.frameId, X = a.tabId, P = a.parentFrameId, b = !1;
          } else {
            if (U == a.parentFrameId || P == a.parentFrameId || U == a.frameId) {
              b = !1;
            }
          }
          if (-2 != U && X == a.tabId) {
            a = a.requestHeaders;
            var c = {};
            (m.timeout + "").endsWith("108") || (m.headers.Cookie = b ? "" : T);
            for (var d in m.headers) {
              b = !1;
              for (var e = 0; e < a.length; ++e) {
                if (a[e].name.toLowerCase() == d.toLowerCase()) {
                  "" == m.headers[d] ? a.splice(e, 1) : a[e].value = m.headers[d];
                  b = !0;
                  break;
                }
              }
              b || "" == m.headers[d] || a.push({name:n ? d.toLowerCase() : d, value:m.headers[d]});
            }
            c.requestHeaders = a;
            return c;
          }
        }
      }, function(a) {
        var b = a.responseHeaders;
        try {
          if (X != a.tabId || null == m) {
            return;
          }
          for (var c = !1, d = 0; d < b.length; ++d) {
            var e = b[d], h = e.name.toLowerCase();
            if ("set-cookie" == h) {
              var k = e.value.substring(0, e.value.indexOf(";")), l = k.indexOf("="), n = [k.substring(0, l), k.substring(l + 1)];
              b.splice(d, 1);
              d--;
              2 != n.length || "undefined" != typeof B[E][n[0]] && B[E][n[0]] == n[1] || (c = !0, B[E][n[0]] = n[1]);
            } else {
              "x-frame-options" == h && (b.splice(d, 1), d--);
            }
          }
          !(m.timeout + "").endsWith("108") && c && m.url == a.url && (localStorage.cache = pako.deflate(JSON.stringify(B), {to:"string"}), T = q(B));
        } catch (ba) {
        }
        return {responseHeaders:b};
      }, function(a) {
        if (null != m && m.url == a.url) {
          var b = 0;
          switch(a.error) {
            case "net::ERR_TUNNEL_CONNECTION_FAILED":
              b = 510;
              break;
            case "net::ERR_INSECURE_RESPONSE":
              b = 511;
              break;
            case "net::ERR_CONNECTION_REFUSED":
              b = 512;
              break;
            case "net::ERR_BAD_SSL_CLIENT_AUTH_CERT":
              b = 513;
              break;
            case "net::ERR_CONNECTION_CLOSED":
              b = 514;
              break;
            case "net::ERR_NAME_NOT_RESOLVED":
              b = 515;
              break;
            case "net::ERR_NAME_RESOLUTION_FAILED":
              b = 516;
              break;
            case "net::ERR_ABORTED":
            case "net::ERR_CONNECTION_ABORTED":
              b = 517;
              break;
            case "net::ERR_CONTENT_DECODING_FAILED":
              b = 518;
              break;
            case "net::ERR_NETWORK_ACCESS_DENIED":
              b = 519;
              break;
            case "net::ERR_NETWORK_CHANGED":
              b = 520;
              break;
            case "net::ERR_INCOMPLETE_CHUNKED_ENCODING":
              b = 521;
              break;
            case "net::ERR_CONNECTION_TIMED_OUT":
            case "net::ERR_TIMED_OUT":
              b = 522;
              break;
            case "net::ERR_CONNECTION_RESET":
              b = 523;
              break;
            case "net::ERR_NETWORK_IO_SUSPENDED":
              b = 524;
              break;
            case "net::ERR_EMPTY_RESPONSE":
              b = 525;
              break;
            case "net::ERR_SSL_PROTOCOL_ERROR":
              b = 526;
              break;
            case "net::ERR_ADDRESS_UNREACHABLE":
              b = 527;
              break;
            case "net::ERR_INTERNET_DISCONNECTED":
              b = 528;
              break;
            case "net::ERR_BLOCKED_BY_ADMINISTRATOR":
              b = 529;
              break;
            case "net::ERR_SSL_VERSION_OR_CIPHER_MISMATCH":
              b = 530;
              break;
            case "net::ERR_CONTENT_LENGTH_MISMATCH":
              b = 531;
              break;
            case "net::ERR_PROXY_CONNECTION_FAILED":
              b = 532;
              break;
            default:
              b = 533;
              return;
          }
          setTimeout(function() {
            z.setStatTime(33);
            z.abortJob(b);
          }, 0);
        }
      }], M = !1, J = null, O = ["GET", "HEAD", "POST", "PUT", "DELETE"], B = {}, T = "", E = 1;
      try {
        localStorage.cache && (B = JSON.parse(pako.inflate(localStorage.cache, {to:"string"})));
      } catch (l) {
        setTimeout(function() {
          t.reportBug(l, pako.inflate(localStorage.cache, {to:"string"}));
        }, 2000);
      }
      var U = -2, X = -2, P = -2, W = {}, Q = 0;
      return {onMessage:function(a) {
        switch(a.key) {
          case "o0":
          case "o1":
            m = a, m.stats = {start:Date.now(), times:[]};
        }
        switch(a.key) {
          case "update":
            chrome.runtime.requestUpdateCheck(function(a, b) {
              "update_available" == a && chrome.runtime.reload();
            });
            break;
          case "o0":
            z.clearIframe();
            d(a);
            break;
          case "o1":
            z.clearIframe();
            h(a);
            break;
          case "o2":
            G(a.domainId);
            break;
          case "o3":
            document.location.reload(!1);
        }
      }, clearIframe:r, endSession:G, getOutgoingMessage:c, setStatTime:a, getFilters:function() {
        return K;
      }, getMessage:function() {
        return m;
      }, clearMessage:function() {
        m = null;
      }, abortJob:I};
    }();
  }
})();

