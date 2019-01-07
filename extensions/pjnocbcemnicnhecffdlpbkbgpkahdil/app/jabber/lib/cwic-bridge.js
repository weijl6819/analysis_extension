(function () {
  'use strict';

  function ExtensionBackground() {
    this.cwicInstanceInfo = {};
  }

  ExtensionBackground.prototype.onExtensionContentConnected = function (port) {
    console.log('Cwic connected');
    if (Object.keys(this.ports).length === 0) {
      this.nativePort = chrome.runtime.connectNative('com.cisco.jsdk');
      this.nativePort.onMessage.addListener(this.onAddOnMessageReceived.bind(this));
      this.nativePort.onDisconnect.addListener(this.onAddonDisconnect.bind(this));
    }
      
    this.ports[port.name] = port;
    port.onMessage.addListener(this.onCwicMessageReceived.bind(this));
    port.onDisconnect.addListener(this.onCwicDisconnect.bind(this, [port.name]));
  };

  ExtensionBackground.prototype.onCwicDisconnect = function (portName) {
    console.log('Cwic disconnected');
    delete this.ports[portName];
    if (Object.keys(this.ports).length === 0) {
      this.nativePort.disconnect();
    } else {
      var message = { ciscoChannelMessage : { client : this.cwicInstanceInfo[portName[0]], clientConnected : false } };
      this.nativePort.postMessage(message);
    }
  };

  ExtensionBackground.prototype.onAddonDisconnect = function () {
    var message = { ciscoChannelMessage : { ciscoChannelServerMessage : { 'name' : 'HostDisconnect', 'cause' : 'test' } } };
    this.onAddOnMessageReceived(message);
    /*for(var portName in this.ports) {
      if (this.ports.hasOwnProperty(portName)) {
        this.ports[portName].postMessage(message);
      }
    }*/
    this.nativePort.disconnect();
  };

  ExtensionBackground.prototype.onCwicMessageReceived = function (message) {
    if (message.type === 'cwicClientConnected') {
      this.cwicInstanceInfo[message.content.id] = message.content;
    } else {
      console.log('Received message from ExtensionContent.');
      this.nativePort.postMessage(message);
    }
  };

  ExtensionBackground.prototype.onAddOnMessageReceived = function (message) {
    console.log('Received message from Add-on.');
    for(var portName in this.ports) {
      if (this.ports.hasOwnProperty(portName)) {
        this.ports[portName].postMessage(message);
      }
    }
    //this.port.postMessage(message);
  };

  ExtensionBackground.prototype.ports = {};
  ExtensionBackground.prototype.port = null;
  ExtensionBackground.prototype.nativePort = null;


  function ExtensionContent() {
  }
  
  ExtensionContent.prototype.innerPort = null;
  ExtensionContent.prototype.isInitialized = false;
  //ExtensionContent.prototype.extensionID = 'jsdk@cisco.com';
  ExtensionContent.prototype.extensionID = 'cisco.jsdk@zang.io';
  
  ExtensionContent.prototype.initialize = function (message) {
    if (!this.isInitialized) {
      var connectionInfo = { name : message.detail };
  
      this.innerPort = chrome.runtime.connect(this.extensionID, connectionInfo);
      this.innerPort.onMessage.addListener(this.onAddOnMessageReceived.bind(this));
      this.innerPort.onDisconnect.addListener(function () {
        //debugger;
      });

      if (this.innerPort.error) {
        //debugger;
      }
  
      this.cwicInstanceInfo = { 'id': message.detail, 'url': 'chrome-extension://ebkfcnbafcfnnppnpfiogednmbbgcmbm', 'hostname': 'ebkfcnbafcfnnppnpfiogednmbbgcmbm', 'name': 'Esna iLink for Cisco' };
      this.innerPort.postMessage({ type : 'cwicClientConnected', content: this.cwicInstanceInfo });
      this.isInitialized = true;
    }
  };
  
  ExtensionContent.prototype.sendMessageToAddon = function (message) {
    if (this.isInitialized) {
      message.ciscoChannelMessage.client  = this.cwicInstanceInfo;
      this.innerPort.postMessage(message);
    }
  };
  
  ExtensionContent.prototype.sendMessageToCwic = function (message) {
    var eventData = message;//cloneInto(message, document.defaultView);
    var addOnEvent = new document.defaultView.CustomEvent('cwic-addon-message', { detail: eventData });
    document.defaultView.dispatchEvent(addOnEvent);
  };
  
  ExtensionContent.prototype.onCwicMessageReceived = function (message) {
    if (message.currentTarget.location.origin !== location.origin) {
      console.error('Invalid Origin');
      throw Error('Invalid Origin');
    }
  
    this.sendMessageToAddon(message.detail);
  };
  
  ExtensionContent.prototype.onAddOnMessageReceived = function (message) {
    this.sendMessageToCwic(message);
  };
  
  ExtensionContent.prototype.exensionAvailable = function () {
    var response = new document.defaultView.CustomEvent('cwic-extension-installed-response', { detail: '' });
    document.defaultView.dispatchEvent(response);
  };
  
  var isInitialized = false;

  function initilize() {
    if (location.href.indexOf('moz-extension:') !== 0) {
      return;
    }

    if (!isInitialized) {
      //var extensionBackground = new ExtensionBackground();
      //chrome.runtime.onConnect.addListener(extensionBackground.onExtensionContentConnected.bind(extensionBackground));
      isInitialized = true;

      var CwicExtension = new ExtensionContent();
  
      window.addEventListener('cwic-message', CwicExtension.onCwicMessageReceived.bind(CwicExtension));
      window.addEventListener('cwic-extension-installed', CwicExtension.exensionAvailable.bind(CwicExtension));
      window.addEventListener('cwic-initialize', CwicExtension.initialize.bind(CwicExtension));
    }
  }

  initilize();
})();