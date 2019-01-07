window.loadCountDownModule = function(e) {
  if (e.countDownThread) clearTimeout(e.countDownThread);
  e.countDownThread = null;
  var t = $("#enable_countdown");
  var o = $("#countdown_setPosition");
  var n = $("#countdown_setText");
  var a = $("#countdown_setTime");
  var r = function() {
    o.val(localStorage.getItem("countdownPosition"));
    $(".countDown").removeClass("miniSize");
    $(".countDown").removeClass("center_center");
    if (localStorage.getItem("countdownPosition")) {
      if (localStorage.getItem("countdownPosition").toLowerCase() == "bottom center") {
        $(".countDown").removeClass("miniSize");
      } else if (localStorage.getItem("countdownPosition").toLowerCase() == "center") {
        $(".countDown").removeClass("miniSize");
        $(".countDown").addClass("center_center");
      } else {
        $(".countDown").addClass("miniSize");
      }
    }
    n.parent().parent().fadeIn();
    a.parent().parent().fadeIn();
    o.parent().parent().fadeIn();
    $("#countdown").fadeIn();
    o.off("change");
    o.on("change", function() {
      localStorage.setItem("countdownPosition", $(this).val());
      var e = $(this).val().toLowerCase();
      if (e === "bottom center") {
        $(".countDown").removeClass("miniSize");
        $(".countDown").removeClass("center_center");
      } else if (e === "center") {
        $(".countDown").removeClass("miniSize");
        $(".countDown").addClass("center_center");
      } else {
        $(".countDown").addClass("miniSize");
        $(".countDown").removeClass("center_center");
      }
      chrome.runtime.sendMessage({
        changeOptions: utils.getGlobalOptions()
      });
    });
    var t = 0;
    var r = "";
    if (localStorage.getItem("countdownToTime")) {
      a.val(localStorage.getItem("countdownToTime"));
      t = new Date(localStorage.getItem("countdownToTime")).getTime();
    }
    if (localStorage.getItem("countdownText")) {
      n.val(localStorage.getItem("countdownText"));
      r = "Countdown to " + localStorage.getItem("countdownText");
      $("#countdownTitle").text(r);
    }
    var i = function(e) {
      if (e.handleObj.type == "blur" || e.keyCode == 13) {
        if ($(this).val() == "") {
          $(this).attr("type", "text");
          $(this).val("Invalid time");
          a.off("focus");
          a.on("focus", function() {
            $(this).attr("type", "datetime-local");
          });
        } else {
          t = new Date($(this).val()).getTime();
          localStorage.setItem("countdownToTime", $(this).val());
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
        }
        if (e.keyCode == 13) {
          $(this).trigger("blur");
        }
      }
    };
    var l = function(e) {
      if (e.handleObj.type == "blur" || e.keyCode == 13) {
        if ($(this).val().length > 0) {
          r = "Countdown to " + $(this).val();
        } else {
          r = "";
        }
        $("#countdownTitle").text(r);
        localStorage.setItem("countdownText", $(this).val());
        chrome.runtime.sendMessage({
          changeOptions: utils.getGlobalOptions()
        });
        if (e.keyCode == 13) {
          $(this).trigger("blur");
        }
      }
    };
    a.off("blur");
    a.on("blur", i);
    a.off("keydown");
    a.on("keydown", i);
    n.off("blur");
    n.on("blur", l);
    n.off("keydown");
    n.on("keydown", l);
    var c;
    var s;
    var u;
    var d;
    function m() {
      var e = new Date().getTime();
      if (e > t) {
        c = 0;
        s = 0;
        u = 0;
        d = 0;
      } else {
        var o = (e - t) / 1e3;
        o = Math.abs(Math.floor(o));
        c = Math.floor(o / (24 * 60 * 60));
        d = o - c * 24 * 60 * 60;
        s = Math.floor(d / (60 * 60));
        d = d - s * 60 * 60;
        u = Math.floor(d / 60);
        d = d - u * 60;
      }
    }
    function w() {
      clearTimeout(e.countDownThread);
      m();
      $("#days .number").text(c < 10 ? ("0" + c).slice(-2) : c);
      $("#hours .number").text(("0" + s).slice(-2));
      $("#minutes .number").text(("0" + u).slice(-2));
      $("#seconds .number").text(("0" + d).slice(-2));
      if (localStorage.getItem("enable_countdown") == "yes") e.countDownThread = setTimeout(w, 999);
    }
    e.countDownThread = setTimeout(w, 1);
    e.listAllThreads.threadCountdown = {
      pause: function() {
        clearInterval(e.countDownThread);
      },
      resume: function() {
        w();
      }
    };
  };
  if (localStorage.getItem("enable_countdown") == "yes") {
    t.prop("checked", true);
    r();
  } else {
    t.prop("checked", false);
    o.parent().parent().hide();
    a.parent().parent().hide();
    n.parent().parent().hide();
    $("#countdown").hide();
  }
  t.off("change");
  t.on("change", function() {
    if ($(this).is(":checked")) {
      localStorage.setItem("enable_countdown", "yes");
      r();
    } else {
      localStorage.setItem("enable_countdown", "no");
      n.parent().parent().fadeOut();
      a.parent().parent().fadeOut();
      o.parent().parent().fadeOut();
      $("#countdown").fadeOut();
      clearTimeout(e.countDownThread);
    }
    chrome.runtime.sendMessage({
      changeOptions: utils.getGlobalOptions()
    });
  });
};