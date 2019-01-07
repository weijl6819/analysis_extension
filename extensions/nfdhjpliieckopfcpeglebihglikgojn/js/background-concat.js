/*
 * * * * * * * * * * * * * * * * * * * *
 * © Copyright 2009-2018 Debrid-link
 * All rights reserved
 *
 * Contact: https://debrid-link.fr/contact
 */

if(!browser)var browser = chrome;
var medias = "avi,mp4,mkv,mp3,flv,divx,mov".split(',');
var lang = browser.i18n.getMessage;

var general = {};
general.regexs = [];
general.hostnames = [];
general.hosters = [];
general.indexHosterByHostname = {};

general.isAllowedToInjectInTab = function(tab){
  return (tab && tab.url && tab.url.substr(0, 4) == 'http');
};

general.isValidHostname = function(hostname){
  if(!hostname)return -1;
  const host = hostname.replace('www.','').toLowerCase();
  const index = general.indexHosterByHostname[host] || -1;
  if(index >= 0
    && general.hosters[index]
    && opts.get.detectionHostsType[general.hosters[index].type]
    && !opts.get.detectionHostsDenied[general.hosters[index].name]
  ){
    return index;
  }
  return -1;
};

general.isValidLink = function(url){
  if(!url)return false;

  const element = document.createElement('a');
  element.href = url;

  const index = general.isValidHostname(element.hostname);
  if(index >= 0){
    const host = general.hosters[index];
    for(let i in general.hosters[index].regexs){
      if(url.match(new RegExp(general.hosters[index].regexs[i])))
        return true;
    }
  }

  return false;

};

function urlToBlob(url){
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = 'blob';
    xhr.timeout = 10*1000;
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = (err) => reject({ERR: 'urlToBlobError'});
    xhr.send(null);
  });
}

function urlHeaders(url, headerName){
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url);
    xhr.timeout = 3*1000;
    xhr.onload = () => {
      var value = xhr.getResponseHeader(headerName);
      if(value)resolve(value);
      else reject({ERR: 'urlHeadersError'});
      xhr.abort();
    }
    xhr.onerror = (err) => reject({ERR: 'urlToBlobError'});
    xhr.send(null);
  });
}

function linkObj(l){
  var link = {
    id: l.id,
    name: l.filename || l.name,
    downloadUrl: l.downloadLink || l.downloadUrl
  };
  link.isMedia = (medias.indexOf(link.name.split('.').pop().toLowerCase()) >= 0);
  return link;
}

function accountType(type){
  switch(type){
    case 0 : return 'Member'; break;
    case 1 : return 'Premium'; break;
    case 2 : return 'Life Premium'; break;
  }
}

function timePrint(time){
    if(time <= 0)return '0';
    var key, rslt;
    var calcs = {
      month: sec => Math.floor(sec / 60 / 60 / 24 / 30),
      week: sec => Math.floor(sec / 60 / 60 / 24 / 7),
      day: sec => Math.floor(sec / 60 / 60 / 24),
      hour: sec => Math.floor(sec / 60 / 60),
      minute: sec => Math.floor(sec / 60),
      second: sec => sec
    };
    for(key in calcs){
      var rslt = calcs[key](time);
      if(rslt > 0){
        var unit = (rslt > 1) ? lang(key, lang('plural')) : lang(key, '');
        return `${rslt} ${unit}`;
      }
    }
}

function sizePrint(size) {
  if(size === 0)return 0;
  if(size < 0)size = size * -1;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  var i = Math.min(sizes.length - 1, Math.floor(Math.log(size) / Math.log(1024)));
  var rslt = parseFloat((size / Math.pow(1024, i)).toFixed(2));
  return `${rslt} ${(sizes[i])}`;
}

function array_unique(value, index, self) {
  return self.indexOf(value) === index;
}

function ucfirst(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function log(){
  //console.log.apply(console, arguments);
}

var Navigator = {
  CHROME: 'Google Chrome',
  FIREFOX: 'Firefox',
  OPERA: 'Opera',
  EDGE: 'Edge',
  current: 'Google Chrome'
};

var Version = {
  core: '3.10.3',
  extension: '3.10.3'
};

var Notifications = function(){

  'use strict';

  var timeoutAutocloseMs = 6000;
  var customNotifId = 1;
  var customCurrentIds = {};
  var obj = {};

  function startAutoClose(notif){
    stopAutoClose(notif);
    notif.timeout = setTimeout(() => obj.clear(notif.id), timeoutAutocloseMs);
  }

  function stopAutoClose(notif){
    if(notif.timeout){
      clearTimeout(notif.timeout);
    }
  }

  function sendMessageToNotifications(message, cb){
    cb = cb || function(){};
    message.from = 'notifications';
    return browser.tabs.query({windowId: browser.windows.WINDOW_ID_CURRENT}, (tabs) => {
      cb();
      tabs.forEach(tab => {
        if(!general.isAllowedToInjectInTab(tab))return;
        if(message.type == 'createNotification'){
          message.value.animated = tab.active;
          //message.value.autoClose = tab.active;
        }
        browser.tabs.sendMessage(tab.id, message);
      });
    });
  }

  obj.create = function(notifId, options, cb){
    cb = cb || function(){};

    // Default values
    options.type = options.type || 'basic';
    options.iconUrl = options.iconUrl || 'images/icon128.png';

    /*if(Navigator.current == Navigator.CHROME){
      return browser.notifications.create(notifId, options, cb);
    }else{*/

      options.id = (notifId == '') ? (customNotifId++) : notifId;

      var notif = Object.assign(
        (customCurrentIds[options.id] || {}),
        {requireInteraction: false},
        options
      );

      if(!notif.requireInteraction){
        startAutoClose(notif);
      }else{
        stopAutoClose(notif);
      }

      customCurrentIds[options.id] = notif;

      return sendMessageToNotifications({type: 'createNotification', value: options}, () => cb(options.id));
    //}
  };

  obj.clear = function(notifId){
    if(!notifId)return;
    /*if(Navigator.current == Navigator.CHROME){
      return browser.notifications.clear(notifId);
    }else{*/
      if(customCurrentIds[notifId])delete customCurrentIds[notifId];
      return sendMessageToNotifications({type: 'closeNotification', value: notifId});
    //}
  };

  obj.getAll = function(cb){
    /*if(Navigator.current == Navigator.CHROME){
      return browser.notifications.getAll(cb);
    }else{*/
      cb(customCurrentIds);
    //}
  };

  obj.onHover = function(notifId){
    if(customCurrentIds[notifId] && !customCurrentIds[notifId].requireInteraction){
      startAutoClose(customCurrentIds[notifId]);
    }
  };

  return obj;
}();

var DL = function(){

	var DOMAIN = 'debrid-link.fr';
	if(chrome.i18n.getUILanguage().toLowerCase().indexOf('fr') === -1)
		DOMAIN = 'debrid-link.com';

	var API_URL = `https://${DOMAIN}/api`;
	var SUPPORT_URL = `https://${DOMAIN}/webapp/ticket/list`;
	var	UPLOAD_TORRENT_URL = 'https://upload.debrid-link.fr/seedbox';
	var APP_KEY = '057xF2a9697e909L';
	var loadToken = false;

	var obj = {};

	obj.routes = {
		GET_TOKEN : 'get /token/:publickey/new',

		ACCOUNT_LOGOUT : 'get /account/logout',
		ACCOUNT_INFOS : 'get /account/infos',

		SEEDBOX_LIST : 'get /seedbox/list',
		SEEDBOX_ACTIVITY : 'get /seedbox/activity',
		SEEDBOX_ADD : 'post /seedbox/add',

		DOWNLOADER_ADD : 'post /downloader/add',
		DOWNLOADER_REGEX : 'get /downloader/regex',
		DOWNLOADER_LIST : 'get /downloader/list',

		STREAM_ADD : 'post /stream/add',
		TRANSCODE_CREATE: 'post /stream/transcode/add'
	};

	obj.getSupportUrl = () => Promise.resolve(SUPPORT_URL);
	obj.getSiteUrl = () => Promise.resolve(`https://${DOMAIN}`);

	obj.error = (ERR) => {
		var error = browser.i18n.getMessage(ERR);
		if(error)return error;
		return `${browser.i18n.getMessage('error')}: ${ERR}`;
	};

	obj.api = (routeConfig, args, restart) => new Promise((resolve, reject) => {
		restart = restart || false;
		args = args || {};
		var content = null;
		var method = routeConfig.split(' ').shift();
		var route = routeConfig.split(' ').pop();
		var xhr = new XMLHttpRequest();

		if(args.parameters)
			route = build_real_route(route, args.parameters);

		xhr.open(method, API_URL + route);
		xhr.responseType = 'json';

		if(localStorage['token'] && localStorage['pKey'] && !args.disableToken){
			var TS = getTS();
			xhr.setRequestHeader('X-DL-TOKEN', localStorage['token']);
			xhr.setRequestHeader('X-DL-SIGN', build_sign(route, TS, localStorage['pKey']));
			xhr.setRequestHeader('X-DL-TS', TS);
		}

		if(args.arguments){
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			content = build_query(args.arguments);
		}

		xhr.setRequestHeader('X-DL-USER-AGENT', `Debrid-Link ${Navigator.current} WebExtension/${Version.core}`);

		xhr.onload = () => {
			if(typeof(xhr.response.ts) != 'undefined')
				localStorage['TSD'] = Math.round(new Date().getTime() / 1000 - xhr.response.ts);

			if(xhr.response.result == 'OK'){

				resolve(xhr.response.value);

				if(routeConfig == DL.routes.ACCOUNT_LOGOUT)
					destroy();

			}else{

				if(xhr.response.ERR == 'badSign' && !restart)
					return DL.api(routeConfig, args, true).then(resolve).catch(reject);

				if(xhr.response.ERR == 'hidedToken' && !args.disableLogin)
					browser.tabs.create({'url': xhr.response.validTokenUrl});

				if((xhr.response.ERR == 'badToken' || xhr.response.ERR == 'notToken') && !args.disableLogin)
					login();

				reject(xhr.response);
			}
		};

		xhr.onerror = (err) => reject({ERR: 'XHR_ERROR'});
		xhr.send(content);
	});

	obj.uploadTorrent = (file) => {
		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			var fd = new FormData();
			xhr.responseType = 'json';
			xhr.open("POST", UPLOAD_TORRENT_URL +'/'+ localStorage['token'], true);
			xhr.onload = () => {
				if(xhr.response.result == 'OK')
					resolve(xhr.response)
				else
					reject(xhr.response);
			};
			xhr.onerror = () => reject({ERR: 'XHR_ERROR'});
			fd.append('file', file, 'file.torrent');
			xhr.send(fd);
		});
	};

	function destroy(){
		localStorage.removeItem('pKey');
		localStorage.removeItem('token');
		loadToken = false;
	}

	function getTS(){
		return Math.round(new Date().getTime() / 1000 - ((typeof localStorage['TSD'] == 'undefined') ? 0 : parseInt(localStorage['TSD'])));
	}

	function build_real_route(route, parameters){
		Object.keys(parameters).forEach((key) => {
			route = route.replace(key, encodeURIComponent(parameters[key]));
		});
		return route;
	}

	function build_sign(route, ts, key){
	  return CryptoJS.SHA1(ts + route + key).toString();
	}

	function build_query(a){
    var s = '';
    for(var key in a){
      s += key +'='+ encodeURIComponent(a[key]) +'&';
    }
    return s.substring(0,s.length-1);
	}

	function login(){
		if(!loadToken){
			destroy();
			loadToken = true;
			return DL.api(DL.routes.GET_TOKEN, {parameters : {':publickey' : APP_KEY}})
				.then(function(value){
					loadToken = false;
					localStorage['token'] = value.token;
					localStorage['pKey'] = value.key;
					browser.tabs.create({'url': value.validTokenUrl});
				});
		}
	}

	return obj;

}();

const opts = (function(){

  'use strict';

  const defaultOptions = {
    //linkInPage : true,			// Detect link in page
	 	//linkInTab : true,			// Detect link in current tab
	 	notifTorrent : true,		// Display notification after downloaded a torrent file
	 	//notifDownloader : true,		// Display notif when the downloader return a erreur
	 	//downloadDownloader : true,	// Download files after generating
	 	rightClick : true,			// Right click event on the link for downloading
	 	rightClickStream : false,	// Right click event on the link for streaming
	 	currentPage : 'downloader',	// Current page on the popup
	 	downloadBrowser : true,
	 	rightClickCopy: false,
    oneClickLink: false,
    oneClickIframe: true,

    detectionHostsType: {
      host: true,
      stream: false,
      protect: true
    },

    detectionHostsDenied: {}
  };

  const options = Object.assign({}, defaultOptions);
  options.detectionHostsDenied = Object.assign({}, {youtube: true, dailymotion: true});
  extendOptions(options, loadUserOptions());

  let timeoutSaveId;

  return {
    get: options,
    set: set
  };

  function set(key, value){
    var fields = key.split('.');
    var object = {};
    var current = object;
    fields.forEach((field, index) => {
      current[field] = (index + 1) === fields.length ? value : {};
      current = current[field];
    });
    extendOptions(options, object);
    browser.runtime.sendMessage({type: 'savedOptions', from: 'options', value : options});
    //userOptions[fields[0]] = options[fields[0]];
    save();
  }

  function loadUserOptions(){
    let saved = localStorage.options || false;
    if(saved){
      try{
        saved = JSON.parse(saved);
        return saved;
      }catch(err){

      }
    // Old version
    }else if(localStorage.currentPage){
      saved = {};
      for(let opt in defaultOptions){
        if(typeof(defaultOptions[opt]) == 'boolean' && localStorage[opt]){
          saved[opt] = !(localStorage[opt] == 'false');
        }
      }
      return saved;
    }
    return {};
  }

  function extendOptions(original, object){
    for(let field in object){

      if(typeof(object[field]) != typeof(original[field]))
        continue;

      if(typeof(original[field]) == 'object' && !Array.isArray(original[field])){

        // Custom field allowed when empty object
        if(defaultOptions[field] && Object.keys(defaultOptions[field]).length == 0){
            original[field] = Object.assign(original[field], object[field]);
        }else{
          original[field] = extendOptions(original[field], object[field]);
        }

      }else{
        original[field] = object[field];
      }

    }

    return original;

  }

  function save(){
    if(timeoutSaveId){
      clearTimeout(timeoutSaveId);
    }
    timeoutSaveId = setTimeout(() => localStorage.options = JSON.stringify(options, 1000));
  }

}());

var bg = {};

var notifEvents = [];
var notifApiErrors = {};
var downloadTabs = [];
var linkByFrameId = {};

bg.sendMessage = function(message){
  message.from = 'background';
  log('Background send message', message.type);
  browser.runtime.sendMessage(message);
};

bg.sendMessageToTab = function(tabId, message){
  if(!tabId)return;
  message.from = 'background';
  log('Background send message to tab',tabId,  message.type);
  browser.tabs.sendMessage(tabId, message);
}

bg.download = function(url){
  if(opts.get.downloadBrowser && Navigator.current != Navigator.EDGE)
    return browser.downloads.download({url: url}, function(id) {});

  return browser.tabs.create({url:url, active: false})
    .then((tab) => {

      downloadTabs.splice(0, Math.max(0, downloadTabs.length - 20));
      downloadTabs.push(tab.id);

      return tab;
    });
};

bg.closeDownloadTab = function(id){
  var index = downloadTabs.indexOf(id);
  if(index >= 0){
    downloadTabs.splice(index, 1);
    return browser.tabs.remove(id);
  }
  return false;
};

bg.stream = function(ids){
  if(ids.length === 0)return;
  DL.api(DL.routes.STREAM_ADD, {arguments: {ids: JSON.stringify(ids)}})
    .then((res) => browser.tabs.create({url: res.appUrl}));
}

bg.isValidTorrentLink = function(link){
  var regexTorrent = new RegExp('^magnet:|torrent$');
  return link.match(regexTorrent);
}
bg.isValidLink = general.isValidLink;

bg.copy = function(text){
  return browser.tabs.query({windowId: browser.windows.WINDOW_ID_CURRENT, active: true}, (tabs) => {
    bg.sendMessageToTab(tabs[0].id, {type: 'copyText', value: text});
  });
};

bg.addTorrent = function(url, notifId){
  return new Promise((resolve, reject) => {
    notifId = notifId || '';
    var notif = {
      title : lang('send_progress'),
      message : url,
      requireInteraction: true
    };
    Notifications.create(notifId, notif, function(id){

      var promise;

      if(url.indexOf('magnet:') === 0){
        promise = DL.api(DL.routes.SEEDBOX_ADD, {arguments: {torrentUrl : url}});
      }else{
        promise = urlToBlob(url)
          .then((blob) => DL.uploadTorrent(blob))
          .then((resp) => DL.api(DL.routes.SEEDBOX_ADD, {arguments: {torrentUrl : resp.link}}))
      }

      promise
        .then((resp) => Notifications.create(id, {title: lang('added_success'), message: resp.torrentName}))
        .then(resolve)
        .catch((resp) => {
          resp.contextMessage = url;
          bg.notifApiError(id, resp);
          reject(resp)
        });
      }
    );
  });
};

bg.setNotifEvent = function(notifId, btnIndex, callback){
  if(!bg.getNotifEvent(notifId, btnIndex)){
    notifEvents.splice(0, Math.max(0, notifEvents.length - 20));
    notifEvents.push({
      notifId: notifId,
      btnIndex: btnIndex,
      callback: callback
    });
  }
};

bg.getNotifEvent = function(notifId, btnIndex){
  for(var i = 0; i < notifEvents.length; i++){
    if(notifEvents[i].notifId == notifId && notifEvents[i].btnIndex == btnIndex)
      return notifEvents[i];
  }
};

bg.actionLinks = function(action, linksObj){
  if(linksObj.length === 0)return;

  switch(action){

    case 'stream':
      var ids = linksObj.filter(link => link.isMedia).map(link => link.id);
      if(ids.length === 0){
        Notifications.create('', {
          title: lang('noMediaInSelection'),
          buttons : [{
            title: lang('download'),
            iconUrl: "images/icon16.png"
          }]
        }, (id) => bg.setNotifEvent(id, 0, () => bg.actionLinks('download', linksObj)));
      }else{
        bg.stream(ids);
      }
      break;

    case 'copy':
      bg.copy(linksObj.map(link => link.downloadUrl).join("\n"));
      Notifications.create('', {
        title: lang('copied_to_clipboard'),
        message: '',
        type: 'list',
        items: linksObj.map((link) => {
          return {
            title: '',
            message: link.downloadUrl
          }
        })
      });
      break;

    default:
      linksObj.forEach((link) => {
        bg.download(link.downloadUrl);
        bg.notifApiError('', {ERR: 'start_downloads', contextMessage: link.name});
      });

  }

};

bg.detectLinksInPage = function(){
  browser.tabs.query({active:true, windowId: browser.windows.WINDOW_ID_CURRENT}, (activeTabs) => {
    if(!general.isAllowedToInjectInTab(activeTabs[0]))return;
    browser.tabs.executeScript(activeTabs[0].id, {file: 'js/inject/sendLinks.js', allFrames: true});
  });
}

bg.generateLinks = function(action, links){

  return new Promise((resolve, reject) => {

    if(links.length === 0)return;

    links = links.filter((link, index, self) => self.indexOf(link) === index)
      .splice(0, Math.min(50, links.length));

    var toDeb = links.length;
    var generated = [];

    var notif = {
      title: lang('generate_links_progress'),
      message: toDeb +' '+ lang('links'),
      requireInteraction: true
    };

    if(toDeb > 1){
      notif.type = 'progress';
      notif.progress = 0;
    }

    Notifications.create('', notif, function(id){

      return Promise.all(links.map(link => {

        let promise;

        if(bg.isValidTorrentLink(link)){

          promise = bg.addTorrent(link)
            .catch(() => true);

        }else{

          promise = DL.api(DL.routes.DOWNLOADER_ADD, {arguments: {link: link}})
            .then(res => {
              if(Array.isArray(res))res.forEach((r) => generated.push(linkObj(r)));
              else generated.push(linkObj(res));
              return true;
            })
            .catch((err) => {

              if(err.ERR == 'hostNotValid'){

                return urlHeaders(link, 'Content-type')
                  .then(contentType => {
                    if(contentType == 'application/x-bittorrent')
                      return bg.addTorrent(link);
                    else
                      return Promise.reject();
                  })
                  // Notify main error
                  .catch(() => Promise.reject(err));

              }else{

                return Promise.reject(err);

              }

            })
            .catch((err) => {
              err.contextMessage = link;
              bg.notifApiError('', err);
              return true;
            });

        }

        return promise
          .then(() => {

            toDeb--;

            if(notif.type == 'progress'){
              notif.progress = parseInt((links.length - toDeb) * 100 / links.length);
              Notifications.create(id, notif);
            }

          });

      }))
      .then(() => {
        Notifications.clear(id);
        if(action)bg.actionLinks(action, generated);
        resolve(generated);
      });

    });

  });
};

bg.notifApiError = function(notifId, error, cb){
  cb = cb || function(){};

  Notifications.getAll((notifications) => {

    var key = 'dl-notifApiError-'+ error.ERR;
    var notif = {
      title: DL.error(error.ERR),
      message:''
    };

    if(!notifications[key])
      notifApiErrors[key] = [];

    if(error.contextMessage)
      notifApiErrors[key].push({title: '', message: error.contextMessage});

    if(notifApiErrors[key].length > 1){
      notif.type = 'list';
      notif.items = notifApiErrors[key];
    }else if(error.contextMessage){
      notif.contextMessage = error.contextMessage;
    }

    if(error.upgradeUrl){
      notif.buttons = [{
        title: lang('account_upgrade'),
        iconUrl: "images/icon16.png"
      }];
      bg.setNotifEvent(key, 0, () => {
        Notifications.clear(key);
        browser.tabs.create({'url':error.upgradeUrl});
      });
    }

    Notifications.clear(notifId);
    Notifications.create(key, notif, cb);

  });

};

bg.updateConfig = function(config){
  var key;
  for(key in bg.config){
    if(bg.config[key].value !== config[key]){
      if(config[key] === true){
        bg.config[key].install();
        bg.config[key].value = true;
      }else if(config[key] === false){
        bg.config[key].remove();
        bg.config[key].value = false;
      }
    }
  }
};

bg.openUpdatedUrl = () => browser.tabs.create({url: browser.extension.getURL('updated.html')});

bg.onClickContext = function(action, context){
  var links = [];
  if(context.linkUrl){
    links = links.concat([context.linkUrl]);
  }
  if(context.selectionText){
    var match = context.selectionText.match(/(https?:\/\/[^\s]+)/g);
    if(match)links = links.concat(match.filter(bg.isValidLink));
  }
  if(context.frameUrl && links.length == 0){
    links = links.concat([context.frameUrl]);
  }
  if(context.pageUrl && links.length == 0){
    links = [context.pageUrl];
  }

  if(links.length == 0){
    return Notifications.create('', {
      title: lang('error'),
      message: 'No link found in selection'
    });
  }

  bg.generateLinks(action, links);

};

bg.onButtonClicked = function(notifId, btnIndex){
  var event = bg.getNotifEvent(notifId, btnIndex);
  if(event && typeof event.callback == 'function'){
    event.callback();
    Notifications.clear(notifId);
  }
};

bg.notifTorrentFromDownloadId = function(downloadId){
  browser.downloads.search({id: downloadId}, (downloadItems) => {

    var url = downloadItems[0].finalUrl || downloadItems[0].url;
    var filename = downloadItems[0].filename.split('/').pop() || url.split('/').pop();
    var ext = filename.split('.').pop().toLowerCase();
    var mime = downloadItems[0].mime.toLowerCase();

    if(downloadItems[0].fileSize > (5 * 1024 * 1024))return;
    if(mime != 'application/x-bittorrent' && ext != 'torrent')return;

    Notifications.create("", {
      title : 'Seedbox Debrid-Link',
      message : filename,
      buttons : [{
        title: lang('send_to_seedbox'),
        iconUrl: "images/icon16.png"
      }]
    },(id) => bg.setNotifEvent(id, 0, () => bg.addTorrent(url)));
  });
};

bg.onDownloadChanged = function(downloadDelta){
  if(downloadDelta.state && downloadDelta.state.current == 'complete' && downloadDelta.state.previous == 'in_progress')
    bg.notifTorrentFromDownloadId(downloadDelta.id);
};

bg.onDownloadCreated = function(download){
  bg.notifTorrentFromDownloadId(download.id);
};

/*
 * return true from the event listener. This keeps the sendResponse function valid after the listener returns, so you can call it later.
 * return a Promise from the event listener, and resolve when you have the response (or reject it in case of an error).
 */
bg.onMessage = function(request, sender, sendResponse){
  if(request.from != 'background'
    && (sender.extensionId || sender.id) == browser.runtime.id
    && bg.onRequestEvents[request.type]){
      log('onMessage', request.from, request.type, (request.value || null));
      const res = bg.onRequestEvents[request.type](request, sender, sendResponse);
      if(Navigator.current != Navigator.FIREFOX){
        if(res && res.then){
          res.then(sendResponse).catch(() => sendResponse());
          return true;
        }
      }else{
        return res;
      }
  }
};

bg.onDownloadStarted = function(request){
  if(request.statusCode == 200){
    bg.closeDownloadTab(request.tabId);
  }
};

bg.onBeforeRequest = function(details){
  if(bg.isValidLink(details.url)){
    bg.sendMessageToTab(details.tabId, {type: 'initPlayerIframe', value: {
      src: details.url,
      url: browser.extension.getURL('player.html')
    }});
    linkByFrameId[details.frameId] = details.url;
    return {redirectUrl: browser.extension.getURL('player.html')};
  }
};

bg.onRequestEvents = {

  getHosters: request => Promise.resolve(general.hosters),

  generate: request => bg.generateLinks(false, request.value),
  createTranscode: request => DL.api(DL.routes.TRANSCODE_CREATE, {arguments: {id: request.value.id}})
    .catch((err) => {
      // Handle error and notify. err parameter is not sent in the response when reject.
      bg.notifApiError('', Object.assign({contextMessage: request.value.name || request.value.id}, err));
      return Promise.reject(err);
    }),

  downloadLinks: request => bg.actionLinks('download', request.value),
  streamLinks: request => bg.actionLinks('stream', request.value),

  generateAndDownloadLinks: (request, sender) => bg.generateLinks('download', request.value),
  generateAndStreamLinks: request => bg.generateLinks('stream', request.value),

  notificationClose: request => Notifications.clear(request.value),
  notificationButtonClicked: request => bg.onButtonClicked(request.value.id, request.value.btnIdx),
  notificationHover: request => Notifications.onHover(request.value),

  requestDL: request => DL.api(DL.routes[request.value.route])
    .then(res => {
      bg.sendMessage({
        type: 'responseSuccessDL',
        value: { res: res, route: request.value.route }
      });
    })
    .catch(res => {
      bg.sendMessage({
        type: 'responseErrorDL',
        value: { res: res, route: request.value.route }
      });
    }),
  openSupportUrl: request => DL.getSupportUrl().then(url => browser.tabs.create({url: url})),
  openUpdatedUrl: request => bg.openUpdatedUrl(),
  openSiteUrl: request => DL.getSiteUrl().then(url => browser.tabs.create({url: url})),

  getOptions: request => {
    bg.sendMessage({type: 'listOptions', value: opts.get});
    return Promise.resolve(opts.get);
  },
  setOption: request => {
    opts.set(request.value.key, request.value.value);
    bg.updateConfig(opts.get);
    bg.sendMessage({type: 'listOptions', value: opts.get});
  },

  sendLinksToPopup: request => bg.sendMessage({
    type: 'sendLinksToPopup',
    value:request.value.filter(bg.isValidLink)
  }),
  detectLinksInPage: request => bg.detectLinksInPage(),

  getAuth: (request, sender, sendResponse) => {
    var value = false;
    if(localStorage.token && localStorage.key)
      value = {token: localStorage['token'], key: localStorage['pKey']};
    sendResponse(value);
  },
  isValidLink: request => {
    if(bg.isValidLink(request.value) || bg.isValidTorrentLink(request.value)){
      return Promise.resolve(request.value);
    }else{
      return Promise.reject();
    }
  },
  playerGetSourceUrl: (request, sender) => {
    if(sender.url == browser.extension.getURL('player.html')
      && linkByFrameId[sender.frameId]){
      return Promise.resolve(linkByFrameId[sender.frameId]);
    }
  }
};

bg.config = {
  rightClick : {
    install : function(){
      this.id = browser.contextMenus.create({
        title: lang('debrid_with_debridlink'),
        contexts: ["link","selection","frame","page"],
        onclick: context => bg.onClickContext('download', context),
        documentUrlPatterns : ["*://*/*"]
      });
    },
    remove : function(){
      browser.contextMenus.remove(this.id);
    },
    value : false,
    id : null
  },
  rightClickStream : {
    install : function(){
      this.id = browser.contextMenus.create({
        title: lang('watch_with_debridlink'),
        contexts: ["link","selection","frame","page"],
        onclick: context => bg.onClickContext('stream', context),
        documentUrlPatterns : ["*://*/*"]
      });
    },
    remove : function(){
      browser.contextMenus.remove(this.id);
    },
    value : false,
    id : null
  },
  rightClickCopy : {
    install : function(){
      this.id = browser.contextMenus.create({
        title: lang('debrid_and_copy'),
        contexts: ["link","selection","frame","page"],
        onclick: context => bg.onClickContext('copy', context),
        documentUrlPatterns : ["*://*/*"]
      });
    },
    remove : function(){
      browser.contextMenus.remove(this.id);
    },
    value : false,
    id : null
  },
  notifTorrent : {
    /*
     * browser.downloads.onCreated
     * Bug Google Chrome: Called for all items previously downloaded
     *
     * browser.downloads.onChanged
     * Bug with Firefox: Never called
     */
    install : function(){
      if(Navigator.current == Navigator.EDGE)return;

      if(Navigator.current == Navigator.CHROME)
        browser.downloads.onChanged.addListener(bg.onDownloadChanged);
      else
        browser.downloads.onCreated.addListener(bg.onDownloadCreated);
    },
    remove : function(){
      if(Navigator.current == Navigator.EDGE)return;

      if(Navigator.current == Navigator.CHROME)
        browser.downloads.onChanged.removeListener(bg.onDownloadChanged);
      else
        browser.downloads.onCreated.removeListener(bg.onDownloadCreated);
    },
    value : false
  },
  downloadBrowser: {
    install: function(){
      browser.webRequest.onResponseStarted.removeListener(bg.onDownloadStarted);
    },
    remove: function(){
      browser.webRequest.onResponseStarted.addListener(bg.onDownloadStarted, {urls: ['*://*.debrid.link/dl/*']});
    },
    value: false
  },
  oneClickIframe: {
    install: function(){
      browser.webRequest.onBeforeRequest.addListener(bg.onBeforeRequest, {
        types: ['sub_frame'],
        'urls': ['http://*/*','https://*/*']
      },
      ['blocking']);
    },
    remove: function(){
      browser.webRequest.onBeforeRequest.removeListener(bg.onBeforeRequest);
    },
    value: false
  }
};

/* Events */
browser.runtime.onMessage.addListener(bg.onMessage);

/*if(Navigator.current == Navigator.CHROME){
  browser.notifications.onButtonClicked.addListener(bg.onButtonClicked);
}*/



bg.updateConfig(opts.get);

DL.api(DL.routes.DOWNLOADER_REGEX, {disableLogin: true})
  .catch(() => DL.api(DL.routes.DOWNLOADER_REGEX, {disableToken: true}))
  .then(hosters => {
    general.hosters = hosters;
    general.regexs = [];
    general.hostnames = [];
    hosters.forEach((hoster, index) => {
      hoster.regexs.map(regex => general.regexs.push(new RegExp(regex)));
      hoster.hostnames.map(hostname => {
        general.hostnames.push(hostname);
        general.indexHosterByHostname[hostname] = index;
      });
    });
  });

// Updated
if(localStorage.version && localStorage.version != Version.core){
  setTimeout(() => {
    Notifications.create('', {
      title: lang('plugin_updated'),
      message: 'Version: '+ Version.extension +'-'+ Version.core,
      buttons : [{
        title: lang('plugin_view_changelog'),
        iconUrl: "images/icon16.png"
      }]
    }, (id) => bg.setNotifEvent(id, 0, () => bg.openUpdatedUrl()));
  }, 5*1000);
}
localStorage.version = Version.core;