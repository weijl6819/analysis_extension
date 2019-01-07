/*
 * * * * * * * * * * * * * * * * * * * *
 * © Copyright 2009-2018 Debrid-link
 * All rights reserved
 *
 * Contact: https://debrid-link.fr/contact
 */

(function(){

  if(!browser)var browser = chrome;

  browser.runtime.sendMessage({
    from:'sendLinks',
    type: 'sendLinksToPopup',
    value: Array.from(document.getElementsByTagName('iframe'))
      .concat(Array.from(document.getElementsByTagName('a')))
      .concat([document.location])
      .map(item => item.src || item.href)
  });

}());
