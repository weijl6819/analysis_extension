const PAGE_SCRIPT_SOURCE = 'wikibuy-webapp';
const CONTENT_SCRIPT_SOURCE = '__wikibuy_content';
const BG_SCRIPT_SOURCE = '__wikibuy_bg';
const EXTERNAL_MESSAGING_PORT_NAME = '__wikibuy_external_messages';

const port = chrome.runtime.connect(
  chrome.runtime.id,
  {name: EXTERNAL_MESSAGING_PORT_NAME}
);

window.addEventListener('message', e => {
  const msg = e.data;
  if (msg && typeof msg === 'object' && msg.src === PAGE_SCRIPT_SOURCE) {
    chrome.runtime.sendMessage({src: CONTENT_SCRIPT_SOURCE, data: msg.data});
    e.stopImmediatePropagation();
  }
});

chrome.runtime.onMessage.addListener(function(request) {
  if (request && request.src === BG_SCRIPT_SOURCE) {
    window.postMessage({src: CONTENT_SCRIPT_SOURCE, data: request.data}, '*');
  }
});
