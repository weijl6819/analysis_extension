
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
/*
 * * * * * * * * * * * * * * * * * * * *
 * © Copyright 2009-2018 Debrid-link
 * All rights reserved
 *
 * Contact: https://debrid-link.fr/contact
 */

(function(){

  if(!browser)var browser = chrome;

  function copy(text){
    var copyEl = document.createElement('textarea');
    copyEl.value = text;
    document.body.appendChild(copyEl);
    copyEl.focus();
    copyEl.select();
    document.execCommand('copy');
    document.body.removeChild(copyEl);
  }

  browser.runtime.onMessage.addListener((request, sender) => {
    if((sender.extensionId || sender.id) == browser.runtime.id
      && request.from == 'background'
      && request.type == 'copyText'){
      copy(request.value);
    }
  });

}());
(function() {

  'use strict';

  if(!browser)var browser = chrome;

  const lang = browser.i18n.getMessage;

  const onMessageEvents = {
    initPlayerIframe
  };

  sendMessage({type: 'getOptions'})
    .then((options) => {
      if(options && options.oneClickLink){
        document.addEventListener('mouseover', onHover);
      }
    });

  browser.runtime.onMessage.addListener((request, sender) => {
    if((sender.extensionId || sender.id) == browser.runtime.id
      && request.from == 'background'
      && onMessageEvents[request.type]){
      onMessageEvents[request.type](request.value);
    }
  });

  function sendMessage(message){
    message.from = 'hoverLinks';
    return new Promise((resolve, reject) => browser.runtime.sendMessage(message, res => {
      if(!res)return reject();
      resolve(res);
    }));
    // Only supported by firefox
    // return browser.runtime.sendMessage(message);
  }

  function onHover(e){
    let el = e.target || false;

    if(el
      && !el.getAttribute('dl-buttons-url')
      && el.tagName.toLowerCase() == 'a'
      && (el.src || el.href)){

        el.setAttribute('dl-buttons-url', (el.src || el.href));

        return sendMessage({type: 'isValidLink', value: (el.src || el.href)})
          .then((res) => createElements(el))
          .catch(() => {});

      }

  }

  function buttonAction(button, actionType, actionValue){
    if(button.disabled)return;
    button.disabled = true;
    let resetButton = () => button.disabled = false;
    return sendMessage({type: actionType, value: actionValue})
      .then(resetButton)
      .catch(resetButton);
  }

  function createElements(el){

    if(!el)return;

    const links = [el.getAttribute('dl-buttons-url')];

    const btnDownload = document.createElement('button');
    btnDownload.className = 'DL-button';
    btnDownload.innerText = lang('download');
    btnDownload.onclick = () => buttonAction(btnDownload, 'generateAndDownloadLinks', links);

    const btnStream = document.createElement('button');
    btnStream.className = 'DL-button';
    btnStream.innerText = lang('watch');
    btnStream.onclick = () => buttonAction(btnStream, 'generateAndStreamLinks', links);

    const logo = document.createElement('img');
    logo.className = 'DL-logo';
    logo.src = browser.extension.getURL('images/icon25.png');

    const btnGroup = document.createElement('div');
    btnGroup.className = 'DL-button-group';
    btnGroup.appendChild(btnDownload);
    btnGroup.appendChild(logo);
    btnGroup.appendChild(btnStream);

    const container = document.createElement('div');
    container.className = 'DL-container';
    container.appendChild(btnGroup);

    const parent = document.createElement('span');
    parent.className = 'DL-1c';

    el.parentElement.replaceChild(parent, el);

    parent.appendChild(el);
    parent.appendChild(container);

  }

  function initPlayerIframe(streamIframe){
    Array.from(document.getElementsByTagName('iframe')).forEach(iframe => {
      if(iframe.src == streamIframe.src || (iframe.contentDocument && iframe.contentDocument.URL == streamIframe.url)){
        iframe.allowFullscreen = true;
        iframe.allow = 'autoplay; fullscreen';
      }
    });
  }

})();


(function(){

  if(!browser)var browser = chrome;

  var p;
  var timeout = {};
  var notif;
  
  function sendMessage(message){
    message.from = 'notificationsUI';
    return browser.runtime.sendMessage(message);
  }

  function addContainer(prefix){
    if(p)return;
    var body = document.getElementsByTagName('body')[0];
    if(!body)return setTimeout(() => addContainer(prefix), 800);
    p = prefix;
    notif = document.createElement('div');
    notif.innerHTML = `<div class="${p}-container" id="${p}-container"></div>`;
    body.appendChild(notif);
    getElement('container').addEventListener("click", onClick);
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

  function getElement(name, id, index){
    var value = [p, name];
    if(typeof(id) != 'undefined')value.push(id);
    if(typeof(index) == 'number' && index >= 0)value.push(index);
    return document.getElementById(value.join('-'));
  }

  function addNotifButton(notifId, button, index){
    getElement('buttons', notifId).innerHTML += `
      <div
        class="${p}-button"
        id="${p}-button-${notifId}-${index}"
        data-event="notificationButtonClicked"
        data-target="${notifId}"
        data-target-index="${index}">
        <div class="${p}-button-icon"></div>
        <div class="${p}-button-title"></div>
        <div class="${p}-button-message"></div>
      </div>
    `;

    ['title', 'message'].forEach(key => {
      if(button[key] && button[key].length > 0){
        getElement('button', notifId, index)
          .getElementsByClassName(`${p}-button-${key}`)[0]
          .innerText = button[key];
      }
    });

    if(button.iconUrl && button.iconUrl.length > 0){
      getElement('button', notifId, index)
        .getElementsByClassName(`${p}-button-icon`)[0]
        .innerHTML = `<img src="${browser.extension.getURL(button.iconUrl)}">`;
    }

  }

  function addNotifItem(notifId, item, index){
    getElement('items', notifId).innerHTML += `<div id="${p}-item-${notifId}-${index}"></div>`;
    ['title', 'message'].forEach((key) => {
      if(item[key]){
        var span = document.createElement('span');
        span.innerText = item[key];
        getElement('item', notifId, index).appendChild(span)
      }
    });
  }

  function closeNotif(notifId){
    var notification = getElement('notification', notifId);
    if(notification)getElement('container').removeChild(notification);
  }

  function addNotif(notifParams){
    if(!getElement('notification', notifParams.id)){
      var el = document.createElement('div');
      el.id = `${p}-notification-${notifParams.id}`;
      if(notifParams.animated)el.className = `${p}-animated`;
      el.innerHTML = `
        <div class="${p}-notification">
          <div class="${p}-close" data-event="close" data-target="${notifParams.id}">x</div>
          <div class="${p}-progress">
            <div class="${p}-progress-value" style="width:0%" id="${p}-progress-${notifParams.id}"></div>
          </div>
          <div class="${p}-icon"><img src="${browser.extension.getURL(notifParams.iconUrl)}"></div>
          <div class="${p}-texts" id="${p}-texts-${notifParams.id}">
            <div class="${p}-title" id="${p}-title-${notifParams.id}"></div>
            <div class="${p}-message" id="${p}-message-${notifParams.id}"></div>
            <div class="${p}-contextMessage" id="${p}-contextMessage-${notifParams.id}"></div>
            <div class="${p}-contextMessage" id="${p}-items-${notifParams.id}"></div>
          </div>
          <div class="${p}-fix"></div>
          <div class="${p}-buttons" id="${p}-buttons-${notifParams.id}"></div>
        </div>
      `;
      getElement('container').appendChild(el);
    }

    if(notifParams.items && notifParams.items.length > 0){
      getElement('items', notifParams.id).innerText = '';
      notifParams.items.forEach((item, index) => addNotifItem(notifParams.id, item, index));
      notifParams.message = '';
      notifParams.contextMessage = '';
    }

    ['title','message','contextMessage'].forEach(key => {
      getElement(key, notifParams.id).innerText = '';
      if(notifParams[key] && notifParams[key].length > 0){
        getElement(key, notifParams.id).innerText = notifParams[key];
      }
    });

    if(notifParams.buttons && notifParams.buttons.length > 0){
      getElement('buttons', notifParams.id).innerText = '';
      notifParams.buttons.forEach((button, index) => addNotifButton(notifParams.id, button, index));
    }

    if(notifParams.progress)
      getElement('progress', notifParams.id).style.width = parseInt(notifParams.progress) +"%";

    if(el){
      el.addEventListener("mouseover", () => sendMessage({
        type: 'notificationHover',
        value: notifParams.id
      }));
    }
  }

  var onMessageEvents = {
    //configNotifications: config => addContainer(config.prefix),
    createNotification: notifParams => addNotif(notifParams),
    closeNotification: notifId => closeNotif(notifId)
  };

  var clickEvents = {
    close: element => sendMessage({
      type: 'notificationClose',
      value: element.getAttribute('data-target')
    }),
    notificationButtonClicked: element => sendMessage({
      type: 'notificationButtonClicked',
      value: {
        id: element.getAttribute('data-target'),
        btnIdx: parseInt(element.getAttribute('data-target-index'))
      }
    })
  };

  browser.runtime.onMessage.addListener((request, sender) => {
    if((sender.extensionId || sender.id) == browser.runtime.id
      && request.from == 'notifications'
      && onMessageEvents[request.type]){
      onMessageEvents[request.type](request.value);
    }
  });

  addContainer('DL-extension');

  return true;
}());