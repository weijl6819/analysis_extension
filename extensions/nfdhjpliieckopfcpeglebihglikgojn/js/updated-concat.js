/*
 * * * * * * * * * * * * * * * * * * * *
 * © Copyright 2009-2018 Debrid-link
 * All rights reserved
 *
 * Contact: https://debrid-link.fr/contact
 */

var Version = {
  core: '3.10.3',
  extension: '3.10.3'
};
(function(){

  if(!browser)var browser = chrome;

  window.onload = () => {
    document.getElementById('version-core').innerText = Version.core;
    document.getElementById('version-extension').innerText = Version.extension;
    document.addEventListener("click", onClick);
  };

  const clickEvents = {
    openSiteUrl: el => sendMessage({type: 'openSiteUrl'})
  };

  function sendMessage(message){
    message.from = 'updated';
    return new Promise((resolve, reject) => browser.runtime.sendMessage(message, resolve));
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

}());