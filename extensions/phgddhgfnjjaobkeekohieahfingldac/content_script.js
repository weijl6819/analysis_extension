//console.log('executing content script');

var s = document.createElement('script');
s.src = chrome.extension.getURL('injected_script.js');
s.onload = function () {
  //Get current version
  var manifest = chrome.runtime.getManifest();
  var evt = document.createEvent("CustomEvent");
  evt.initCustomEvent("versionUpdated", true, true, manifest.version);
  document.dispatchEvent(evt);
  this.remove();
};
(document.head || document.documentElement).appendChild(s);