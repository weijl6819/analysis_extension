//document.addEventListener("DOMContentLoaded", function () {
//  backGround = chrome.runtime.getBackgroundPage();
//  backGround.takeScreenshot();
//});

chrome.runtime.getBackgroundPage(function(backGround){
  backGround.takeScreenshot();
});

function onMessage(request, sender, callback) {
  document.getElementById('status').textContent = "onMessage";
  if (request.action == 'status_update') {
    document.getElementById('status').textContent = request.msg;
  }
}

chrome.extension.onMessage.addListener(onMessage);
