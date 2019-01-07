/*
 * * * * * * * * * * * * * * * * * * * *
 * © Copyright 2009-2018 Debrid-link
 * All rights reserved
 *
 * Contact: https://debrid-link.fr/contact
 */

(function(){

  if(!browser)var browser = chrome;

  const lang = browser.i18n.getMessage;

  window.onload = () => {
    sendMessage({type: 'playerGetSourceUrl'})
      .then(createElement);
  };

  function sendMessage(message){
    message.from = 'player';
    return new Promise((resolve, reject) => browser.runtime.sendMessage(message, res => {
      if(!res)return reject();
      resolve(res);
    }));
    // Only supported by firefox
    // return browser.runtime.sendMessage(message);
  }

  function timeoutPromise(ms){
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }

  function buttonAction(button, actionType, actionValue, loadingMessage){
    if(button.disabled)return;
    button.disabled = true;
    let oldValue;
    if(loadingMessage){
      oldValue=Object.assign({}, {innerText: button.innerText}).innerText;
      button.innerText = loadingMessage;
    }
    let resetButton = () => {
      button.disabled = false;
      if(oldValue)button.innerText = oldValue;
    };
    return Promise.race([sendMessage({type: actionType, value: actionValue}), timeoutPromise(15*1000)])
    //return sendMessage({type: actionType, value: actionValue})
      .then((res) => {
        if(!res)return Promise.reject();
        resetButton();
        return res;
      })
      // First parameter seem to be undefined :/
      .catch(() => {
        resetButton();
        return Promise.reject();
      });
  };

  function createElement(sourceUrl){

    const btnDownload = document.createElement('button');
    btnDownload.className = 'DL-btn';
    btnDownload.innerText = lang('download');
    btnDownload.onclick = () => buttonAction(btnDownload, 'generateAndDownloadLinks', [sourceUrl]);

    const btnStream = document.createElement('button');
    btnStream.className = 'DL-btn';
    btnStream.innerText = lang('watch');
    btnStream.onclick = () => buttonAction(btnStream, 'generate', [sourceUrl])
      .then((generated) => {
        return buttonAction(btnStream, 'createTranscode', generated[0], lang('startTranscoding'))
          .then((transcode) => {
            const iframe = document.createElement('iframe');
            iframe.src = transcode.embedUrl || `https://debrid-link.fr/webapp/embed/${transcode.id}`;
            iframe.frameborder = '0';
            iframe.style.border = '0';
            //iframe.allow = 'autoplay';
            iframe.allowFullscreen = true;
            iframe.allow = 'autoplay; fullscreen';
            iframe.width = '100%';
            iframe.height = '100%';
            return iframe;
          })
          .catch(() => {
            if(generated[0].name.split('.').pop().toLowerCase() != 'mp4')
              return Promise.reject();
            else {
              const video = document.createElement('video');
              video.className = 'flex-auto';
              video.src = generated[0].downloadUrl;
              video.autoplay = true;
              video.controls = true;
              return Promise.resolve(video);
            }
          })
      })
      .then(playerElement => {
        body.removeClass('start');
        body.addClass('stream');

        btnGroup.appendChild(sourceLink);
        btnGroup.removeChild(btnStream);
        body.appendChild(playerElement);
      });

    const logo = document.createElement('img');
    logo.className = 'DL-logo';
    logo.src = browser.extension.getURL('images/icon48.png');

    const sourceLink = document.createElement('a');
    sourceLink.target = '_blank';
    sourceLink.href = sourceUrl;
    sourceLink.innerText = sourceUrl;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'DL-btn-group DL-btn-shadow';
    btnGroup.appendChild(logo);
    btnGroup.appendChild(btnDownload);
    btnGroup.appendChild(btnStream);
    btnGroup.appendChild(sourceLink);

    const body = document.getElementById('body');
    body.appendChild(btnGroup);
    body.appendChild(sourceLink);

  }

  HTMLElement.prototype.addClass = function(name){
    if(this.className.indexOf(name) == -1){
      this.className += ' '+ name;
      return true;
    }
  };
  HTMLElement.prototype.removeClass = function(name){
    var split = this.className.split(' '+ name);
    if(split.length > 1){
      this.className = split.join('');
      return true;
    }
  };

}());