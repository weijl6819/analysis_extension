// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    if(url === 'chrome://newtab/'){
      hideLoader();
      renderStatus('New Tab');
    } else {
      callback(url);
    }
  });
}


function getCurrentTabContent(callback){
  chrome.tabs.executeScript({ file: 'helpers.js' }, function() {
      chrome.tabs.executeScript({ file: 'adgrader.js' }, (results) => {
        callback(results);
      });
  });
}

/**
 * @param {string} searchTerm - Search term.
 * @param {function(string,number,number)} callback - Called when a page has
 *   been found..
 * @param {function(string)} errorCallback - Called when the page is not found.
 */
function getSeoResponse(callback) {
  chrome.tabs.executeScript({ file: 'helpers.js' }, function() {
      chrome.tabs.executeScript({ file: 'pagegrader.js' }, (results) => {
        callback(results);
      });
  });
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function hideLoader() {
  document.getElementById('loading').hidden = true;
}

function showLoader() {
  document.getElementById('loading').hidden = false;
}

function isGoogleComTLD(href) {
    return href.match(/https:\/\/www\.google\..+/i);
}

function getSearchQuery(href) {
    var q = href.match(/.*(\&|\?)q=(.*?)\&/);
    if(q && q.length >= 2){
        q = q[2];
        q = decodeURIComponent(q);
        q = q.replace(/\+/g," ");
        return q;
    } else {
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    var isGoogle = isGoogleComTLD(url);
    if(isGoogle){
        var searchQuery = getSearchQuery(url);
        var pageResult = document.getElementById('page-result');
        if(searchQuery){
            getCurrentTabContent(function(tab) {
                pageResult.innerHTML = tab;
            });
        } else {
            pageResult.innerHTML = "No search query";
        }
        setTimeout(function(){
            hideLoader();
            setTimeout(function(){
                pageResult.hidden = false;
            }, 500);
        }, 800);
        return;
    } else {
      var pageResult = document.getElementById('page-result');
      getSeoResponse(function(response) {
        pageResult.innerHTML = response;
      });
      setTimeout(function(){
          hideLoader();
          setTimeout(function(){
              pageResult.hidden = false;
          }, 500);
      }, 800);
      return;
    }
  });
});
