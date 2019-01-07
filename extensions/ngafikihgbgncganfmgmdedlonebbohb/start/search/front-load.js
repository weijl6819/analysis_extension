(function(e) {
  e.listAllThreads = {};
  e.chosenRandomBG = "";
  e.setBackgroundGIFOrJPG = function(e) {
    var t = e.replace("bg-0", "").replace("bg-", "").replace(".jpg", "");
    localStorage.setItem("last_bg", t);
    var o = Object.keys(user["bg_color_gif"]).indexOf(e.replace(/\.jpg$/, ".gif"));
    if (o > -1) {
      chosenRandomBG = e.replace(/\.jpg$/, ".gif");
      document.getElementById("__bg").style.backgroundImage = "url(" + chrome.extension.getURL("/start/skin/images/" + chosenRandomBG) + ")";
      var a = Object.values(user["bg_color_gif"])[o];
      if (Math.floor(Math.random() * 100) < 10 || a.indexOf("frame") > -1 || a === "white" || a === "#ffffff") {
        var n = Math.floor(Math.random() * user["frame_bg_list"]);
        var g = "frame-bg-" + ("0" + n).slice(-2) + ".png";
        if (!document.getElementById("frame_bg")) {
          var r = document.createElement("div");
          r.setAttribute("id", "frame_bg");
          r.style = 'background-image: url("/start/skin/images/' + g + '"); width: 100%; height: 100%; background-repeat: no-repeat; background-size: 900px; background-position: center center;';
          document.getElementById("__bg").insertBefore(r, document.getElementById("__bg").childNodes[0]);
        }
        if (a.indexOf("frame") > -1 || a === "#ffffff") {
          a = a.replace("frame", "").replace(/[ ,\-]/g, "");
          if (!a || a === "white" || a === "#ffffff") a = "black";
        }
        document.getElementById("__bg").style.backgroundColor = a;
        document.getElementById("__bg").style.backgroundSize = "485px 320px";
      } else {
        if (document.getElementById("frame_bg")) document.getElementById("frame_bg").remove();
        document.getElementById("__bg").style.backgroundColor = a;
        document.getElementById("__bg").style.backgroundSize = "490px";
      }
    } else {
      chosenRandomBG = e.replace(/\.gif$/, ".jpg");
      document.getElementById("__bg").style.backgroundImage = "url(" + chrome.extension.getURL("/start/skin/images/" + chosenRandomBG) + ")";
      document.getElementById("__bg").style.backgroundColor = "none";
      document.getElementById("__bg").style.backgroundSize = "cover";
      if (document.getElementById("frame_bg")) {
        document.getElementById("frame_bg").remove();
      }
    }
  };
  e.setNewTabBackground = function() {
    var t = "" + localStorage.getItem("last_bg");
    var o = [], a = [];
    if (localStorage.getItem("mark_favor")) {
      o = JSON.parse(localStorage.getItem("mark_favor"));
      if (o.length >= 2 && o.indexOf(t) > -1) {
        o.splice(o.indexOf(t), 1);
      }
      if (o.length) a = o.join("|").split("|");
    }
    for (var n = 1; n <= user["bg_img_list"]; n++) {
      if ("" + n !== t) a.push("" + n);
    }
    if (localStorage.getItem("shuffle_background") == "yes" || localStorage.getItem("shuffle_favorites") == "yes" && o.length == 0) {
      var g;
      if (t == "0") {
        g = 1;
      } else {
        g = a[Math.floor(Math.random() * a.length)];
      }
      chosenRandomBG = "bg-" + ("0" + g).slice(-2) + ".jpg";
    } else if (localStorage.getItem("shuffle_favorites") == "yes") {
      var g = o[Math.floor(Math.random() * o.length)];
      chosenRandomBG = "bg-" + ("0" + g).slice(-2) + ".jpg";
    } else {
      chosenRandomBG = "bg-" + ("0" + t).slice(-2) + ".jpg";
    }
    e.setBackgroundGIFOrJPG(chosenRandomBG);
  };
  e.setNewTabBackground();
})(this);