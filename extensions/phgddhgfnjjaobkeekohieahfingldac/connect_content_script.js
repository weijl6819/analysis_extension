//console.log('executing connect content script');

var s = document.createElement('script');
s.src = chrome.extension.getURL('connect_injected_script.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);