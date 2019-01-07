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
var conf_s_id = 'app6_oned2';
var conf_default_images =
["http://images.mid-day.com/images/2014/jul/20One-Direction-1.jpg","http://i.ytimg.com/vi/1byaLizuF6s/maxresdefault.jpg","http://i.imgur.com/cJ6Hm0o.jpg","http://images6.fanpop.com/image/photos/37700000/On-The-Road-Again-Tour-2015-one-direction-37708935-500-467.png","http://images-2.drive.com.au/2013/10/02/4796791/One-20Direction-20concert-2014-20131002223215216167-620x414.jpg","http://img2.wikia.nocookie.net/__cb20150118132722/onedirection/images/0/0e/Niall_2015.jpg","http://cdn02.cdn.justjared.com/wp-content/uploads/2014/12/oned-nye/one-direction-new-years-eve-2015-03.jpg","http://img3.wikia.nocookie.net/__cb20150118132711/onedirection/images/6/69/Louis_2015.jpg","http://content.hollywire.com/sites/default/files/FFN_LIB_OneDirection_XFactor_110112_50932871.jpg"];