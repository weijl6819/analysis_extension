$(document).ready(function () {
  var config_key_all;
  $('#cmdsave').on('click', function () {
    chrome.extension.sendMessage({"command": "clearLoadFlag"}, function (response) {
      ;
    });
    window.close();
  });

  $('#cmdcancel').on('click', function () {
    window.close();
  });
});
