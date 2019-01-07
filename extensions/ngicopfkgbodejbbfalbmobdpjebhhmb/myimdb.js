
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

var colors;
var userid = getUserId();
if (userid != null) {
  setUserMovieActions();
  chrome.extension.sendMessage({method:"getMovies"}, function(response) {
    if (userid == response.userid) {
      colors = response;
      console.log("READ titles: " + response.titles);
      highlightUserMovies(response.movies);
      getUserMovies(response.titles);
    } else {
      chrome.extension.sendMessage({method:"setMovies", userid:userid, titles:0, movies:""});
      getUserMovies(0);
    }
  });
} else {
  chrome.extension.sendMessage({method:"setMovies", userid:"", titles:0, movies:""});
}

function getUserId() {
  var link = document.evaluate(
      '//div[@class="subNavListContainer"]/ul/li/a[starts-with(@href, "/user/ur")]',
      document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  return link.singleNodeValue ? parseUserId(link.singleNodeValue.href) : null;
}

function parseUserId(url) {
  var match = /user\/ur(\d+)[\/\?]/.exec(url);
  return match ? match[1] : null;
}

function parseMovieId(url) {
  var match = /title\/tt(\d+)[\/\?]/.exec(url);
  return match ? match[1] : null;
}

function setUserMovieActions() {
  if (parseMovieId(document.location.href)) {
    var voteLinks = document.evaluate('//td[@id="overview-top"]//span[@class="rating-stars"]/a',
        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < voteLinks.snapshotLength; i++) {
      voteLinks.snapshotItem(i).addEventListener("click", function() {
        console.log("FORCE update");
        getUserMovies(0);
      }, false);
    }
  }
}

function getUserMovies(savedTitles) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      var lines = xmlhttp.responseText.split("\n");
      var titles = lines.length - 2;
      if (titles < 0) {
        return;
      }
      console.log("CHECK titles: " + savedTitles + "/" + titles);
      if (titles != savedTitles) {
        var info;
        var movies = "";
        for (var i = 1; i < lines.length - 1; i++) {
          info = lines[i].split(",");
          movies += "," + info[0].substr(2) + "|" + info[1];
        }
        movies = movies.substr(1);
        console.log("SAVE titles: " + titles);
        chrome.extension.sendMessage({method:"setMovies", userid:userid,
          titles:titles, movies:movies});
        highlightUserMovies(movies);
      }
    }
  };
  xmlhttp.open("GET", "https://www.imdb.com/list/export?list_id=ratings&author_id=ur" + userid);
  xmlhttp.send(null);
}

function highlightUserMovies(movies) {
  if (!movies) {
    return;
  }

  console.log("HIGHLIGHT");
  var ratings = new Array();
  var list = movies.split(",");
  for (var i = 0; i < list.length; i++) {
    var data = list[i].split("|");
    ratings[data[0]] = data[1];
  }

  // Movie page.
  var movieId = parseMovieId(document.location.href);
  if (movieId) {
    var titleElem = document.evaluate('//h1[@class="header"]/span[@itemprop="name"]',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var movieRating = ratings[movieId];
    if (titleElem) {
      if (isEnhanced(titleElem)) {
        unenhance(titleElem);
      }
      if (movieRating) {
        enhance(titleElem, movieRating, "main")
      }
    }
  }

  // Movie links.
  var links = document.evaluate('//a[starts-with(@href, "/title/tt")]',
      document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < links.snapshotLength; i++) {
    var titleElem = links.snapshotItem(i);
    if (!isMainMoviePageUrl(titleElem.href)
        || titleElem.parentNode.id == "tn15crumbs" // old style page breadcrumbs
        || titleElem.href.indexOf("ref_=nm_knf_i") > 0 // known for image link
        || titleElem.href.indexOf("ref_=shtt_ov_i") > 0 // showtime and tickets for image link
        ) continue;
    var movieRating = ratings[parseMovieId(titleElem.href)];
    if (movieRating && !isEnhanced(titleElem) && !isImage(titleElem)) {
      enhance(titleElem, movieRating, "link")
    }
    if (!movieRating && isEnhanced(titleElem)) {
      unenhance(titleElem);
    }
  }
}

function isMainMoviePageUrl(url) {
  return /title\/tt\d+\/*\?ref_/.exec(url) || /title\/tt\d+\/$/.exec(url);
}

function enhance(titleElem, rating, type) {
  var ratingElem = document.createElement("span");
  ratingElem.className = "enhanced-rating-" + type;
  ratingElem.setAttribute("style", getStyleColors(colors.ratingFg, colors.ratingBg));
  ratingElem.innerHTML = rating;
  titleElem.parentNode.insertBefore(ratingElem, titleElem);
  titleElem.className = "enhanced-title-" + type;
  titleElem.setAttribute("style", getStyleColors(colors.titleFg, colors.titleBg));
}

function unenhance(titleElem) {
  titleElem.parentNode.removeChild(titleElem.previousSibling);
  titleElem.className = "";
  titleElem.setAttribute("style", "");
}

function isEnhanced(titleElem) {
  return titleElem.className.indexOf("enhanced") >= 0;
}

function getStyleColors(fg, bg) {
  return "color:#" + fg + "; background-color:#" + bg;
}

function isImage(titleElem) {
  var count = titleElem.childNodes.length;
  if (count > 2) count = 2;
  for (var i = 0; i < count; i++) {
    if (titleElem.childNodes[i].tagName == "IMG") return true;
  }
  return false;
}
