(function(e) {
  try {
    var t = false;
    function a() {
      var e = parseInt(localStorage.getItem("curTabActive")) || 0;
      var t = [].concat(user["geodata"] ? JSON.parse(user["geodata"]).relate : [], localStorage.getItem("had_wl") ? JSON.parse(localStorage.getItem("had_wl")) : []);
      if (e == 1 && t.length == 0) e = 0;
      $("#tabs").tabs({
        active: e,
        activate: function(e, t) {
          var a = t.newPanel.selector;
          if (a == "#tab-background") {
            localStorage.setItem("curTabActive", 0);
          } else if (a == "#tab-relative-apps") {
            localStorage.setItem("curTabActive", 1);
          } else if (a == "#tab-setting") {
            localStorage.setItem("curTabActive", 2);
          }
        }
      });
      $("#tab-relative-apps").off("click");
      $("#tab-relative-apps").on("click", function(e) {
        if (e.target.tagName == "INPUT" && e.target.classList.value.indexOf("enableAppAction") > -1) {
          var t = e.target.dataset.extid;
          chrome.management.get(t, function(a) {
            chrome.management.setEnabled(t, !a.enabled, function() {
              chrome.extension.sendMessage("click-" + (a.enabled ? "AppDisable" : "AppEnable"));
              e.target.setAttribute("data-enabled", !a.enabled);
            });
          });
        } else if (e.target.tagName == "BUTTON" && e.target.classList.value.indexOf("installAppAction") > -1) {
          chrome.extension.sendMessage("click-AppInstall");
          chrome.tabs.create({
            url: "https://chrome.google.com/webstore/detail/" + e.target.dataset.extid + "?utm_campaign=Extensions&utm_medium=relative&utm_source=" + chrome.runtime.id,
            active: true
          });
        } else if (e.target.tagName == "A" || e.target.tagName == "IMG") {
          chrome.extension.sendMessage("click-AppLink");
        }
      });
    }
    e.loadRelativeApps = function() {
      var e = localStorage.getItem("had_wl") ? JSON.parse(localStorage.getItem("had_wl")) : [];
      var t = user["geodata"] ? JSON.parse(user["geodata"]) : null;
      if (!t) return;
      var a = t && t.hasOwnProperty("tophot") ? t.tophot : false;
      var l = t && t.hasOwnProperty("topnew") ? t.topnew : false;
      var i = t && t.relate.length ? t.relate : [];
      var o = [].concat(i, utils.getAppsInList2ThatNotInList1([].concat([ {
        id: chrome.runtime.id
      } ], i), e));
      if (o.length === 0) {
        $('#tabs li[aria-controls="tab-relative-apps"]').hide();
        return;
      }
      $('#tabs li[aria-controls="tab-relative-apps"]').show();
      $("#tab-relative-apps table").empty();
      if ("" + localStorage.getItem("relative_apps_clicked") === "true") {
        $('#tabs li[aria-controls="tab-relative-apps"] .tab-control').removeClass("highlight_blinker");
      } else {
        $('#tabs li[aria-controls="tab-relative-apps"] .tab-control').addClass("highlight_blinker");
        utils.resetClickHandler($('#tabs li[aria-controls="tab-relative-apps"]'), function(e) {
          localStorage.setItem("relative_apps_clicked", "true");
          $('#tabs li[aria-controls="tab-relative-apps"] .tab-control').removeClass("highlight_blinker");
        });
      }
      function s(e) {
        var t = e.lp + "?utm_campaign=Extensions&utm_medium=relative&utm_source=" + chrome.runtime.id;
        var a = '<img src="' + (e.art || chrome.extension.getURL("/start/skin/images/extension_grey.png")) + '" />';
        var l = "<p>" + e.name + "</p>";
        if (e.lp) {
          a = '<a href="' + t + '" target="_blank">' + a + "</a>";
          l = '<p><a href="' + t + '" target="_blank">' + e.name + "</a></p>";
        }
        var i = e.enabled ? '<label><input type="checkbox" class="enableAppAction" data-extId="' + e.id + '" data-enabled="true" checked ><span class="enable">Enable</span><span class="enabled"><strong>Enabled</strong></span>' : '<label><input type="checkbox" class="enableAppAction" data-extId="' + e.id + '" data-enabled="false"><span class="enable">Enable</span><span class="enabled"><strong>Enabled</strong></span></label>';
        var o = "" + e.id !== "undefined" ? '<button class="installAppAction r-a-f"  data-extId="' + e.id + '">Install</button>' : "";
        var s = e.hl === "new" ? '<div class="r-h-n r-n"></div>' : e.hl === "hot" ? '<div class="r-h-n r-h"></div>' : "";
        var r = '<tr class="r-a-r-i">' + '<td class="r-a-c r-a-c-1">' + s + a + "</td>" + '<td class="r-a-c r-a-c-2">' + l + "</td>" + '<td class="r-a-c r-a-c-3">' + (e.installed ? i : o) + "</td>" + "</tr>";
        $("#tab-relative-apps table").append(r);
      }
      function r() {
        utils.getInstalledAppsInWhitelist(o, function(e) {
          var t = [], i = [], r = [], n = [];
          for (var c = 0; c < o.length; c++) {
            var g = {
              id: o[c].id,
              name: o[c].name,
              art: o[c].art,
              lp: o[c].lp,
              hl: o[c].hl
            };
            var d = e.find(function(e) {
              return g.id == e.id;
            });
            if (d) {
              g.installed = true;
              g.enabled = d.enabled;
              t.push(g);
            } else {
              g.installed = false;
              if (g.hl == "hot") i.push(g); else if (g.hl == "new") r.push(g); else n.push(g);
            }
          }
          function h(e) {
            e.forEach(function(e) {
              s(e);
            });
          }
          if (a && l) {
            h(i);
            h(r);
            h(t);
            h(n);
          } else if (a && !l) {
            h(i);
            h(t);
            h(r);
            h(n);
          } else if (!a && l) {
            h(r);
            h(t);
            h(i);
            h(n);
          } else {
            h(t);
            h(i);
            h(r);
            h(n);
          }
        });
      }
      r();
    };
    $(document).ready(function() {
      a();
      if (!localStorage.getItem("weather_location") || localStorage.getItem("weather_location_isvalid") === "false") {
        if (localStorage.getItem("disable_weather") === "no") $("#error_box").show();
      } else {
        $("#error_box").hide();
      }
      $(".nav_menu a[class*=lnk_], #tab-setting a[class*=lnk_]").each(function(e, t) {
        t.protocol = "http:";
        t.host = user["firstRunDomain"];
      });
      function t() {
        $(".nav_menu").css("max-height", document.body.clientHeight - 80 + "px");
      }
      t();
      e.addEventListener("resize", t);
      var l = function(e) {
        return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, function e(t, a) {
          return String.fromCharCode("0x" + a);
        }));
      };
      var i = function(e) {
        return decodeURIComponent(atob(e).split("").map(function(e) {
          return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
      };
      var r = function(e) {
        var t = 0, a, l, i;
        if (typeof e === "undefined" || e === null || e.length === 0) return t;
        e = e.replace(/[-{}]/g, "");
        for (a = 0, i = e.length; a < i; a++) {
          l = e.charCodeAt(a);
          t = (t << 5) - t + l;
          t |= 0;
        }
        return t;
      };
      function n(e) {
        var t = 0;
        for (var a = 0; a < e.length; a++) {
          t += e[a].weight;
        }
        var l = Math.floor(Math.random() * t);
        for (var i = 0, a = 0; a < e.length; a++) {
          i += e[a].weight;
          if (l <= i) {
            return e[a].item;
          }
        }
      }
      try {
        var c = null;
        if (user["geodata"]) c = JSON.parse(user["geodata"]);
        var g = function(e) {
          var t = $("<div/>").html(e).contents();
          if (t.attr("track")) {
            t.off("click");
            t.on("click", function() {
              if ($(this).attr("onetime")) {
                localStorage.setItem("onetime_clicked", localStorage.getItem("onetime_clicked") + "," + $(this).attr("track"));
              }
              if ($(this).attr("highlight")) {
                $(this).attr("class", ($(this).attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
                localStorage.setItem("highlight_clicked", localStorage.getItem("highlight_clicked") + "," + $(this).attr("track"));
              }
              chrome.extension.sendMessage("click-" + $(this).attr("track"));
            });
          }
          if (t.attr("highlight") && (localStorage.getItem("highlight_clicked") + "").indexOf(t.attr("track")) == -1) {
            t.addClass(localStorage.getItem("highlight") || "highlight");
          }
          if (!t.attr("onetime") || (localStorage.getItem("onetime_clicked") + "").indexOf(t.attr("track")) == -1) {
            if (t.attr("showrate")) {
              var a = parseFloat(t.attr("showrate"));
              if (a > 0 && a < 1) a = a * 100;
              if (Math.floor(Math.random() * 100) <= a) {
                $(".quote").append(t);
              }
            } else {
              $(".quote").append(t);
            }
          }
        };
        var d = function(e) {
          var t = $("<div/>").html(e).contents();
          if (t.attr("track")) {
            t.off("click");
            t.on("click", function() {
              if ($(this).attr("onetime")) {
                localStorage.setItem("onetime_clicked", localStorage.getItem("onetime_clicked") + "," + $(this).attr("track"));
              }
              if ($(this).attr("highlight")) {
                $(this).attr("class", ($(this).attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
                localStorage.setItem("highlight_clicked", localStorage.getItem("highlight_clicked") + "," + $(this).attr("track"));
              }
              chrome.extension.sendMessage("click-" + $(this).attr("track"));
            });
          }
          if (t.attr("highlight") && (localStorage.getItem("highlight_clicked") + "").indexOf(t.attr("track")) == -1) {
            t.addClass(localStorage.getItem("highlight") || "highlight");
          }
          if (!t.attr("onetime") || (localStorage.getItem("onetime_clicked") + "").indexOf(t.attr("track")) == -1) {
            if (t.attr("showrate")) {
              var a = parseFloat(t.attr("showrate"));
              if (a > 0 && a < 1) a = a * 100;
              if (Math.floor(Math.random() * 100) <= a) {
                $("nav").append(t);
              }
            } else {
              $("nav").append(t);
            }
          }
        };
        var h = false;
        if (c && typeof c["intro"] !== "undefined") {
          var f = c["intro"];
          for (var u = 0; u < Object.keys(f).length; u++) {
            if (Object.keys(f)[u].indexOf(e.chosenRandomBG) > -1) {
              h = true;
              g(Object.values(f)[u]);
              break;
            }
          }
        }
        if (c && typeof c["quotes"] !== "undefined" && !h) {
          var m = c["quotes"];
          if (typeof m == "string" && m) {
            g(m);
          } else if (m.length && typeof m[0] == "string") {
            var p = [];
            for (var u = 0; u < m.length; u++) {
              var k = 1;
              var _ = m[u].match(/ data-w="([0-9]+)"/);
              if (_ && _.length >= 2) k = parseInt(_[1]);
              p.push({
                item: m[u],
                weight: k
              });
            }
            g(n(p));
          }
        }
      } catch (t) {
        if (e.debug) console.log("Error parse geodata for quote.");
        trackStatusEvent("error-geodata-quote", null, null);
      }
      try {
        if (c && typeof c["nav"] !== "undefined") {
          var v = c["nav"];
          if (typeof v == "string" && v) {
            d(v);
          } else if (v.length && typeof v[0] == "string") {
            var b = [], S = [];
            for (var u = 0; u < v.length; u++) {
              var k = 1;
              var _ = v[u].match(/ data-w="([0-9]+)"/);
              if (_ && _.length >= 2) k = parseInt(_[1]);
              if (v[u].indexOf("NavRelateExt") > -1) {
                b.push({
                  item: v[u],
                  weight: k
                });
              } else {
                S.push({
                  item: v[u],
                  weight: k
                });
              }
            }
            if (e.debug) console.log(S, b);
            if (S.length) d(n(S));
            if (b.length) d(n(b));
          }
        }
        if (!e.debug && parseInt(localStorage.getItem("installdc")) >= 2) {
          if ([ -1008365593, -2142530656, -112130756, 1634145303 ].indexOf(r(user[i("Zmlyc3RSdW5Eb21haW4=")])) == -1 || c && typeof c["vl"] !== "undefined" && c["vl"] == "1") {
            var I = i("aHR0cDovL2ZyZWVhZGRvbi5jb20vd2FybmluZy1hZHdhcmUtdmlydXMtZGlzdHJpYnV0b3JzLWFyZS1tYWtpbmctZmFrZS1leHRlbnNpb25zLWJhc2VkLW9uLWZyZWVhZGRvbi1zcG9ydGlmeXRhYi8=");
            pref(i("Zmlyc3RSdW5MYW5kaW5nUGFnZQ=="), I);
            pref(i("Zmlyc3RSdW5Eb21haW4="), i("ZnJlZWFkZG9uLmNvbQ=="));
            $(".nav_menu a").attr("href", I);
            e.vl = true;
            var y = e[i("Z2E=")];
            if (y && !localStorage.getItem("vl.t")) {
              var w = {
                title: localStorage.getItem(i("ZGltMQ==")) || i("TmV3IFRhYg==")
              };
              y("create", i("VUEtODcxMzQ1MTktNg=="), "auto", "vl_t");
              w[i("dXNlcklk")] = localStorage.getItem("uid");
              w[i("Y2hlY2tQcm90b2NvbFRhc2s=")] = function() {};
              w[i("Y2FtcGFpZ25JZA==")] = chrome.runtime.id;
              y("vl_t.set", w);
              var x = {};
              x[i("aGl0VHlwZQ==")] = i("ZXZlbnQ=");
              x[i("ZXZlbnRDYXRlZ29yeQ==")] = chrome.runtime.id;
              x[i("ZXZlbnRBY3Rpb24=")] = "vl";
              x[i("ZXZlbnRMYWJlbA==")] = localStorage.getItem("ext_name");
              y("vl_t.send", x);
              localStorage.setItem("vl.t", 1);
            }
          }
        }
      } catch (t) {
        if (e.debug) console.log("Error parse geodata for nav.");
        trackStatusEvent("error-geodata-nav", null, null);
      }
      if (localStorage.getItem("shuffle_background") == "yes") {
        $("#shuffle_background").prop("checked", true);
        $("#shuffle_favorites").prop("checked", false);
      } else {
        $("#shuffle_background").prop("checked", false);
      }
      $("#shuffle_background").off("change");
      $("#shuffle_background").on("change", function() {
        if ($("#shuffle_background").is(":checked")) {
          localStorage.setItem("shuffle_background", "yes");
          $("#shuffle_favorites").prop("checked", false);
          localStorage.setItem("shuffle_favorites", "no");
        } else {
          localStorage.setItem("shuffle_background", "no");
        }
        utils.localstorage2cookie();
      });
      if (localStorage.getItem("shuffle_favorites") == "yes") {
        $("#shuffle_favorites").prop("checked", true);
        $("#shuffle_background").prop("checked", false);
      } else {
        $("#shuffle_favorites").prop("checked", false);
      }
      $("#shuffle_favorites").off("change");
      $("#shuffle_favorites").on("change", function() {
        if ($("#shuffle_favorites").is(":checked")) {
          localStorage.setItem("shuffle_favorites", "yes");
          $("#shuffle_background").prop("checked", false);
          localStorage.setItem("shuffle_background", "no");
        } else {
          localStorage.setItem("shuffle_favorites", "no");
        }
        utils.localstorage2cookie();
      });
      e.loadGlobalOptions = function() {
        e.loadToDoList();
        e.loadCountDownModule(e);
        e.loadAutoHideModule(e);
        e.loadSnowModule(e);
        $("#random_all_newtab").prop("checked", localStorage.getItem("random_all_newtab") === "yes");
        $("#random_all_newtab").off("change");
        $("#random_all_newtab").on("change", function() {
          localStorage.setItem("random_all_newtab", $("#random_all_newtab").is(":checked") ? "yes" : "no");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        $("#disable_weather").prop("checked", localStorage.getItem("disable_weather") === "yes");
        $("#disable_weather").off("change");
        $("#disable_weather").on("change", function() {
          if ($("#disable_weather").is(":checked")) {
            $("#error_box").hide();
          } else {
            if (localStorage.getItem("weather_location_isvalid") === "false") {
              $("#error_box").show();
            }
          }
          localStorage.setItem("disable_weather", $("#disable_weather").is(":checked") ? "yes" : "no");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        if (localStorage.getItem("enable_most_visited") == "no") {
          $(".most_visited").hide();
        } else {
          $(".most_visited").show();
        }
        $("#enable_most_visited").prop("checked", localStorage.getItem("enable_most_visited") === "yes");
        $("#enable_most_visited").off("change");
        $("#enable_most_visited").on("change", function() {
          if (!$("#enable_most_visited").is(":checked")) {
            $(".most_visited").fadeOut();
          } else {
            $(".most_visited").fadeIn();
          }
          localStorage.setItem("enable_most_visited", $("#enable_most_visited").is(":checked") ? "yes" : "no");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        if (localStorage.getItem("enable_apps") == "no") {
          $(".apps").fadeOut();
        } else {
          $(".apps").fadeIn();
        }
        $("#enable_apps").prop("checked", localStorage.getItem("enable_apps") === "yes");
        $("#enable_apps").off("change");
        $("#enable_apps").on("change", function() {
          if (!$("#enable_apps").is(":checked")) {
            $(".apps").fadeOut();
          } else {
            $(".apps").fadeIn();
          }
          localStorage.setItem("enable_apps", $("#enable_apps").is(":checked") ? "yes" : "no");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        if (localStorage.getItem("enable_share") == "no") {
          $(".share").fadeOut();
        } else {
          $(".share").fadeIn();
        }
        $("#enable_share").prop("checked", localStorage.getItem("enable_share") === "yes");
        $("#enable_share").off("change");
        $("#enable_share").on("change", function() {
          if (!$("#enable_share").is(":checked")) {
            $(".share").fadeOut();
          } else {
            $(".share").fadeIn();
          }
          localStorage.setItem("enable_share", $("#enable_share").is(":checked") ? "yes" : "no");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        if (localStorage.getItem("enable_slideshow") == "no") {
          s();
        } else {
          o();
        }
        $("#enable_slideshow").prop("checked", localStorage.getItem("enable_slideshow") === "yes");
        $("#enable_slideshow").off("change");
        $("#enable_slideshow").on("change", function() {
          if (!$("#enable_slideshow").is(":checked")) {
            s();
          } else {
            var e = [];
            if (localStorage.getItem("mark_favor")) e = JSON.parse(localStorage.getItem("mark_favor"));
            if (localStorage.getItem("shuffle_background") == "no" && (localStorage.getItem("shuffle_favorites") == "no" || localStorage.getItem("shuffle_favorites") == "yes" && e.length <= 1)) {
              localStorage.setItem("shuffle_background", "yes");
              localStorage.setItem("shuffle_favorites", "no");
              $("#shuffle_background").prop("checked", true);
              $("#shuffle_favorites").prop("checked", false);
            }
            o();
          }
          localStorage.setItem("enable_slideshow", $("#enable_slideshow").is(":checked") ? "yes" : "no");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        $("#delete_button").off("click");
        $("#delete_button").on("click", function() {
          $("#error_box").hide();
          $("#disable_weather").prop("checked", true);
          localStorage.setItem("disable_weather", "yes");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        $('[data-toggle="tooltip"]').tooltip();
      };
      e.loadGlobalOptions();
      e.loadImagesInOption = function() {
        var t = 5;
        for (var a = 1; a <= user["bg_img_list"]; a++) {
          var l = "bg-" + ("0" + a).slice(-2);
          var i = $("<li>");
          var o;
          var s;
          if (Object.keys(user["bg_color_gif"]).indexOf(l + ".gif") > -1) {
            s = l + ".gif";
            o = $("<img>", {
              "data-src": s,
              src: utils.getExtensionURL("/start/skin/images/" + l + ".gif")
            });
          } else {
            s = l + ".jpg";
            o = $("<img>", {
              "data-src": s,
              src: utils.getExtensionURL("/start/skin/images/" + l + ".jpg")
            });
          }
          i.append(o);
          var n = '<div class="like-container" style="display: none;"><div class="like-action" data-src="' + s + '"></div><span class="like-label"></span></div>';
          i.append(n);
          $("#images_selector").append(i);
          var c, g = [];
          if (localStorage.getItem("mark_favor")) g = JSON.parse(localStorage.getItem("mark_favor"));
          if (g.indexOf(a + "") > -1) {
            c = $('<span class="mark_favor marked_favor" favor-for="' + a + '" data-toggle="tooltip" data-placement="bottom" title="Remove this image from favorites"><span class="glyphicon glyphicon-heart"></span></span>');
          } else {
            c = $('<span class="mark_favor" favor-for="' + a + '" data-toggle="tooltip" data-placement="bottom" title="Mark this image as favorite"><span class="glyphicon glyphicon-heart-empty"></span></span>');
          }
          utils.resetClickHandler(c, function() {
            var e = $(this).attr("favor-for");
            var t = [];
            if (localStorage.getItem("mark_favor")) t = JSON.parse(localStorage.getItem("mark_favor"));
            $(this).toggleClass("marked_favor");
            if ($(this).hasClass("marked_favor")) {
              $(this).attr("data-toggle", "tooltip");
              $(this).attr("data-placement", "bottom");
              $(this).attr("data-original-title", "Remove this image from favorites");
              $(this).tooltip();
              $(this).find(".glyphicon").removeClass("glyphicon-heart-empty");
              $(this).find(".glyphicon").addClass("glyphicon-heart");
              if (t.indexOf(e + "") == -1) {
                t.push(e + "");
              }
            } else {
              $(this).attr("data-toggle", "tooltip");
              $(this).attr("data-placement", "bottom");
              $(this).attr("data-original-title", "Mark this image as favorite");
              $(this).tooltip();
              $(this).find(".glyphicon").removeClass("glyphicon-heart");
              $(this).find(".glyphicon").addClass("glyphicon-heart-empty");
              if (t.indexOf(e + "") > -1) {
                t.splice(t.indexOf(e + ""), 1);
              }
            }
            localStorage.setItem("mark_favor", JSON.stringify(t));
            utils.localstorage2cookie();
          });
          $("#images_selector").append(c);
          if (a % t == 0) {
            $("#images_selector").append($("<br>"));
          }
        }
        $("#images_selector li").each(function() {
          if (($(this).find("img").attr("src") + "").indexOf(e.chosenRandomBG) > -1) {
            $(this).addClass("selected");
          }
        });
        String.prototype.toShortNumber = function() {
          var e = this.toString();
          var t = Number(e);
          if (!t || t === NaN) {
            var a = e.match(/\d+/g).toString();
            t = Number(a);
          }
          var l;
          if (t >= 1e9) {
            l = (Math.round(t / 1e7) / 100).toString() + "B";
          } else if (t >= 1e6) {
            l = (Math.round(t / 1e4) / 100).toString() + "M";
          } else if (t >= 1e3) {
            l = (Math.round(t / 10) / 100).toString() + "K";
          } else if (t < 1e3) {
            return t.toString();
          }
          return l;
        };
        function d() {
          if (!localStorage.getItem("ext_oid")) return;
          var e = "http://" + localStorage.getItem("user_group") + "." + user["firstRunDomain"] + "/v1/like/" + localStorage.getItem("ext_oid");
          $.get(e, function(e) {
            try {
              var t = JSON.parse(localStorage.getItem("likedImages"));
              var a = e.data;
              var l = $("#images_selector");
              if (a) {
                a.forEach(function(e) {
                  var t = l.find('li img[data-src="' + e.imageName + '"]').parent().find(".like-action");
                  var a = l.find('li img[data-src="' + e.imageName + '"]').parent().find(".like-label");
                  if (a[0] && a[0].tagName == "SPAN") {
                    t.attr("data-id", e._id);
                    a.attr("title", e.likeCount.toLocaleString());
                    a.text(e.likeCount.toString().toShortNumber() || 0);
                  }
                });
                t.forEach(function(e) {
                  l.find('li img[data-src="' + e + '"]').parent().find(".like-action").addClass("active");
                  likeLabel = l.find('li img[data-src="' + e + '"]').parent().find(".like-label").addClass("active");
                });
              }
              l.find('li[class="selected"] .like-container').fadeIn("slow");
            } catch (e) {
              console.log(e);
            }
          });
        }
        d();
        $("#close_background_selector_widget").off("click");
        $("#close_background_selector_widget").on("click", function(e) {
          $("#background_selector_widget").fadeOut();
        });
        $("#background_selector_widget").off("click");
        $("#background_selector_widget").on("click", function(e) {
          e.stopPropagation();
        });
        $("#images_selector li .like-container").off("click");
        $("#images_selector li .like-container").on("click", function(e) {
          e.preventDefault();
          e.stopPropagation();
        });
        var h = [];
        $("#images_selector li .like-action").off("click");
        $("#images_selector li .like-action").on("click", function(e) {
          e.preventDefault();
          e.stopPropagation();
          var t = $(this).parent("div");
          var a = t.find(".like-label");
          var l = $(this).data("src");
          var i = $(this).data("id");
          if (!i) return;
          var o = 0;
          var s = parseInt(a.text());
          $(this).toggleClass("active");
          $(this).parent().removeClass().addClass("like-container clicked").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
            $(this).removeClass().addClass("like-container");
          });
          function n(e) {
            var t = localStorage.getItem("likedImages");
            if (!t && !h.length) {
              h.slice(0, h.length);
              h.push(l);
              localStorage.setItem("likedImages", JSON.stringify(h));
            } else {
              try {
                h = JSON.parse(localStorage.getItem("likedImages"));
                var a = h.find(function(e) {
                  return e === l;
                });
                if (e && !a) {
                  h.push(l);
                } else {
                  h.splice(h.indexOf(l), 1);
                }
                localStorage.setItem("likedImages", JSON.stringify(h));
              } catch (e) {
                console.log(e);
              }
            }
          }
          if ($(this).hasClass("active")) {
            s++;
            o = 1;
            n(true);
          } else {
            s--;
            o = -1;
            n(false);
          }
          var c = {
            id: i,
            src: l,
            like: o,
            val: r(i + l + o)
          };
          var g = "http://" + localStorage.getItem("user_group") + "." + user["firstRunDomain"] + "/v1/like";
          $.ajax({
            url: g,
            type: "POST",
            data: c,
            success: function(e) {
              a.text(e.data ? e.data.likeCount.toString().toShortNumber() : "");
              a.attr("title", e.data.likeCount.toLocaleString());
            }
          });
        });
        $("#background_selector_widget #tab-background li").off("click");
        $("#background_selector_widget #tab-background li").on("click", function(t) {
          t.preventDefault();
          t.stopPropagation();
          var a = $(this).parent("ul");
          a.find(".like-container").fadeOut();
          $("#background_selector_widget li.selected").removeClass();
          $(this).addClass("selected");
          var l = $(this).find(".like-container");
          l.fadeIn("slow");
          if ($(this).find("img").length > 0) {
            var i = $(this).find("img").attr("data-src");
            user["bg_img"] = i;
            user["bg_color"] = "";
            e.setBackgroundGIFOrJPG(i);
          } else if ($(this).attr("cl")) {
            var o = $(this).attr("cl");
            $("body").css({
              "background-image": "none",
              background: "#" + o
            });
            user["bg_img"] = "none";
            user["bg_color"] = "#" + o;
          }
          utils.localstorage2cookie();
        });
        $('[data-toggle="tooltip"]').tooltip();
      };
      chrome.extension.sendMessage({
        rateStatus: true
      }, function(e) {
        if (e === -1) {
          $("#click-Rate").hide();
        }
        if (e === 0) {
          $("#click-Rate").show();
        }
        if (e === 1) {
          $("#click-Rate").addClass(localStorage.getItem("highlight") || "highlight");
          $("#click-Rate").show();
        }
      });
      if (e.debug) {
        utils.resetClickHandler($('#click-Rate'), function(){
          chrome.windows.getAll(function(wins){
            console.log('WIN.getAll: ', wins);
            for( var i=0; i<wins.length; i++ ){
              if( wins[i].id !== -1 ) chrome.windows.update(wins[i].id, {
                focused : true
                , left  : 0
                , top   : 0
                , width : 1280
                , height: 800
              });
            }
          });
        });
      } else {
        utils.resetClickHandler($("#click-Rate"), function() {
          $("#click-Rate").attr("class", ($("#click-Rate").attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
          localStorage.setItem("rate_clicked", "yes");
          utils.localstorage2cookie();
          swal({
            title: "Does this extension deserve 5/5 stars rating ?",
            text: "",
            type: "success",
            html: true,
            animation: false,
            showConfirmButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, rate it 5 stars",
            showCancelButton: true,
            cancelButtonText: "No, I have feedback",
            closeOnConfirm: true,
            closeOnCancel: true
          }, function(e) {
            if (e) {
              $("#click-Rate").hide();
              localStorage.setItem("rate_clicked", "cws");
              chrome.extension.sendMessage("click-Rate");
            } else {
              localStorage.setItem("rate_clicked", "feedback");
              chrome.extension.sendMessage("click-Feedback");
            }
            utils.localstorage2cookie();
          });
        });
      }
      utils.resetClickHandler($("a[class*=lnk_update_]"), function() {
        chrome.extension.sendMessage("click-UpdateHistory");
      });
      utils.resetClickHandler($(".lnk_chromethemes"), function() {
        chrome.extension.sendMessage("click-ChromeThemes");
      });
      utils.resetClickHandler($(".lnk_bookmarks"), function() {
        chrome.extension.sendMessage("click-Bookmarks");
      });
      utils.resetClickHandler($(".lnk_faq"), function() {
        chrome.extension.sendMessage("click-FAQ");
      });
      utils.resetClickHandler($(".lnk_eula"), function() {
        chrome.extension.sendMessage("click-EULA");
      });
      utils.resetClickHandler($(".lnk_privacy"), function() {
        chrome.extension.sendMessage("click-Privacy");
      });
      utils.resetClickHandler($(".uninstallSelf"), function() {
        chrome.extension.sendMessage("click-Uninstall");
      });
      utils.resetClickHandler($(".click-Donate"), function() {
        chrome.extension.sendMessage("click-Donate");
      });
      utils.resetClickHandler($(".click-Feedback"), function() {
        chrome.extension.sendMessage("click-Feedback");
      });
      utils.resetClickHandler($(".click-Fanpage"), function() {
        chrome.extension.sendMessage("click-Fanpage");
      });
      utils.resetClickHandler($(".click-ShareFB"), function() {
        chrome.extension.sendMessage("click-ShareFB");
      });
      utils.resetClickHandler($(".click-ShareGG"), function() {
        chrome.extension.sendMessage("click-ShareGG");
      });
      utils.resetClickHandler($(".click-ShareTW"), function() {
        chrome.extension.sendMessage("click-ShareTW");
      });
      utils.resetClickHandler($(".click-SharePI"), function() {
        chrome.extension.sendMessage("click-SharePI");
      });
      utils.resetClickHandler($(".click-ShareTU"), function() {
        chrome.extension.sendMessage("click-ShareTU");
      });
      utils.resetClickHandler($(".click-ShareVK"), function() {
        chrome.extension.sendMessage("click-ShareVK");
      });
      utils.resetClickHandler($("#tool_menu a"), function() {
        if ($(this).attr("id") == "mail-address-shower") return;
        chrome.extension.sendMessage({
          name: "click-Apps",
          data: $(this).text().replace(/[ ]*\([0-9]+\)[ ]*$/, "")
        });
      });
      $('[data-toggle="tooltip"]').tooltip();
    });
    e.addEventListener("load", function() {
      $("#__bg").fadeIn(350, function() {
        $("#wrapper").fadeIn(100, function() {
          if (localStorage.getItem("theme_clicked") !== "yes") {
            $("#background_selector_menu").css("font-family", "'neue-bold'");
            $("#background_selector_menu").addClass(localStorage.getItem("highlight") || "highlight");
          }
          var a = function() {
            $("#background_selector_menu").css("font-family", "'neue',Helvetica,Arial,sans-serif");
            $("#background_selector_menu").attr("class", ($("#background_selector_menu").attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
            localStorage.setItem("theme_clicked", "yes");
            utils.localstorage2cookie();
          };
          utils.resetClickHandler($("#background_selector_menu"), function(l) {
            l.preventDefault();
            l.stopPropagation();
            $("#background_selector_widget").fadeIn();
            chrome.extension.sendMessage("click-ChangeThemeMenu");
            a();
            if (!t) {
              t = true;
              e.loadImagesInOption();
              e.loadRelativeApps();
            }
          });
        });
      });
    });
    var l = null;
    var i = 10;
    var o = function() {
      $("#selectTimer").parent().fadeIn();
      if (localStorage.getItem("slideshow_timer")) {
        i = parseInt(localStorage.getItem("slideshow_timer"));
        $("#selectTimer select").val(i);
      }
      $("#selectTimer select").off("change");
      $("#selectTimer select").on("change", function() {
        i = parseInt($(this).val());
        localStorage.setItem("slideshow_timer", i);
      });
      function t() {
        var t = new Date().getTime();
        var a = 0;
        if (localStorage.getItem("last_time_do_slide")) {
          a = parseInt(localStorage.getItem("last_time_do_slide"));
        }
        if (t - a >= i * 1e3) {
          localStorage.setItem("last_time_do_slide", t);
          e.setNewTabBackground();
        }
      }
      if (e.listAllThreads.threadSlideshow) {
        e.listAllThreads.threadSlideshow.pause();
      }
      e.listAllThreads.threadSlideshow = {
        pause: function() {
          clearInterval(l);
        },
        resume: function() {
          t();
          clearInterval(l);
          l = setInterval(t, 999);
        }
      };
      e.listAllThreads.threadSlideshow.resume();
    };
    var s = function() {
      $("#selectTimer").parent().fadeOut();
      clearInterval(l);
      localStorage.removeItem("last_time_do_slide");
    };
  } catch (e) {
    console.log(e);
  }
})(this);