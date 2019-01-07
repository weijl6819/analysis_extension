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

var visibleLinks = [];
var linksObj = {};
var torrents = {};
var user;
var details_torrent = false;
var seedboxInterval;

function sendMessage(message){
  message.from = 'popup';
  return new Promise((resolve, reject) => browser.runtime.sendMessage(message, resolve));
  // Only supported by firefox
  // return browser.runtime.sendMessage(message);
}

function setLinkObj(link){
  if(!linksObj[link.id]){
    linksObj[link.id] = {
      id: link.id,
      name: link.filename || link.name,
      downloadUrl: link.downloadLink || link.downloadUrl
    };
    linksObj[link.id].isMedia = (medias.indexOf(linksObj[link.id].name.split('.').pop().toLowerCase()) >= 0);
  }
  return linksObj[link.id];
}

function openSupportUrl(){
  sendMessage({type: 'openSupportUrl'});
}

function openUpdatedUrl(){
  sendMessage({type: 'openUpdatedUrl'});
}

function generateAndStream(links){
  if(!Array.isArray(links))links = [links];
  sendMessage({type: 'generateAndStreamLinks', value: links});
}

function generateAndDownload(links){
  if(!Array.isArray(links))links = [links];
  sendMessage({type: 'generateAndDownloadLinks', value: links});
}

function stream(linksObj){
  if(!Array.isArray(linksObj))linksObj = [linksObj];
  sendMessage({type: 'streamLinks', value: linksObj});
}

function download(linksObj){
  if(!Array.isArray(linksObj))linksObj = [linksObj];
  sendMessage({type: 'downloadLinks', value: linksObj});
}

function requestDL(route, data){
  sendMessage({type: 'requestDL', value:{route:route, data:data || {}}});
}

function getOptions(){
  return sendMessage({type: 'getHosters'})
    .then(addHostsDetectionList)
    .then(() => sendMessage({type: 'getOptions'}))
    .then(addOptions);
}

function setOption(key, value, reverse){
  sendMessage({type: 'setOption', value: {key: key, value: (reverse) ? !value : value}});
}

function addOptions(options, keyList){
  keyList = keyList || [];
  var opt;
  for(opt in options){
    let optLeyList = [].concat(keyList).concat([opt]);
    let keyListString = optLeyList.join('.');
    if(typeof(options[opt]) == 'boolean'){
      var el = document.getElementById(keyListString);
      if(el){
        el.checked = options[opt];
        if(el.getAttribute('data-reverse'))
          el.checked = !el.checked;
        if(el.init)el.init();
      }
    }else if(typeof(options[opt]) == 'object' && !Array.isArray(options[opt])){
      addOptions(options[opt], optLeyList);
    }
  }
  return options;
}

function addHostsDetectionList(hosts){
  const container = document.getElementById('hostsDectionList');
  container.innerText = '';

  hosts.sort((a,b) => {
    if(a.name == b.name)return 0;
    return (a.name < b.name) ? -1 : 1;
  });

  const hostsByType = hosts.sort((a,b) => {
    if(a.name == b.name)return 0;
    return (a.name < b.name) ? -1 : 1;
  }).reduce(function(object, host) {
    if(!object[host.type])object[host.type] = [];
    object[host.type].push(host);
    return object;
  }, {});

  ['host', 'stream', 'protect'].forEach((hostType, index) => {

    if(!hostsByType[hostType])return;

    // Host type option
    const checkboxType = document.createElement('input');
    checkboxType.type = 'checkbox';
    checkboxType.id = `detectionHostsType.${hostType}`;
    checkboxType.setAttribute('data-event', 'saveOption');
    checkboxType.onchange = function(){
      const style = (checkboxType.checked) ? {display: ''} : {display: 'none'};
      Object.assign(row.style, style);
      hostsByType[hostType].forEach(host => Object.assign(host.el.style, style));
    };
    checkboxType.init = checkboxType.onchange;

    const titleType = document.createElement('h2');
    titleType.style.margin = '0';
    titleType.style.padding = '0';
    titleType.innerText = lang(`downloader_type_${hostType}`, lang('plural'));

    const labelType = document.createElement('label');
    labelType.htmlFor = checkboxType.id;
    labelType.appendChild(titleType);

    const rowType = document.createElement('div');
    rowType.className = 'bg-faded';
    rowType.appendChild(checkboxType);
    rowType.appendChild(labelType);

    container.appendChild(rowType);

    // Check / Uncheck all
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checkAll${hostType}`;
    checkbox.checked = true;
    checkbox.onchange = function(){
      hostsByType[hostType].forEach(host => {
        let input = host.el.getElementsByTagName('input')[0];
        input.checked = (this.checked);
        setOption(input.id, input.checked, input.getAttribute('data-reverse'));
      });
    };

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.innerText = lang('check_or_uncheck_all');
    label.className = 'text-muted';

    const row = document.createElement('div');
    row.className = 'bg-faded';
    row.appendChild(checkbox);
    row.appendChild(label);

    container.appendChild(row);

    // Add each host
    hostsByType[hostType].forEach(host => {

      const input = document.createElement('input');
      input.checked = true;
      input.type = 'checkbox';
      input.id = `detectionHostsDenied.${host.name}`;
      input.setAttribute('data-event', 'saveOption');
      input.setAttribute('data-reverse', true);

      const label = document.createElement('label');
      label.htmlFor = input.id;
      label.innerText = ucfirst(host.name);

      const row = document.createElement('div');
      row.appendChild(input);
      row.appendChild(label);

      host.el = row;

      container.appendChild(row);

    });

  });

  return hosts;

}

function detectLinksInPage(){
  visibleLinks = [];
  sendMessage({type: 'detectLinksInPage'});
}

function isCheckedLink(index){
  return document.getElementById(`checkLinkToGenerate-${index}`).getAttribute('data-checked') === 'true';
}

function checkLinkToGenerate(index, value){
  var checkbox = document.getElementById(`checkLinkToGenerate-${index}`);
  checkbox.checked = typeof value == 'boolean' ? value : !isCheckedLink(index);
  checkbox.setAttribute('data-checked', checkbox.checked);
}

function checkAllLinksToGenerate(){
  var checkbox = document.getElementById('checkLinkToGenerate-all');
  checkbox.checked = !(checkbox.getAttribute('data-checked') === 'true');
  checkbox.setAttribute('data-checked', checkbox.checked);
  visibleLinks.forEach((link, index) => checkLinkToGenerate(index, checkbox.checked));
}

function viewLinks(){
  if(visibleLinks.length > 0){
    document.getElementById('links').innerHTML = `
      <div data-event="checkAllLinksToGenerate">
        <input type="checkbox" id="checkLinkToGenerate-all">
        <div style="cursor:pointer"><strong>${lang('check_all')}</strong></div>
        <div class="ml-auto d-flex flex-nowrap">
          <button data-event="generateLinksChecked">${lang('download_checked')}</button>
          <button  data-event="generateAndStreamLinksChecked"><i class="fa fa-play"></i></button>
        </div>
      </div>
    `;
    visibleLinks.forEach(addLink);
    document.getElementById('noLink').style.display = "none";
  }else{
    document.getElementById('noLink').style.display = "block";
  }
}

function addLink(link, index){
  var html = `
    <div data-event="checkLinkToGenerate" data-target="${index}" style="cursor:pointer">
      <input type="checkbox" id="checkLinkToGenerate-${index}" data-checked="false">
      <div id="linkToGenerate-${index}" class="flex-auto text-nowrap"></div>
      <div class="ml-auto d-flex flex-nowrap">
        <button data-event="generateAndDownload" data-target="${index}">${lang('download')}</button>
        <button data-event="generateAndStream" data-target="${index}"><i class='fa fa-play'></i></button>
      </div>
    </div>
  `;
  document.getElementById('links').innerHTML += html;
  document.getElementById(`linkToGenerate-${index}`).innerText = link.replace(/^https?\:\/\/(www.)?/, '');
}

function addOldLink(link){
  if(link.expired)return;
  var linkObj = setLinkObj(link);
  var streamDisabled = linkObj.isMedia ? '' : 'disabled';
  var html = `
    <div>
      <div id="filename-${link.id}" class="flex-auto text-nowrap"></div>
      <div class="ml-auto d-flex flex-nowrap">
        <button data-event="download" data-target="${link.id}">${lang('download')}</button>
        <button data-event="stream" data-target="${link.id}" ${streamDisabled}><i class='fa fa-play'></i></button>
      </div>
    </div>
  `;
  document.getElementById('downloaderOldLinks').innerHTML += html;
  document.getElementById(`filename-${link.id}`).innerText = link.filename;
}


/*
 * Display torrents
 */
function viewTorrents(){
  details_torrent = false;
  document.getElementById("torrents").innerText = "";
  document.getElementById("torrents").className = "text-small";
  var id;
  for(id in torrents)addTorrent(torrents[id]);
}

function viewFilesTorrent(id){
  details_torrent = true;
  var tDiv = document.getElementById('torrents');
  tDiv.className = 'list text-small';
  var files = torrents[id].files.sort((a, b) => (a.name < b.name) ? -1 : 1);
  tDiv.innerHTML = `
    <div>
      <button data-event="viewTorrents">${lang('back')}</button>
      <div class="ml-auto">
        <button data-event="dlFilesTorrent" data-target="${id}">${lang('download_all')}</button>
        <button data-event="streamFilesTorrent" data-target="${id}"><i class="fa fa-play"></i></button>
      </div>
    </div>
  `;
  files.forEach(addTorrentFile);
}

function addTorrentFile(file){
  var linkObj = setLinkObj(file);
  var streamDisabled = linkObj.isMedia ? '' : 'disabled';
  document.getElementById('torrents').innerHTML += `
    <div class="hover_button">
      <div id="filename-${file.id}" class="text-nowrap flex-auto"></div>
      <div class="ml-auto d-flex flex-nowrap" style="padding:0">
        <button data-event="download" data-target="${file.id}">${lang('download')}</button>
        <button data-event="stream" data-target="${file.id}" ${streamDisabled}><i class='fa fa-play'></i></button>
      </div>
    </div>`;
  document.getElementById(`filename-${file.id}`).innerText = file.name;
}

function addTorrent(t){
  torrents[t.id] = t;
  document.getElementById('torrents').innerHTML += `
    <div class="torrentFile hover_button" id="torrent-${t.id}">
      <div>
        <span class="news" id="torrent-new-${t.id}"></span>
        <span class="title" id="torrent-name-${t.id}"></span>
      </div>
      <div class="infos">
        <span id="torrent-percentDownload-${t.id}"></span>
        <span id="torrent-rateUpload-${t.id}"></span>
        <span id="torrent-rateDownload-${t.id}"></span>
        <span id="torrent-uploadRatio-${t.id}"></span>
        <span id="torrent-peersConnected-${t.id}"></span>
      </div>
      <button class="hidden_button"
        data-event="viewFilesTorrent"
        data-target="${t.id}"
        id="torrent-btnFiles-${t.id}"
        style="position: absolute; top: 8px; right: 0px; width: auto; margin: 0px;">
        ${lang('files')}
      </button>
    </div>
  `;

  document.getElementById(`torrent-name-${t.id}`).innerText = t.name;

  if(t.addedDate >= ((new Date().getTime() / 1000) - 12 * 3600)){
    var newTorrent = document.getElementById(`torrent-new-${t.id}`);
    newTorrent.innerText = "New";
    newTorrent.style.display = "inline";
  }


  if(t.activity)addTorrentActivity(t.id, t.activity);
}

function addTorrentActivity(id, activity){

  torrents[id].activity = activity;

  if(!details_torrent){
    var el = (key) => document.getElementById(`torrent-${key}-${id}`);
    el('percentDownload').innerText = activity.percentDownload +"%";
    el('rateUpload').innerText = "UP : "+ sizePrint(activity.rateUpload) +"/s";
    el('rateDownload').innerText = "DOWN : "+ sizePrint(activity.rateDownload) +"/s";
    el('peersConnected').innerText = "Peers : "+ activity.peersConnected;
    el('uploadRatio').innerText = "Ratio : "+ activity.uploadRatio;

    if(activity.percentDownload < 100){
      el('btnFiles').disabled = true;
      el('btnFiles').innerHTML = `<i class="fa fa-circle-o-notch fa-spin"></i> ${parseInt(activity.percentDownload)}%`;
    }else{
      el('btnFiles').disabled = false;
      el('btnFiles').innerText = lang('files');
    }
  }
}

function insertLang(){
  [].slice.apply(document.getElementsByTagName('u'))
    .concat([].slice.apply(document.getElementsByTagName('label')))
    .forEach((item) => {
      var key = item.getAttribute('data-lang');
      if(key)item.innerText=lang(key);
    });
}

function insertVersion(){
  document.getElementById('version-core').innerText = Version.core;
  document.getElementById('version-extension').innerText = Version.extension;
}

function callbackSeedboxInterval(){
  requestDL('SEEDBOX_ACTIVITY');
  if(page.current.id != 'seedbox'){
    stopSeedboxInterval();
  }
}

function startSeedboxInterval(){
  if(seedboxInterval)return;
  seedboxInterval = setInterval(callbackSeedboxInterval, 7*1000);
}

function stopSeedboxInterval(){
  if(seedboxInterval)
    clearInterval(seedboxInterval);
}

function logoutUser(){
  stopSeedboxInterval();
  requestDL('ACCOUNT_LOGOUT');
}

function upgradeAccount(){
  if(typeof user.upgradeAccountUrl != 'undefined'){
    browser.tabs.create({url: user.upgradeAccountUrl});
    window.close();
  }
}

var page = {};
page.current = false;
page.init = {};
page.get = function(name){
  if(this.current.id == name)return;
  if(this.current){
    this.current.style.display = 'none';
  }
  Array.from(document.getElementById('menu').getElementsByTagName('a')).forEach(element => {
    element.className = element.getAttribute('data-target') == name ? 'active' : '';
  });

  this.current = document.getElementById(name);
  this.current.style.display = 'block';
  if(this.init[name]){
    this.init[name]();
  }
  if(name != 'loading')
    setOption('currentPage', name);
};

page.init.account = () => {
  if(!user)requestDL('ACCOUNT_INFOS');
};
page.init.seedbox = () => requestDL('SEEDBOX_LIST');
page.init.downloader = () => {
  detectLinksInPage();
  requestDL('DOWNLOADER_LIST');
};

// Click events methods
var clickEvents = {
  checkLinkToGenerate: element => checkLinkToGenerate(element.getAttribute('data-target')),
  checkAllLinksToGenerate: element => checkAllLinksToGenerate(),

  generateAndDownload: element => generateAndDownload(visibleLinks[element.getAttribute('data-target')]),
  generateAndStream: element => generateAndStream(visibleLinks[element.getAttribute('data-target')]),
  generateLinksChecked: element => generateAndDownload(visibleLinks.filter((link, index) => isCheckedLink(index))),
  generateAndStreamLinksChecked: element => generateAndStream(visibleLinks.filter((link, index) => isCheckedLink(index))),

  download: element => download(linksObj[element.getAttribute('data-target')]),
  stream: element => stream(linksObj[element.getAttribute('data-target')]),

  getPage: element => page.get(element.getAttribute('data-target')),

  viewTorrents: element => viewTorrents(),
  viewFilesTorrent: element => viewFilesTorrent(element.getAttribute('data-target')),
  dlFilesTorrent: element => download(torrents[element.getAttribute('data-target')].files.map(setLinkObj)),
  streamFilesTorrent: element => stream(torrents[element.getAttribute('data-target')].files.map(setLinkObj)),

  openSupportUrl: element => openSupportUrl(),
  openUpdatedUrl: element => openUpdatedUrl(),

  logout: element => logoutUser(),
  upgrade: element => upgradeAccount()
};

var changeEvents = {
  saveOption: element => setOption(element.id, element.checked, element.getAttribute('data-reverse'))
};

var onResponseSuccessDL = {
  ACCOUNT_INFOS: res => {
    user = res;
    document.getElementById('pseudo').innerText = res.pseudo;
    document.getElementById('premiumLeft').innerText = timePrint(res.premiumLeft);
    document.getElementById('accountType').innerText = accountType(res.accountType);
    document.getElementById('ptsLeft').innerText = res.pts;
  },
  DOWNLOADER_LIST: res => {
    res = res.filter(link => !link.expired);
    document.getElementById('downloaderOldLinks').innerHTML = '';
    document.getElementById("noOldLink").style.display='none';
    if(res.length > 0){
      res.sort((a, b) => b.time - a.time).forEach(addOldLink);
    }else{
      document.getElementById("noOldLink").style.display='block';
    }
  },
  SEEDBOX_LIST: res => {
    document.getElementById("torrents").innerText = "";
    document.getElementById("noTorrent").style.display='none';
    if(res.length > 0){
      res.sort((a, b) =>  b.addedDate - a.addedDate).forEach(addTorrent);
      callbackSeedboxInterval();
      startSeedboxInterval();
    }else{
      document.getElementById("noTorrent").style.display='block';
    }
  },
  SEEDBOX_ACTIVITY: res => {
    for(var id in res)addTorrentActivity(id, res[id])
  },
  ACCOUNT_LOGOUT: res => window.close()
};

var onMessageEvents = {
  sendLinksToPopup: request => {
    visibleLinks = request.value.concat(visibleLinks).filter(array_unique).sort();
    viewLinks();
  },
  responseSuccessDL: request => {
    if(onResponseSuccessDL[request.value.route])
      onResponseSuccessDL[request.value.route](request.value.res);
  },
  responseErrorDL: request => {
    if(['badToken','hidedToken','notToken'].indexOf(request.value.res.ERR) >= 0)
      window.close();
  },
  listOptions: request => {
    addOptions(request.value);
    if(page.current === false || page.current.id == 'loading')
      page.get(request.value.currentPage);
  }
}

function onChange(e){
  if(!e.target)return;
  var code = e.target.getAttribute('data-event');
  if(code && changeEvents[code])
    changeEvents[code](e.target);
}

function onClick(e){
  if(!e.target)return;
  var code;
  var parent = e.target;
  var max = 3;
  do{
    code = parent.getAttribute('data-event')
    if(code)break;
  }while((parent = parent.parentElement) && max--);

  if(clickEvents[code])
    clickEvents[code](parent);
}

function onMessage(request, sender){
  if(request.from == 'background'
    && onMessageEvents[request.type]
    && (sender.extensionId || sender.id) == browser.runtime.id){
      log('onMessage', request.from, request.type, request.value);
    onMessageEvents[request.type](request);
  }
}

function onLoad(){

  page.get('loading');

  insertLang();
  insertVersion();
  getOptions();

  var styles = ['FIREFOX', 'CHROME', 'OPERA', 'EDGE'].map(navigator => {
    return `.hidden-${navigator.toLowerCase()} {
      display: ${Navigator.current == Navigator[navigator] ? 'none' : 'block'}
    }`
  }).join("");
  document.getElementsByTagName('head')[0].innerHTML += `<style>${styles}</style>`;
}

browser.runtime.onMessage.addListener(onMessage);
document.addEventListener("change", onChange);
document.addEventListener("click", onClick);
window.onload = onLoad;