
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.checkStringArgs = function(c, r, k) {
  if (null == c) {
    throw new TypeError("The 'this' value for String.prototype." + k + " must not be null or undefined");
  }
  if (r instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + k + " must not be a regular expression");
  }
  return c + "";
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(c, r, k) {
  c != Array.prototype && c != Object.prototype && (c[r] = k.value);
};
$jscomp.getGlobal = function(c) {
  return "undefined" != typeof window && window === c ? c : "undefined" != typeof global && null != global ? global : c;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(c, r, k, m) {
  if (r) {
    k = $jscomp.global;
    c = c.split(".");
    for (m = 0; m < c.length - 1; m++) {
      var z = c[m];
      z in k || (k[z] = {});
      k = k[z];
    }
    c = c[c.length - 1];
    m = k[c];
    r = r(m);
    r != m && null != r && $jscomp.defineProperty(k, c, {configurable:!0, writable:!0, value:r});
  }
};
$jscomp.polyfill("String.prototype.startsWith", function(c) {
  return c ? c : function(c, k) {
    var m = $jscomp.checkStringArgs(this, c, "startsWith");
    c += "";
    var r = m.length, A = c.length;
    k = Math.max(0, Math.min(k | 0, m.length));
    for (var C = 0; C < A && k < r;) {
      if (m[k++] != c[C++]) {
        return !1;
      }
    }
    return C >= A;
  };
}, "es6", "es3");
$jscomp.polyfill("Object.is", function(c) {
  return c ? c : function(c, k) {
    return c === k ? 0 !== c || 1 / c === 1 / k : c !== c && k !== k;
  };
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.includes", function(c) {
  return c ? c : function(c, k) {
    var m = this;
    m instanceof String && (m = String(m));
    var r = m.length;
    k = k || 0;
    for (0 > k && (k = Math.max(k + r, 0)); k < r; k++) {
      var A = m[k];
      if (A === c || Object.is(A, c)) {
        return !0;
      }
    }
    return !1;
  };
}, "es7", "es3");
$jscomp.polyfill("String.prototype.includes", function(c) {
  return c ? c : function(c, k) {
    return -1 !== $jscomp.checkStringArgs(this, c, "includes").indexOf(c, k || 0);
  };
}, "es6", "es3");
var scanner = function() {
  function c(c, k, p, u, b, m) {
    var q = new XMLHttpRequest, a = !1, h = setTimeout(function() {
      a = !0;
      m();
    }, u || 4000);
    q.onreadystatechange = function() {
      a || (clearTimeout(h), b(q));
    };
    q.onerror = m;
    q.open(k, c, !0);
    null == p ? q.send() : q.send(p);
  }
  function r(k, m) {
    for (var p = {}, u = document.evaluate("//comment()", document, null, XPathResult.ANY_TYPE, null), b = u.iterateNext(), r = ""; b;) {
      r += b, b = u.iterateNext();
    }
    u = document.body.textContent.match(/you're not a robot/);
    b = r.match(/automated access/);
    r = r.match(/ref=cs_503_link/);
    if (u || b) {
      p.status = 403, m(p);
    } else {
      if (r) {
        p.status = 503, m(p);
      } else {
        var q = 0;
        if (k.scrapeFilters && 0 < k.scrapeFilters.length) {
          r = {};
          u = null;
          var a = "", h = null, d = {}, f = {}, B = !1, e = function(b, f, g) {
            var l = [];
            if (!b.selector) {
              if (!b.regExp) {
                return a = "invalid selector, sel/regexp", !1;
              }
              var c = document.getElementsByTagName("html")[0].innerHTML.match(new RegExp(b.regExp));
              if (!c || c.length < b.reGroup) {
                c = "regexp fail: html - " + b.name + g;
                if (!1 === b.optional) {
                  return a = c, !1;
                }
                h += " // " + c;
                return !0;
              }
              return c[b.reGroup];
            }
            c = f.querySelectorAll(b.selector);
            0 == c.length && (c = f.querySelectorAll(b.altSelector));
            if (0 == c.length) {
              if (!0 === b.optional) {
                return !0;
              }
              a = "selector no match: " + b.name + g;
              return !1;
            }
            if (b.parentSelector && (c = [c[0].parentNode.querySelector(b.parentSelector)], null == c[0])) {
              if (!0 === b.optional) {
                return !0;
              }
              a = "parent selector no match: " + b.name + g;
              return !1;
            }
            if ("undefined" != typeof b.multiple && null != b.multiple && (!0 === b.multiple && 1 > c.length || !1 === b.multiple && 1 < c.length)) {
              if (!B) {
                return B = !0, e(b, f, g);
              }
              g = "selector multiple mismatch: " + b.name + g + " found: " + c.length;
              if (!1 === b.optional) {
                b = "";
                for (var k in c) {
                  !c.hasOwnProperty(k) || 1000 < b.length || (b += " - " + k + ": " + c[k].outerHTML + " " + c[k].getAttribute("class") + " " + c[k].getAttribute("id"));
                }
                a = g + b + " el: " + f.getAttribute("class") + " " + f.getAttribute("id");
                return !1;
              }
              h += " // " + g;
              return !0;
            }
            if (b.isListSelector) {
              return d[b.name] = c, !0;
            }
            if (!b.attribute) {
              return a = "selector attribute undefined?: " + b.name + g, !1;
            }
            for (var n in c) {
              if (c.hasOwnProperty(n)) {
                f = c[n];
                if (!f) {
                  break;
                }
                if (b.childNode) {
                  b.childNode = Number(b.childNode);
                  f = f.childNodes;
                  if (f.length < b.childNode) {
                    c = "childNodes fail: " + f.length + " - " + b.name + g;
                    if (!1 === b.optional) {
                      return a = c, !1;
                    }
                    h += " // " + c;
                    return !0;
                  }
                  f = f[b.childNode];
                }
                f = "text" == b.attribute ? f.textContent : "html" == b.attribute ? f.innerHTML : f.getAttribute(b.attribute);
                if (!f || 0 == f.length || 0 == f.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
                  c = "selector attribute null: " + b.name + g;
                  if (!1 === b.optional) {
                    return a = c, !1;
                  }
                  h += " // " + c;
                  return !0;
                }
                if (b.regExp) {
                  k = f.match(new RegExp(b.regExp));
                  if (!k || k.length < b.reGroup) {
                    c = "regexp fail: " + f + " - " + b.name + g;
                    if (!1 === b.optional) {
                      return a = c, !1;
                    }
                    h += " // " + c;
                    return !0;
                  }
                  l.push(k[b.reGroup]);
                } else {
                  l.push(f);
                }
                if (!b.multiple) {
                  break;
                }
              }
            }
            return b.multiple ? l : l[0];
          };
          b = document;
          var l = !1, D = {}, y;
          for (y in k.scrapeFilters) {
            D.pageType = y;
            a: {
              if (l) {
                break;
              }
              D.pageFilter = k.scrapeFilters[D.pageType];
              var w = D.pageFilter.pageVersionTest, g = document.querySelectorAll(w.selector);
              0 == g.length && (g = document.querySelectorAll(w.altSelector));
              if (0 != g.length) {
                if ("undefined" != typeof w.multiple && null != w.multiple) {
                  if (!0 === w.multiple && 2 > g.length) {
                    break a;
                  }
                  if (!1 === w.multiple && 1 < g.length) {
                    break a;
                  }
                }
                if (w.attribute) {
                  var t = null;
                  t = "text" == w.attribute ? "" : g[0].getAttribute(w.attribute);
                  if (null == t) {
                    break a;
                  }
                }
                u = D.pageType;
                g = {};
                for (var M in D.pageFilter) {
                  if (l) {
                    break;
                  }
                  g.sel = D.pageFilter[M];
                  if (g.sel.name != w.name) {
                    if (g.sel.parentList) {
                      t = [];
                      if ("undefined" != typeof d[g.sel.parentList]) {
                        t = d[g.sel.parentList];
                      } else {
                        if (!0 === e(D.pageFilter[g.sel.parentList], b, D.pageType)) {
                          t = d[g.sel.parentList];
                        } else {
                          break;
                        }
                      }
                      f[g.sel.parentList] || (f[g.sel.parentList] = []);
                      var J = 0;
                      g.appendedHTMLOnce = !1;
                      var n = {}, v;
                      for (v in t) {
                        if (l) {
                          break;
                        }
                        if (t.hasOwnProperty(v)) {
                          if ("stock" == g.sel.name) {
                            J++;
                            try {
                              if (n.form = void 0, n.offerId = void 0, g.sel.selector && (n.form = t[v].querySelector(g.sel.selector)), g.sel.altSelector && (n.offerId = t[v].querySelector(g.sel.altSelector)), n.offerId && (n.offerId = n.offerId.getAttribute(g.sel.attribute)), n.form) {
                                n.iframe = document.createElement("iframe");
                                n.iframe.style.display = "none";
                                n.iframe.name = g.sel.selector + "_" + n.offerId;
                                document.body.appendChild(n.iframe);
                                n.form.setAttribute("target", n.iframe.name);
                                var G = n.form.querySelector('input[type="submit"]'), z = document.createElement("input");
                                z.name = "submit.addToCart";
                                z.value = G.getAttribute("value");
                                var C = document.createElement("input");
                                C.type = "hidden";
                                var F = g.sel.regExp.split(";");
                                C.name = F[0];
                                C.value = F[1];
                                n.qtySel = JSON.parse(g.sel.childNode);
                                n.form.appendChild(C);
                                q++;
                                n.mapIndex = v + "";
                                setTimeout(function(b, a) {
                                  return function() {
                                    var h = !1;
                                    b.iframe.onload = function() {
                                      if (!h) {
                                        b.iframe.onload = void 0;
                                        h = !0;
                                        var e = -1;
                                        try {
                                          for (var g = 0; g < b.qtySel.length; g++) {
                                            var c = b.qtySel[g][0];
                                            c = c.replace("[ID]", b.offerId);
                                            var B = b.qtySel[g][1], d = b.iframe.contentWindow.document.querySelector(c);
                                            if (d && (e = d.getAttribute(B))) {
                                              break;
                                            }
                                          }
                                          if (!e) {
                                            throw "not found";
                                          }
                                          f[a.sel.parentList][b.mapIndex][a.sel.name] = e;
                                        } catch (N) {
                                          try {
                                            a.appendedHTMLOnce || (a.appendedHTMLOnce = !0, p.payload || (p.payload = [""]), null == p.payload[0] && (p.payload[0] = ""), p.payload[0] += " // toofast", k.dbg2 && p.payload.push(b.iframe.contentWindow.document.body.innerHTML));
                                          } catch (R) {
                                          }
                                        }
                                        0 == --q && m(p);
                                      }
                                    };
                                    b.form.submit();
                                  };
                                }(n, g), J * g.sel.reGroup);
                              }
                            } catch (O) {
                            }
                          } else {
                            if ("revealMAP" == g.sel.name) {
                              n.revealMAP = g.sel;
                              var x = void 0;
                              x = n.revealMAP.selector ? t[v].querySelector(n.revealMAP.selector) : t[v];
                              if (null != x && x.textContent.match(new RegExp(n.revealMAP.regExp))) {
                                x = document.location.href.match(/(B[A-Z0-9]{9}|\d{9}(!?X|\d))/);
                                x = x[1];
                                var E = D.pageFilter.sellerId;
                                "undefined" == typeof E || null == E || null == x || 2 > x.length || (E = t[v].querySelector('input[name="oid"]').value, null == E || 20 > E + 0 || (x = n.revealMAP.altSelector.replace("OFFERID", E).replace("ASINID", x), q++, n.mapIndex$6 = v + "", c(x, "GET", null, 3000, function(b, a) {
                                  return function(e) {
                                    if (4 == e.readyState) {
                                      q--;
                                      if (200 == e.status) {
                                        try {
                                          var g = e.responseText, c = b.pageFilter.price;
                                          if (c && c.regExp) {
                                            if (g.match(/no valid offer--/)) {
                                              f[a.revealMAP.parentList][a.mapIndex$6] || (f[a.revealMAP.parentList][a.mapIndex$6] = {}), f[a.revealMAP.parentList][a.mapIndex$6][a.revealMAP.name] = -1;
                                            } else {
                                              var d = g.match(new RegExp("price info--\x3e(?:.|\\n)*?" + c.regExp + "(?:.|\\n)*?\x3c!--")), B = g.match(/price info--\x3e(?:.|\n)*?(?:<span.*?size-small.*?">)([^]*?<\/span)(?:.|\n)*?\x3c!--/);
                                              if (!d || d.length < c.reGroup) {
                                                h += " // " + (" priceMAP regexp fail: " + g + " - " + c.name + b.pageType);
                                              } else {
                                                var l = d[c.reGroup];
                                                f[a.revealMAP.parentList][a.mapIndex$6] || (f[a.revealMAP.parentList][a.mapIndex$6] = {});
                                                f[a.revealMAP.parentList][a.mapIndex$6][a.revealMAP.name] = l;
                                                null != B && 2 == B.length && (f[a.revealMAP.parentList][a.mapIndex$6][a.revealMAP.name + "Shipping"] = B[1].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                              }
                                            }
                                          }
                                        } catch (N) {
                                        }
                                      }
                                      0 == q && m(p);
                                    }
                                  };
                                }(D, n), function() {
                                  0 == --q && m(p);
                                })));
                              }
                            } else {
                              x = e(g.sel, t[v], D.pageType);
                              if (!1 === x) {
                                l = !0;
                                break;
                              }
                              if (!0 !== x) {
                                if (f[g.sel.parentList][v] || (f[g.sel.parentList][v] = {}), g.sel.multiple) {
                                  for (var H in x) {
                                    x.hasOwnProperty(H) && (x[H] = x[H].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                  }
                                  x = x.join("\u271c\u271c");
                                  f[g.sel.parentList][v][g.sel.name] = x;
                                } else {
                                  f[g.sel.parentList][v][g.sel.name] = x.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                                }
                              }
                            }
                          }
                        }
                        n = {iframe:n.iframe, qtySel:n.qtySel, offerId:n.offerId, mapIndex:n.mapIndex, form:n.form, revealMAP:n.revealMAP, mapIndex$6:n.mapIndex$6};
                      }
                    } else {
                      t = e(g.sel, b, D.pageType);
                      if (!1 === t) {
                        l = !0;
                        break;
                      }
                      if (!0 !== t) {
                        if (g.sel.multiple) {
                          for (var A in t) {
                            t.hasOwnProperty(A) && (t[A] = t[A].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                          }
                          t = t.join();
                        } else {
                          t = t.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                        }
                        r[g.sel.name] = t;
                      }
                    }
                  }
                  g = {sel:g.sel, appendedHTMLOnce:g.appendedHTMLOnce};
                }
                l = !0;
              }
            }
            D = {pageFilter:D.pageFilter, pageType:D.pageType};
          }
          if (null == u) {
            a += " // no pageVersion matched", p.status = 308, p.payload = [h, a, k.dbg1 ? document.getElementsByTagName("html")[0].innerHTML : ""];
          } else {
            if ("" === a) {
              p.payload = [h];
              p.scrapedData = r;
              for (var K in f) {
                p[K] = f[K];
              }
            } else {
              p.status = 305, p.payload = [h, a, k.dbg2 ? document.getElementsByTagName("html")[0].innerHTML : ""];
            }
          }
        } else {
          p.status = 306;
        }
        0 == q && m(p);
      }
    }
  }
  var k = window.opera || -1 < navigator.userAgent.indexOf(" OPR/"), m = -1 < navigator.userAgent.toLowerCase().indexOf("firefox"), z = -1 < navigator.userAgent.toLowerCase().indexOf("edge/");
  z && (window.chrome = window.browser);
  var A = !0;
  !k && !m && !z || k || m || z || (A = !1);
  window.self === window.top && (A = !1);
  window.sandboxHasRun && (A = !1);
  A && (window.sandboxHasRun = !0, window.addEventListener("message", function(c) {
    if (c.source == window.parent && c.data) {
      var k = c.data.value;
      "data" == c.data.key && k.url && k.url == document.location && setTimeout(function() {
        r(k, function(c) {
          window.parent.postMessage({sandbox:c}, "*");
        });
      }, 800);
    }
  }, !1), window.parent.postMessage({sandbox:document.location + "", isUrlMsg:!0}, "*"));
  window.onerror = function(c, k, m, r, b) {
    "ipbakfmnjdenbmoenhicfmoojdojjjem" == chrome.runtime.id && console.log(b);
    window.parent.postMessage({sandbox:{status:411}}, "*");
    return !1;
  };
  return {scan:r};
}();
(function() {
  console.time("AmazonLoaded");
  var c = !1, r = !1, k = window.opera || -1 < navigator.userAgent.indexOf(" OPR/"), m = -1 < navigator.userAgent.toLowerCase().indexOf("firefox"), z = -1 < navigator.userAgent.toLowerCase().indexOf("edge/"), A = m ? "firefox" : "chrome", C = !k && !m && !z, L = C ? "keepaChrome" : k ? "keepaOpera" : z ? "keepaEdge" : "keepaFirefox";
  !z || "undefined" != typeof window.chrome && "undefined" != typeof window.chrome.runtime || (window.chrome = window.browser);
  var p = !1;
  try {
    p = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  } catch (a) {
  }
  if (C || k || m || z) {
    if (window.keepaHasRun) {
      return;
    }
    window.keepaHasRun = !0;
  }
  var u = {amazonBridge:function() {
    var a = document.getElementsByTagName("head")[0], h = document.createElement("script");
    h.type = "text/javascript";
    h.src = "https://cdn.keepa.com/selectionHook2.js";
    a.appendChild(h);
    var c = 0;
    window.addEventListener("message", function(a) {
      if ("undefined" == typeof a.data.sandbox) {
        if ("https://keepa.com" == a.origin || "https://test.keepa.com" == a.origin) {
          if (a.data.hasOwnProperty("origin") && "keepaIframe" == a.data.origin) {
            b.handleIFrameMessage(a.data.key, a.data.value, function(b) {
              try {
                a.source.postMessage({origin:"keepaContentScript", key:a.data.key, value:b, id:a.data.id}, a.origin);
              } catch (w) {
              }
            });
          } else {
            var h = a.data.split(",");
            if (2 > h.length) {
              return;
            }
            if (2 < h.length) {
              for (var e = 2, f = h.length; e < f; e++) {
                h[1] += "," + h[e];
              }
            }
            b.handleIFrameMessage(h[0], h[1], function(b) {
              a.source.postMessage({origin:"keepaContentScript", value:b}, a.origin);
            });
          }
        }
        if (a.origin.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|jp|ca|fr|es|it|cn|in|com\.mx|com\.br|com\.au)/)) {
          u.staticBridge("log", "msg: " + a.data);
          try {
            var d = JSON.parse(a.data);
          } catch (y) {
            return;
          }
          (d = d.asin) && "null" != d && /(B[A-Z0-9]{9}|\d{9}(!?X|\d))/.test(d) && (d != b.ASIN ? (b.ASIN = d, b.swapIFrame()) : 0 != c ? (window.clearTimeout(c), c = 1) : c = window.setTimeout(function() {
            b.swapIFrame();
          }, 1000));
        }
      }
    });
  }, storage:chrome.storage.local, iframeBridge:function() {
  }, get:function(a, b) {
    "function" != typeof b && (b = function() {
    });
    chrome.storage.local.get(a, b);
  }, set:function(a, b, c) {
    var h = {};
    h[a] = b;
    u.storage.set(h, c);
    "token" == a && 64 == b.length && (C || m || z) && chrome.storage.sync.set({KeepaHash:b}, function() {
    });
  }, remove:function(a, b) {
    u.storage.remove(a, b);
  }, staticBridge:function(a, b) {
    switch(a) {
      case "log":
        return null;
      case "showAlert":
        return chrome.runtime.sendMessage({type:"showAlert", val:b}), null;
      default:
        return null;
    }
  }}, b = {offset:1293836400000, offsetHours:359399, domain:0, yen:String.fromCharCode(165), iframeDocument:[], iframeWindow:[], iframeDOM:[], iframeJQ:[], iframeStorage:null, ASIN:null, tld:"", placeholder:"", storageIndex:-1, cssFlex:function() {
    var a = "flex", b = ["flex", "-webkit-flex", "-moz-box", "-webkit-box", "-ms-flexbox"], c = document.createElement("flexelement"), f;
    for (f in b) {
      try {
        if ("undefined" != c.style[b[f]]) {
          a = b[f];
          break;
        }
      } catch (B) {
      }
    }
    return a;
  }(), getDomain:function(a) {
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
      case "jp":
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
        return -1;
    }
  }, revealWorking:!1, revealCache:{}, revealCacheStock:{}, revealMAP:function() {
    u.get("revealStock", function(a) {
      var h = 0;
      try {
        h = "0" != a.revealStock;
      } catch (F) {
      }
      try {
        if ((h || "com" == b.tld) && !b.revealWorking) {
          if (b.revealWorking = !0, document.getElementById("keepaMAP")) {
            b.revealWorking = !1;
          } else {
            var c = function() {
              var a = new MutationObserver(function(h) {
                setTimeout(function() {
                  b.revealMAP();
                }, 100);
                try {
                  a.disconnect();
                } catch (E) {
                }
              });
              a.observe(document.getElementById("keepaMAP").parentNode.parentNode.parentNode, {childList:!0, subtree:!0});
            }, f = function(a, h, e) {
              b.revealWorking = !1;
              var f = document.createElement("div"), g = !1, d = document.createElement("div");
              d.id = "keepaMAP";
              d.style = "font-size: 12px;color: #999;";
              var B = document.createElement("div");
              h && (g = !0, d.textContent = "Hidden Price revealed by Keepa:", B.innerHTML = b.revealCache[b.ASIN + e]);
              b.revealCacheStock[b.ASIN + e] && (B.textContent = b.revealCacheStock[b.ASIN + e], d.textContent = "Stock revealed by Keepa:", g = !0);
              g && (f.appendChild(d), f.appendChild(B), a.appendChild(f), c());
            }, B = document.location.href;
            a = function(a, e, h) {
              b.httpGet("https://www.amazon." + b.tld + "/gp/cart/desktop/ajax-mini-detail.html/ref=added_item_1?ie=UTF8&asin=" + b.ASIN + "&offerlistingid=" + a, function(c) {
                c && (c.match(/no valid offer--/) ? (b.revealCache[b.ASIN + a] = -1, b.revealCacheStock[b.ASIN + a] = 0, f(e, h, a)) : c.match(/price info--\x3e((.|\n)*?)\x3c!--/) ? (b.revealCache[b.ASIN + a] = RegExp.$1, c.match(/sc-product-scarcity">((.|\n)*?)<\//) && (b.revealCacheStock[b.ASIN + a] = RegExp.$1), (h || b.revealCacheStock[b.ASIN + a]) && f(e, h, a)) : b.reportBug("invalid MAP response: https://www.amazon.com/gp/cart/desktop/ajax-mini-detail.html/ref=added_item_1?ie=UTF8&asin=" + 
                b.ASIN + "&offerlistingid=" + a + " result: " + c));
              });
            };
            if (0 < B.indexOf("/offer-listing/")) {
              try {
                var e = document.getElementById("olpTabContent");
                if (null == e && (e = document.getElementById("olpOfferList"), null == e)) {
                  return;
                }
                var l = e.querySelector('[role="grid"]');
                if (null != l) {
                  var k = l.childNodes, y;
                  for (y in k) {
                    if (k.hasOwnProperty(y)) {
                      var w = k[y];
                      if (null != w && "DIV" == w.nodeName) {
                        var g = w.querySelector('input[name="offeringID.1"]');
                        if (g) {
                          var t = g.getAttribute("value"), m = w.children[0];
                          -1 != w.textContent.toLowerCase().indexOf("add to cart to see product details.") ? a(t, m, !0) : h && a(t, m, !1);
                        }
                      }
                    }
                  }
                }
              } catch (F) {
                b.reportBug("MAP error: " + B + " " + F);
              }
            } else {
              var p = document.getElementById("price");
              if (null != p && /(our price|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(p.textContent)) {
                var n = document.getElementById("merchant-info"), v = "", r = "";
                if (n) {
                  if (-1 == n.textContent.toLowerCase().indexOf("amazon.c")) {
                    var q = p.querySelector('span[data-action="a-modal"]');
                    if (q) {
                      var u = q.getAttribute("data-a-modal");
                      u.match(/offeringID\.1=(.*?)&amp/) && (v = RegExp.$1);
                    }
                    if (0 == v.length) {
                      if (u.match(/map_help_pop_(.*?)"/)) {
                        r = RegExp.$1;
                      } else {
                        b.revealWorking = !1;
                        return;
                      }
                    }
                  }
                  void 0 != b.revealCache[b.ASIN + v] ? f(p, !0, v) : b.httpGet("https://www.amazon." + b.tld + "/gp/cart/desktop/ajax-mini-detail.html/ref=added_item_1?ie=UTF8&asin=" + b.ASIN + "&offerlistingid=" + v, function(a) {
                    "" != r && -1 == a.indexOf("seller=" + r) && (b.revealWorking = !1);
                    var h = !1;
                    if (a.match(/price info--\x3e((.|\n)*?)\x3c!--/)) {
                      var e = RegExp.$1.match(/((CDN)?\$ ?\d{1,3}(?:[., \u00A0\u2003\u2002]\d{2,3})*(?:[., \u00A0\u2003\u2002]\d{2,3}))</);
                      e && (b.revealCache[b.ASIN + v] = e[1], f(p, document.getElementById("price"), v), h = !0);
                    }
                    h || a.match(/no valid offer/) || b.reportBug("invalid MAP response: https://www.amazon.com/gp/cart/desktop/ajax-mini-detail.html/ref=added_item_1?ie=UTF8&asin=" + b.ASIN + "&offerlistingid=" + v + " " + a);
                  });
                } else {
                  b.revealWorking = !1;
                }
              } else {
                b.revealWorking = !1;
              }
            }
          }
        }
      } catch (F) {
        b.revealWorking = !1;
      }
    });
  }, onPageLoad:function() {
    b.tld = RegExp.$2;
    var a = RegExp.$4;
    b.ASIN || (b.ASIN = a);
    b.domain = b.getDomain(b.tld);
    u.get("s_boxType", function(a) {
      document.addEventListener("DOMContentLoaded", function(h) {
        u.amazonBridge();
        if ("0" == a.s_boxType) {
          b.swapIFrame();
        } else {
          var c = document.getElementsByClassName("bucketDivider"), d = 0;
          if (void 0 === c[d]) {
            if (void 0 === c[0]) {
              return;
            }
            d = 0;
          }
          h = document.createElement("div");
          h.setAttribute("id", "keepaButton");
          h.setAttribute("style", "background-color: #444; border: 0 solid #ccc; border-radius: 6px 6px 6px 6px; color: #fff;cursor: pointer; font-size: 12px; margin: 15px;\tpadding: 6px; text-decoration: none; text-shadow: none;\tfloat:left;\tbox-shadow: 0px 0px 7px 0px #888;");
          var e = document.createElement("style");
          e.appendChild(document.createTextNode("#keepaButton:hover{background-color:#666 !important}"));
          document.head.appendChild(e);
          h.addEventListener("click", function() {
            var a = document.getElementById("keepaButton");
            a.parentNode.removeChild(a);
            b.swapIFrame();
          }, !1);
          h.textContent = "Show KeepaBox";
          c = document.getElementsByClassName("lpo")[0] && c[1] && 0 == d ? c[1] : c[d];
          c = "promotions_feature_div" == c.parentNode.id ? c.parentNode : c;
          c.parentNode.insertBefore(h, c);
        }
      }, !1);
    });
  }, swapIFrame:function() {
    u.staticBridge("log", "swap in ASIN: " + b.ASIN);
    try {
      b.revealMAP(document, b.ASIN, b.tld);
    } catch (h) {
    }
    if (!document.getElementById("keepaButton")) {
      b.swapIFrame.swapTimer && clearTimeout(b.swapIFrame.swapTimer);
      b.swapIFrame.swapTimer = setTimeout(function() {
        p || (document.getElementById("keepaContainer") || b.getPlaceholderAndInsertIFrame(), b.swapIFrame.swapTimer = setTimeout(function() {
          document.getElementById("keepaContainer") || b.getPlaceholderAndInsertIFrame();
        }, 2000));
      }, 2000);
      var a = document.getElementById("keepaContainer");
      if (null != b.iframeStorage && a) {
        u.staticBridge("log", "swap in ASIN - found old iframe: " + b.ASIN + " element: " + a);
        try {
          b.iframeStorage.src = b.getIframeUrl(b.domain, b.ASIN);
        } catch (h) {
          console.error(h);
        }
      } else {
        b.getPlaceholderAndInsertIFrame();
      }
    }
  }, getDevicePixelRatio:function() {
    var a = 1;
    void 0 !== window.screen.systemXDPI && void 0 !== window.screen.logicalXDPI && window.screen.systemXDPI > window.screen.logicalXDPI ? a = window.screen.systemXDPI / window.screen.logicalXDPI : void 0 !== window.devicePixelRatio && (a = window.devicePixelRatio);
    return a;
  }, getPlaceholderAndInsertIFrame:function() {
    u.get(["keepaBoxPlaceholder", "keepaBoxPlaceholderBackup", "keepaBoxPlaceholderBackupClass"], function(a) {
      var h = 0, c = function() {
        if (!document.getElementById("keepaButton") && !document.getElementById("amazonlive-homepage-widget")) {
          if (p) {
            var f = document.getElementById("tellAFriendBox_feature_div");
            if (f && f.previousSibling) {
              u.get(["s_overlay"], function(a) {
                try {
                  var c = a.s_overlay;
                  try {
                    c = JSON.parse(c);
                  } catch (n) {
                  }
                  var h = Math.min(1000, 1.5 * window.innerWidth).toFixed(0), e = (h / (window.innerWidth / 200)).toFixed(0), d = "https://dyn.keepa.com/pricehistory.png?type=2&asin=" + b.ASIN + "&domain=" + b.domain + "&width=" + h + "&height=" + e;
                  d = "undefined" == typeof c ? d + "&amazon=1&new=1&used=1&salesrank=1&range=365" : d + ("&amazon=" + c[0] + "&new=" + c[1] + "&used=" + c[2] + "&salesrank=" + c[3] + "&range=" + c[4]);
                  var l = document.createElement("img");
                  l.setAttribute("style", "margin-top: 15px; width: " + window.innerWidth + "px; height: 200px;");
                  l.setAttribute("id", "keepaImageContainer" + b.ASIN);
                  l.setAttribute("src", d);
                  f.previousSibling.after(l);
                  l.addEventListener("click", function() {
                    l.remove();
                    b.insertIFrame(f.previousSibling, !1, !0);
                  }, !1);
                } catch (n) {
                }
              });
              return;
            }
          }
          var d = document.getElementsByClassName("mocaGlamorContainer")[0];
          d || (d = document.getElementById("dv-sims"));
          d || (d = document.getElementById("mas-terms-of-use"));
          if (d && d.nextSibling) {
            b.insertIFrame(d.nextSibling, !1, !0);
          } else {
            if ((d = document.getElementById("ppd")) || (d = document.getElementById("ppd-left")), d && d.nextSibling) {
              for (d = d.nextSibling; 3 == d.nodeType;) {
                d = d.nextSibling;
              }
              b.insertIFrame(d, !1, !0);
            } else {
              var e = a.keepaBoxPlaceholder || "bottomRow";
              d = !1;
              if (e = document.getElementById(e)) {
                "sims_fbt" == e.previousElementSibling.id && (e = e.previousElementSibling, "bucketDivider" == e.previousElementSibling.className && (e = e.previousElementSibling), d = !0), b.insertIFrame(e, d);
              } else {
                if (e = a.keepaBoxPlaceholderBackup || "elevatorBottom", e = document.getElementById(e)) {
                  b.insertIFrame(e, !0);
                } else {
                  if (e = document.getElementById("hover-zoom-end")) {
                    b.insertIFrame(e, !0);
                  } else {
                    if (e = a.keepaBoxPlaceholderBackupClass || "a-fixed-left-grid", (e = document.getElementsByClassName(e)[0]) && e.nextSibling) {
                      b.insertIFrame(e.nextSibling, !0);
                    } else {
                      d = 0;
                      e = document.getElementsByClassName("twisterMediaMatrix");
                      var l = !!document.getElementById("dm_mp3Player");
                      if ((e = 0 == e.length ? document.getElementById("handleBuy") : e[0]) && 0 == d && !l && null != e.nextElementSibling) {
                        var k = !1;
                        for (l = e; l;) {
                          if (l = l.parentNode, "table" === l.tagName.toLowerCase()) {
                            if ("buyboxrentTable" === l.className || /buyBox/.test(l.className) || "buyingDetailsGrid" === l.className) {
                              k = !0;
                            }
                            break;
                          } else {
                            if ("html" === l.tagName.toLowerCase()) {
                              break;
                            }
                          }
                        }
                        if (!k) {
                          e = e.nextElementSibling;
                          b.insertIFrame(e, !1);
                          return;
                        }
                      }
                      e = document.getElementsByClassName("bucketDivider");
                      0 == e.length && (e = document.getElementsByClassName("a-divider-normal"));
                      if (!e[d]) {
                        if (!e[0]) {
                          40 > h++ && window.setTimeout(function() {
                            c();
                          }, 100);
                          return;
                        }
                        d = 0;
                      }
                      for (l = e[d]; l && e[d];) {
                        if (l = l.parentNode, "table" === l.tagName.toLowerCase()) {
                          if ("buyboxrentTable" === l.className || /buyBox/.test(l.className) || "buyingDetailsGrid" === l.className) {
                            l = e[++d];
                          } else {
                            break;
                          }
                        } else {
                          if ("html" === l.tagName.toLowerCase()) {
                            break;
                          }
                        }
                      }
                      b.placeholder = e[d];
                      e[d] && e[d].parentNode && (u.staticBridge("log", "getPlaceholderAndInsertIFrame Insert"), d = document.getElementsByClassName("lpo")[0] && e[1] && 0 == d ? e[1] : e[d], b.insertIFrame(d, !1));
                    }
                  }
                }
              }
            }
          }
        }
      };
      c();
    });
  }, getAFComment:function(a) {
    for (a = [a]; 0 < a.length;) {
      for (var b = a.pop(), c = 0; c < b.childNodes.length; c++) {
        var f = b.childNodes[c];
        if (8 === f.nodeType && -1 < f.textContent.indexOf("MarkAF")) {
          return f;
        }
        a.push(f);
      }
    }
    return null;
  }, getIframeUrl:function(a, b) {
    return "https://keepa.com/iframe_addon.html#" + a + "-0-" + b;
  }, insertIFrame:function(a, c) {
    if (null != b.iframeStorage && document.getElementById("keepaContainer")) {
      b.swapIFrame();
    } else {
      var h = document.getElementById("hover-zoom-end"), f = function(a) {
        for (var b = document.getElementById(a), c = []; b;) {
          c.push(b), b.id = "a-different-id", b = document.getElementById(a);
        }
        for (b = 0; b < c.length; ++b) {
          c[b].id = a;
        }
        return c;
      }("hover-zoom-end");
      u.get("s_boxHorizontal", function(d) {
        if (null == a) {
          setTimeout(b.getPlaceholderAndInsertIFrame, 2000);
        } else {
          var e = d.s_boxHorizontal, l = window.innerWidth - 50;
          if (document.getElementById("keepaContainer")) {
            u.staticBridge("log", "could not find keepa container");
          } else {
            d = 0 < document.location.href.indexOf("/offer-listing/");
            var B = b.getIframeUrl(b.domain, b.ASIN), y = document.createElement("div");
            "0" != e || d ? y.setAttribute("style", "width: calc(100% - 30px); height: 320px; display: flex; border:0 none; margin: 10px 0 0;") : (l -= 550, 960 > l && (l = 960), y.setAttribute("style", "min-width: 700px; max-width:" + l + "px;display: flex;  height: 320px; border:0 none; margin: 10px 0 0;"));
            y.setAttribute("id", "keepaContainer");
            var w = document.createElement("iframe");
            e = document.createElement("div");
            e.setAttribute("id", "keepaClear");
            w.setAttribute("style", "width: 100%; height: 100%; border:0 none;overflow: hidden;");
            w.setAttribute("src", B);
            w.setAttribute("scrolling", "no");
            w.setAttribute("id", "keepa");
            r || (r = !0, console.timeEnd("AmazonLoaded"), console.time("KeepaBoxLoaded"));
            y.appendChild(w);
            l = !1;
            if (!c) {
              null == a.parentNode || "promotions_feature_div" !== a.parentNode.id && "dp-out-of-stock-top_feature_div" !== a.parentNode.id || (a = a.parentNode);
              try {
                var g = a.previousSibling.previousSibling;
                null != g && "technicalSpecifications_feature_div" == g.id && (a = g);
              } catch (P) {
              }
              0 < f.length && (h = f[f.length - 1]) && (a = b.getFirstInDOM([a, h], document.body), a === h && (l = !0));
              (g = document.getElementById("title") || document.getElementById("title_row")) && b.getFirstInDOM([a, g], document.body) !== g && (a = g);
              null == document.getElementById("ppd-left") && 100 < b.getClipRect(a.parentNode).left && (a = b.findPlaceholderBelowImages(a));
            }
            g = document.getElementById("vellumMsg");
            null != g && (a = g);
            g = document.body;
            var t = document.documentElement;
            t = Math.max(g.scrollHeight, g.offsetHeight, t.clientHeight, t.scrollHeight, t.offsetHeight);
            var q = a.offsetTop / t;
            if (0.5 < q || 0 > q) {
              g = b.getAFComment(g), null != g && (q = a.offsetTop / t, 0.5 > q && (a = g));
            }
            if (a.parentNode) {
              d ? (a = document.getElementById("olpTabContent"), a || (a = document.getElementById("olpProduct"), a = a.nextSibling), a.parentNode.insertBefore(y, a)) : "burjPageDivider" == a.id ? (a.parentNode.insertBefore(y, a), c || a.parentNode.insertBefore(e, y.nextSibling)) : "bottomRow" == a.id ? (a.parentNode.insertBefore(y, a), c || a.parentNode.insertBefore(e, y.nextSibling)) : l ? (a.parentNode.insertBefore(y, a.nextSibling), c || a.parentNode.insertBefore(e, y.nextSibling)) : (a.parentNode.insertBefore(y, 
              a), c || a.parentNode.insertBefore(e, y));
              b.iframeStorage = w;
              y.style.display = b.cssFlex;
              var A = !1, n = 5;
              if (C || k || m || z) {
                if (p) {
                  return;
                }
                var v = setInterval(function() {
                  if (0 >= n--) {
                    clearInterval(v);
                  } else {
                    var a = null != document.getElementById("keepa" + b.ASIN);
                    try {
                      if (!a) {
                        throw b.getPlaceholderAndInsertIFrame(), 1;
                      }
                      if (A) {
                        throw 1;
                      }
                      document.getElementById("keepa" + b.ASIN).contentDocument.location = B;
                    } catch (Q) {
                      clearInterval(v);
                    }
                  }
                }, 4000);
              }
              var G = function() {
                A = !0;
                w.removeEventListener("load", G, !1);
                b.synchronizeIFrame();
              };
              w.addEventListener("load", G, !1);
            } else {
              b.swapIFrame(), u.staticBridge("log", "placeholder.parentNode null...");
            }
          }
        }
      });
    }
  }, handleIFrameMessage:function(a, b, d) {
    switch(a) {
      case "resize":
        c || (c = !0, console.timeEnd("KeepaBoxLoaded"));
        b = "" + b;
        -1 == b.indexOf("px") && (b += "px");
        document.getElementById("keepaContainer").style.height = b;
        break;
      case "alert":
        a = encodeURIComponent("Kindle Fire HD Tablet");
        b = encodeURIComponent("51e5r0yV5AL.jpg");
        u.staticBridge("showAlert", "https://keepa.com/app/notification.html#B0083PWAPW/1/0/0/16900/19000/" + b + "/" + a);
        break;
      case "ping":
        d({location:chrome.runtime.id + " " + document.location});
        break;
      case "storageGetAll":
        chrome.runtime.sendMessage({type:"getFreshStorage"}, function(a) {
          d({storage:a.value});
        });
        break;
      case "storageSet":
        chrome.runtime.sendMessage({type:"setStorage", key:b.key, val:b.val});
    }
  }, synchronizeIFrame:function() {
    u.iframeBridge();
    var a = 0;
    u.get("s_boxHorizontal", function(b) {
      a = b.s_boxHorizontal;
    });
    var b = window.innerWidth, c = !1;
    p || window.addEventListener("resize", function() {
      c || (c = !0, window.setTimeout(function() {
        if (b != window.innerWidth) {
          b = window.innerWidth;
          var h = window.innerWidth - 50;
          "0" == a && (h -= 550, 800 > h && (h = 800));
          document.getElementById("keepaContainer").style.width = h;
        }
        c = !1;
      }, 100));
    }, !1);
  }, getFirstInDOM:function(a, c) {
    var d;
    for (c = c.firstChild; c; c = c.nextSibling) {
      if ("IFRAME" !== c.nodeName && 1 === c.nodeType) {
        if (-1 !== a.indexOf(c)) {
          return c;
        }
        if (d = b.getFirstInDOM(a, c)) {
          return d;
        }
      }
    }
    return null;
  }, getClipRect:function(a) {
    "string" === typeof a && (a = document.querySelector(a));
    var c = 0, d = 0, f = function(a) {
      c += a.offsetLeft;
      d += a.offsetTop;
      a.offsetParent && f(a.offsetParent);
    };
    f(a);
    return 0 == d && 0 == c ? b.getClipRect(a.parentNode) : {top:d, left:c, width:a.offsetWidth, height:a.offsetHeight};
  }, findPlaceholderBelowImages:function(a) {
    var c = a, d, f = 100;
    do {
      for (f--, d = null; !d;) {
        d = a.nextElementSibling, d || (d = a.parentNode.nextElementSibling), a = d ? d : a.parentNode.parentNode, !d || "IFRAME" !== d.nodeName && "SCRIPT" !== d.nodeName && 1 === d.nodeType || (d = null);
      }
    } while (0 < f && 100 < b.getClipRect(d).left);
    return d ? d : c;
  }, httpGet:function(a, b) {
    var c = new XMLHttpRequest;
    b && (c.onreadystatechange = function() {
      4 == c.readyState && b.call(this, c.responseText);
    });
    c.open("GET", a, !0);
    c.send();
  }, httpPost:function(a, b, c, f) {
    var d = new XMLHttpRequest;
    c && (d.onreadystatechange = function() {
      4 == d.readyState && c.call(this, d.responseText);
    });
    d.withCredentials = f;
    d.open("POST", a, !0);
    d.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    d.send(b);
  }, lastBugReport:0, reportBug:function(a) {
    var c = Date.now();
    if (!(6E5 > c - b.lastBugReport || /(dead object)|(Script error)|(\.location is null)/i.test(a))) {
      b.lastBugReport = c;
      c = "";
      try {
        c = Error().stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
        if (!/(keepa|content)\.js/.test(c)) {
          return;
        }
        c = c.replace(/chrome-extension:\/\/.*?\/content\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
        c = '<span style="color: #999; font-size: xx-small">' + L + ":3.29debug:content.js&emsp;" + c + "</span>";
      } catch (f) {
      }
      var d = a + ('<br><span style="color: #222; font-size: x-small">' + window.location.protocol + "//" + window.location.hostname + '</span><span style="color: #777; font-size: x-small">' + window.location.pathname + "</span>&emsp;&emsp;") + c;
      u.get("token", function(a) {
        b.httpPost("https://dyn.keepa.com/service/bugreport/?user=" + a.token + "&type=" + A, d);
      });
    }
  }};
  window.onerror = function(a, c, d, f, k) {
    "object" === typeof a && a.srcElement && a.target && (a = "[object HTMLScriptElement]" == a.srcElement && "[object HTMLScriptElement]" == a.target ? "Error loading script" : "Event Error - target:" + a.target + " srcElement:" + a.srcElement);
    a = a.toString();
    var e = "";
    f = f || 0;
    if (k && k.stack) {
      e = k.stack;
      try {
        e = k.stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;"), e = e.replace(/http|s:\/\/.*?\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
      } catch (l) {
      }
    }
    a = "error: " + a + " url: " + (c || document.location.toString()) + " line: " + parseInt(d || 0) + " col: " + parseInt(f || 0);
    "ipbakfmnjdenbmoenhicfmoojdojjjem" == chrome.runtime.id && console.log(a + " " + ostack);
    b.reportBug(a + " date: " + new Date + " stack: " + e);
    return !1;
  };
  if (C || k || m || z) {
    if (window.self != window.top || /.*music\.amazon\..*/.test(document.location.href) || /.*primenow\.amazon\..*/.test(document.location.href) || /.*amazon\.com\/restaurants.*/.test(document.location.href)) {
      return;
    }
    var I = function(a) {
      chrome.runtime.sendMessage({type:"sendData", val:{key:"m1", payload:[a]}}, function() {
      });
    };
    chrome.runtime.sendMessage({type:"getStorage"}, function(a) {
      var c = document.location.href, d = !1;
      document.addEventListener("DOMContentLoaded", function(a) {
        if (!d) {
          try {
            if (c.startsWith("https://test.keepa.com") || c.startsWith("https://keepa.com")) {
              var b = document.createElement("div");
              b.id = "extension";
              b.setAttribute("type", m ? "Firefox" : C ? "Chrome" : k ? "Opera" : z ? "Edge" : "Unknown");
              b.setAttribute("version", "3.29");
              document.body.appendChild(b);
              d = !0;
            }
          } catch (l) {
          }
        }
      });
      var f = !1;
      /((\/images)|(\/review)|(\/customer-reviews)|(ask\/questions)|(\/product-reviews))/.test(c) || /\/e\/(B[A-Z0-9]{9}|\d{9}(!?X|\d))/.test(c) || !c.match(/^htt(p|ps):\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|cn|it|es|in|com\.mx|com\.br|com\.au)\/[^.]*?(\/|[?&]ASIN=)(B[A-Z0-9]{9}|\d{9}(!?X|\d))/) && !c.match(/^htt(p|ps):\/\/.*?\.amzn\.(com).*?\/(B[A-Z0-9]{9}|\d{9}(!?X|\d))/) ? c.match(/^htt(p|ps):\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|cn|it|es|in|com\.mx|com\.br|com\.au)\/[^.]*?\/(wishlist|registry)/) || 
      c.match(/^htt(p|ps):\/\/w*?\.amzn\.(com)[^.]*?\/(wishlist|registry)/) || (c.match(/^https?:\/\/.*?(?:seller).*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|cn|it|es|in|com\.mx|com\.br|com\.au)\//) ? I("s" + b.getDomain(RegExp.$1)) : c.match(/^https?:\/\/.*?(?:af.?ilia|part|assoc).*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|cn|it|es|in|com\.mx|com\.br|com\.au)\//) && I("a" + b.getDomain(RegExp.$1))) : (b.onPageLoad(), f = !0);
      if (C || m || k || z) {
        if (p) {
          return;
        }
        a = /^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|cn|it|es|in|com\.mx|com\.br|com\.au)\/(s\/|gp\/search\/|.*?\/b\/)/;
        (f || c.match(a)) && document.addEventListener("DOMContentLoaded", function(a) {
          var e = null;
          chrome.runtime.sendMessage({type:"getFilters"}, function(a) {
            e = a;
            if (null != e && null != e.value) {
              var d = function() {
                var d = c.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|cn|it|es|in|com\.mx|com\.br|com\.au)\//);
                if (f || d) {
                  var e = b.getDomain(RegExp.$1);
                  scanner.scan(a.value, function(a) {
                    a.key = "f1";
                    a.domainId = e;
                    chrome.runtime.sendMessage({type:"sendData", val:a}, function(a) {
                    });
                  });
                }
              };
              d();
              var h = document.location.href, k = -1, g = -1, l = -1;
              g = setInterval(function() {
                h != document.location.href && (h = document.location.href, clearTimeout(l), l = setTimeout(function() {
                  d();
                }, 2000), clearTimeout(k), k = setTimeout(function() {
                  clearInterval(g);
                }, 180000));
              }, 2000);
              k = setTimeout(function() {
                clearInterval(g);
              }, 180000);
            }
          });
        });
      }
      document.location.href.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|cn|it|es|in|com\.mx|com\.br|com\.au)/) && document.addEventListener("DOMContentLoaded", function(a) {
        setTimeout(function() {
          chrome.runtime.onMessage.addListener(function(a, c, d) {
            switch(a.key) {
              case "collectASINs":
                a = {};
                var e = !1;
                c = (document.querySelector("#main") || document.querySelector("#zg") || document.querySelector("#pageContent") || document.querySelector("#wishlist-page") || document.querySelector("#merchandised-content") || document.querySelector("[id^='contentGrid']") || document.querySelector("#container") || document.querySelector(".a-container") || document).getElementsByTagName("a");
                if (void 0 != c && null != c) {
                  for (var f = 0; f < c.length; f++) {
                    var g = c[f].href;
                    /\/images/.test(g) || /\/e\/(B[A-Z0-9]{9}|\d{9}(!?X|\d))/.test(g) || !g.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|cn|it|es|in|com\.mx|com\.br|com\.au)\/[^.]*?(?:\/|\?ASIN=)(B[A-Z0-9]{9}|\d{9}(!?X|\d))/) && !g.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/(B[A-Z0-9]{9}|\d{9}(!?X|\d))/) || (e = RegExp.$2, g = b.getDomain(RegExp.$1), "undefined" === typeof a[g] && (a[g] = []), a[g].includes(e) || a[g].push(e), e = !0);
                  }
                }
                if (e) {
                  d(a);
                } else {
                  return alert("Keepa: No product ASINs found on this page."), !1;
                }
                break;
              default:
                d({});
            }
          });
          u.get(["overlayPriceGraph", "s_overlay"], function(a) {
            try {
              var b = a.overlayPriceGraph, c = a.s_overlay;
              try {
                c = JSON.parse(c);
              } catch (n) {
              }
              var d;
              if (1 == b) {
                var e = document.getElementsByTagName("a"), g = 0 < document.location.href.indexOf("/offer-listing/");
                if (void 0 != e && null != e) {
                  for (d = 0; d < e.length; d++) {
                    var f = e[d].href;
                    /\/images/.test(f) || /\/e\/(B[A-Z0-9]{9}|\d{9}(!?X|\d))/.test(f) || !f.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|cn|it|es|in|com\.mx|com\.br)\/[^.]*?(?:\/|\?ASIN=)(B[A-Z0-9]{9}|\d{9}(!?X|\d))/) && !f.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/(B[A-Z0-9]{9}|\d{9}(!?X|\d))/) || (g || -1 == f.indexOf("offer-listing")) && q.add_events(c, e[d], f, RegExp.$1, RegExp.$2);
                  }
                }
                var h = function(a) {
                  if ("A" == a.nodeName) {
                    var b = a.href;
                    /\/images/.test(b) || /\/e\/(B[A-Z0-9]{9}|\d{9}(!?X|\d))/.test(b) || !b.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|cn|it|es|in|com\.mx|com\.br|com\.au)\/[^.]*?(?:\/|\?ASIN=)(B[A-Z0-9]{9}|\d{9}(!?X|\d))/) && !b.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/(B[A-Z0-9]{9}|\d{9}(!?X|\d))/) || (g || -1 == b.indexOf("offer-listing")) && q.add_events(c, a, b, RegExp.$1, RegExp.$2);
                  }
                }, k = new MutationObserver(function(a) {
                  a.forEach(function(a) {
                    try {
                      if ("childList" === a.type) {
                        for (d = 0; d < a.addedNodes.length; d++) {
                          h(a.addedNodes[d]);
                          for (var b = a.addedNodes[d].children; null != b && "undefined" != b && 0 < b.length;) {
                            for (var c = [], e = 0; e < b.length; e++) {
                              h(b[e]);
                              try {
                                if (b[e].children && 0 < b[e].children.length) {
                                  for (var f = 0; f < b[e].children.length && 30 > f; f++) {
                                    c.push(b[e].children[f]);
                                  }
                                }
                              } catch (x) {
                              }
                            }
                            b = c;
                          }
                        }
                      } else {
                        if (c = a.target.getElementsByTagName("a"), "undefined" != c && null != c) {
                          for (b = 0; b < c.length; b++) {
                            h(c[b]);
                          }
                        }
                      }
                      h(a.target);
                    } catch (x) {
                    }
                  });
                });
                k.observe(document.querySelector("html"), {childList:!0, attributes:!1, characterData:!1, subtree:!0, attributeOldValue:!1, characterDataOldValue:!1});
                window.onunload = function v() {
                  try {
                    window.detachEvent("onunload", v), k.disconnect();
                  } catch (G) {
                  }
                };
              }
            } catch (n) {
            }
          });
        }, 100);
      });
    });
  }
  var q = {image_urls_main:[], pf_preview_current:"", preview_images:[], tld:"", img_string:'<img style="border: 1px solid #ff9f29;  -moz-border-radius: 0px;  margin: -3px;   display:block;   position: relative;   top: -3px;   left: -3px;" src=\'', createNewImageElement:function(a) {
    a = a.createElement("img");
    a.style.borderTop = "2px solid #ff9f29";
    a.style.borderBottom = "3px solid grey";
    a.style.display = "block";
    a.style.position = "relative";
    a.style.padding = "5px";
    return a;
  }, preview_image:function(a, b, c, f, k) {
    try {
      var d = b.originalTarget.ownerDocument;
    } catch (w) {
      d = document;
    }
    if (!d.getElementById("pf_preview")) {
      var h = d.createElement("div");
      h.id = "pf_preview";
      h.addEventListener("mouseout", function(a) {
        q.clear_image(a);
      }, !1);
      h.style.boxShadow = "rgb(68, 68, 68) 0px 1px 7px -2px";
      h.style.position = "fixed";
      h.style.zIndex = "10000000";
      h.style.bottom = "0px";
      h.style.right = "0px";
      h.style.margin = "12px 12px";
      h.style.backgroundColor = "#fff";
      d.body.appendChild(h);
    }
    q.pf_preview_current = d.getElementById("pf_preview");
    if (!q.pf_preview_current.firstChild) {
      h = Math.max(Math.floor(0.3 * d.defaultView.innerHeight), 128);
      var m = Math.max(Math.floor(0.3 * d.defaultView.innerWidth), 128), p = 2;
      if (300 > m || 150 > h) {
        p = 1;
      }
      1000 < m && (m = 1000);
      1000 < h && (h = 1000);
      q.pf_preview_current.current = -1;
      q.pf_preview_current.a = f;
      q.pf_preview_current.href = c;
      q.pf_preview_current.size = Math.floor(1.1 * Math.min(m, h));
      d.defaultView.innerWidth - b.clientX < 1.05 * m && d.defaultView.innerHeight - b.clientY < 1.05 * h && (b = d.getElementById("pf_preview"), b.style.right = "", b.style.left = "6px");
      f = "https://dyn.keepa.com/pricehistory.png?type=" + p + "&asin=" + f + "&domain=" + k + "&width=" + m + "&height=" + h;
      f = "undefined" == typeof a ? f + "&amazon=1&new=1&used=1&salesrank=1&range=365" : f + ("&amazon=" + a[0] + "&new=" + a[1] + "&used=" + a[2] + "&salesrank=" + a[3] + "&range=" + a[4]);
      d.getElementById("pf_preview").style.display = "block";
      a = q.createNewImageElement(d);
      a.setAttribute("src", f);
      q.pf_preview_current.appendChild(a);
    }
  }, clear_image:function(a) {
    try {
      try {
        var b = a.originalTarget.ownerDocument;
      } catch (f) {
        b = document;
      }
      var c = b.getElementById("pf_preview");
      c.style.display = "none";
      c.style.right = "2px";
      c.style.left = "";
      q.pf_preview_current.innerHTML = "";
    } catch (f) {
    }
  }, add_events:function(a, b, c, f, k) {
    0 <= c.indexOf("#") || (q.tld = f, "pf_prevImg" != b.getAttribute("keepaPreview") && (b.addEventListener("mouseover", function(b) {
      q.preview_image(a, b, c, k, f);
      return !0;
    }, !0), b.addEventListener("mouseout", function(a) {
      q.clear_image(a);
    }, !1), b.setAttribute("keepaPreview", "pf_prevImg")));
  }};
})();

