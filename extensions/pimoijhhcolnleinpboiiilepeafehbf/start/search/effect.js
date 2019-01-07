window.loadAutoHideModule = function(e) {
  if (e.autoHideThread) clearTimeout(e.autoHideThread);
  e.autoHideThread = null;
  function t() {
    clearTimeout(e.autoHideThread);
    e.autoHideThread = setTimeout(a, 1e4);
  }
  function a() {
    if ($("#background_selector_widget").css("display") == "none") {
      $("#wrapper").fadeOut(1e3);
    }
  }
  function n() {
    $("#wrapper").fadeIn(1e3);
    t();
  }
  function o() {
    e.listAllThreads.threadAutoHide = {
      pause: function() {
        clearTimeout(e.autoHideThread);
        a();
      },
      resume: function() {
        n();
      }
    };
    t();
    $("body").off("mousemove", n);
    $("input[type=text]").off("focus", s);
    $("input[type=search]").off("keypress", s);
    $("input[type=text], input[type=search]").off("focusout", o);
    $("body").on("mousemove", n);
    $("input[type=text]").on("focus", s);
    $("input[type=search]").on("keypress", s);
    $("input[type=text], input[type=search]").on("focusout", o);
  }
  function s() {
    clearTimeout(e.autoHideThread);
    $("body").off("mousemove", n);
    $("input[type=text]").off("focus", s);
    $("input[type=search]").off("keypress", s);
    $("input[type=text], input[type=search]").off("focusout", o);
  }
  if (localStorage.getItem("enable_autohide") == "yes") {
    o();
  } else {
    s();
  }
  $("#enable_autohide").prop("checked", localStorage.getItem("enable_autohide") === "yes");
  $("#enable_autohide").off("change");
  $("#enable_autohide").on("change", function() {
    localStorage.setItem("enable_autohide", $("#enable_autohide").is(":checked") ? "yes" : "no");
    if ($("#enable_autohide").is(":checked")) {
      o();
    } else {
      s();
    }
    chrome.runtime.sendMessage({
      changeOptions: utils.getGlobalOptions()
    });
  });
};

window.loadSnowModule = function(e) {
  if (e.change_interval) clearInterval(e.change_interval);
  e.change_interval = null;
  var t = function() {
    var t;
    var a = $('<div id="flake" class="snow" />').css({
      position: "absolute",
      "z-index": 999999999,
      top: "-50px",
      cursor: "default",
      "user-select": "none"
    }).html("&#10052;");
    var n = function() {
      var e = $(document).height(), n = $(document).width();
      var o = Math.random() * n - 100, s = .5 + Math.random(), l = t.minSize + Math.random() * t.maxSize, i = e - 40, r = o - 250 + Math.random() * 200, c = e * 10 + Math.random() * 5e3;
      a.clone().appendTo("body").html(t.snow_type).css({
        left: o,
        opacity: s,
        "font-size": l,
        color: t.flakeColor
      }).animate({
        top: i,
        left: r,
        opacity: .3
      }, c, "linear", function() {
        $(this).remove();
      });
    };
    if (!localStorage.getItem("snow_type")) localStorage.setItem("snow_type", "flake");
    switch (localStorage.getItem("snow_type")) {
     case "flake":
      t = {
        minSize: 10,
        maxSize: 25,
        newOn: 500,
        flakeColor: "#0099FF",
        snow_type: "&#10052;"
      };
      break;

     case "ball":
      t = {
        minSize: 5,
        maxSize: 20,
        newOn: 500,
        flakeColor: "#bbb",
        snow_type: "&#x2022;"
      };
      break;
    }
    if (e.listAllThreads.threadSnow) {
      e.listAllThreads.threadSnow.pause();
    }
    e.listAllThreads.threadSnow = {
      pause: function() {
        $(".snow").pause();
        clearInterval(e.change_interval);
      },
      resume: function() {
        $(".snow").resume();
        clearInterval(e.change_interval);
        e.change_interval = setInterval(n, t.newOn);
      }
    };
    e.listAllThreads.threadSnow.resume();
  };
  var a = function() {
    $(".snow").resume();
    clearInterval(e.change_interval);
  };
  if (localStorage.getItem("enable_snow") == "yes") {
    t();
    $("#snow_type").parent().parent().parent().show();
  } else {
    a();
    $("#snow_type").parent().parent().parent().hide();
  }
  $("#enable_snow").prop("checked", localStorage.getItem("enable_snow") === "yes");
  $("#enable_snow").off("change").on("change", function() {
    localStorage.setItem("enable_snow", $("#enable_snow").is(":checked") ? "yes" : "no");
    if ($("#enable_snow").is(":checked")) {
      t();
      $("#snow_type").parent().parent().parent().fadeIn();
    } else {
      a();
      $("#snow_type").parent().parent().parent().fadeOut();
    }
    chrome.runtime.sendMessage({
      changeOptions: utils.getGlobalOptions()
    });
  });
  if (localStorage.getItem("snow_type")) {
    $("#snow_type").val(localStorage.getItem("snow_type"));
  }
  $("#snow_type").off("change").on("change", function() {
    localStorage.setItem("snow_type", $(this).val());
    a();
    t();
  });
};