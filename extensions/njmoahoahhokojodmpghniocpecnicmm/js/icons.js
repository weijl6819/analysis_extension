window.onload = function() {
  var download = document.getElementById('download');
  download.onclick = function() {
    chrome.runtime.sendMessage('icons');
    download.disabled = true;
    return false;
  };
};
