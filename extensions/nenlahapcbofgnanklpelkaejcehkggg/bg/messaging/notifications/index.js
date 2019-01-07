import RemoteContextMessenger from 'iv-remote-context-messenger';
import {CONTENT_INSTANT_SOURCE, BG_INSTANT_SOURCE, INSTANT_MESSAGING_PORT_NAME} from 'constants';
import BPromise from 'bluebird';
import {List} from 'immutable';
BPromise.config({
  cancellation: true
});
// TODO this is all pretty ugly right now. We should really find better ways
// to do most of this stuff.

const OUTSTANDING_REQUESTS = Symbol('outstandingInstant');
const CANCEL_OUTSTANDING = Symbol('cancelOutstandingInstant');

const messengers = new Map();

chrome.runtime.onMessage.addListener((request, sender) => {
  if (sender.tab && request.src === CONTENT_INSTANT_SOURCE) {
    const messenger = getMessengerForTab(sender.tab.id);
    if (request.data.args) {
      request.data.args.push(sender.tab);
    }
    messenger.handleMessage(request.data);
  }
});

chrome.tabs.onRemoved.addListener(tabId => {
  const messenger = messengers.get(tabId);
  if (messenger) {
    messenger[CANCEL_OUTSTANDING]();
  }
  messengers.delete(tabId);
});

function getMethod(methodName) {
  return require(`messaging/notifications/inbound/${methodName}`).default;
}

function wrapMessenger(messenger) {
  // Override invoke method and automatically reject outstanding invocations
  // whenever a tab gets unloaded
  const origInvoke = messenger.invoke;
  messenger[OUTSTANDING_REQUESTS] = List();
  messenger[CANCEL_OUTSTANDING] = () => {
    messenger[OUTSTANDING_REQUESTS].forEach(promise => promise.cancel());
  };
  messenger.invoke = function invoke(...args) {
    const cancellable = BPromise.try(origInvoke, args, messenger);
    cancellable.args = args;
    messenger[OUTSTANDING_REQUESTS] = messenger[OUTSTANDING_REQUESTS].push(cancellable);
    return cancellable.finally(() => {
      messenger[OUTSTANDING_REQUESTS] = messenger[OUTSTANDING_REQUESTS].filterNot(
        x => x === cancellable
      );
    });
  };

  return messenger;
}

// Keep track of when the tab's JS context gets unloaded and cancel all outstanding
// method invocations
// TODO: Find a better way to do this. Right now we just open up a port from the content
// script and when that port is disconnected we cancel all outstanding invocations
chrome.runtime.onConnect.addListener(function(port) {
  if (
    port.name === INSTANT_MESSAGING_PORT_NAME &&
    port.sender &&
    port.sender.tab &&
    port.sender.tab.id
  ) {
    const tabId = port.sender.tab.id;
    port.onDisconnect.addListener(() => {
      const messenger = messengers.get(tabId);
      if (messenger) {
        messenger[CANCEL_OUTSTANDING]();
      }
    });
  }
});

export default function getMessengerForTab(tabId) {
  let messenger = messengers.get(tabId);
  if (!messenger) {
    messenger = RemoteContextMessenger(getMethod, function(msg) {
      chrome.tabs.sendMessage(tabId, {src: BG_INSTANT_SOURCE, data: msg});
    });
    messenger = wrapMessenger(messenger);
    messengers.set(tabId, messenger);
  }
  return messenger;
}

export function invokeInTab(tabId, methodName) {
  const args = Array.prototype.slice.call(arguments, 2);
  const messenger = getMessengerForTab(tabId);
  return messenger.invoke(methodName, args);
}
