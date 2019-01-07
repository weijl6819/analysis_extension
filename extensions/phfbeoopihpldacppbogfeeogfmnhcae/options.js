var gNewTabFocus = document.getElementById("newtabfocus");

document.getElementById("gallery").addEventListener("click", function(event) {document.location.href = "http://gallery.brandthunder.com";}, false);
document.getElementById("support").addEventListener("click", function(event) {document.location.href = "http://support.brandthunder.com";}, false);
document.getElementById("shopping").addEventListener("click", function(event) {document.location.href = "https://chrome.google.com/webstore/detail/gjgpklibihonndjdhpkkbefifghlknoh";}, false);
document.getElementById("close_button").addEventListener("click", function(event) {window.close()}, false);
document.getElementById("reinstall_theme").addEventListener("click", function(event) {document.location.href = event.target.href;}, false);
gNewTabFocus.addEventListener("click", function(event) {chrome.storage.local.set({"newtabfocus": gNewTabFocus.checked})}, false);
chrome.storage.local.get(["tid", "newtabfocus"], function(items) {
  if ("tid" in items) {
    document.getElementById("reinstall_theme").href = "http://assets-ds.brandthunder.com/chrome/downloads/" + items.tid + "_theme.crx";
  }
  if ("newtabfocus" in items) {
    gNewTabFocus.checked = items.newtabfocus;
  } else {
    gNewTabFocus.checked = true;
  }
  var req = new XMLHttpRequest();
  req.open("HEAD", "http://assets-ds.brandthunder.com/chrome/downloads/" + items.tid + "_theme.crx");
  req.onload = function(event) {
    if (req.status != 404) {
      document.getElementById("theme").hidden = false;
      document.getElementById("theme_separator").hidden = false;
    }
  }
  req.send(null);
});
