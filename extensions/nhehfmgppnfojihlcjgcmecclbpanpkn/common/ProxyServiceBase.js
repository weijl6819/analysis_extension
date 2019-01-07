"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var proxyService;
(function (proxyService) {
    //TODO (srulyt, 2016-0706) consider IOC and make this a member variable or just expose the proxy service as static methods
    let invocationMap = {};
    // Used to invoke methods accross portions of the extension (Popup/Background/Content)
    class ProxyServiceBase {
        // Proxies are identified by strings, so they can be addressable.
        constructor(proxyId) {
            this.proxyId = proxyId;
            this._services = {
                "_thisService": this
            };
            // We listen to events coming from pub/sub here.
            let self = this;
            if (proxyId) {
                chrome.runtime.onMessage.addListener((m, s, sr) => self.processIncomingRawMessage(m, s, sr));
            }
        }
        // When messages are coming in, they come here.
        processIncomingRawMessage(message, sender, sendResponse) {
            // Make sure we are the address of the call.
            if (message.target === this.proxyId) {
                let invocation = message;
                let messageResponse = null;
                if (invocation) {
                    this.issueOperationCall(invocation, sendResponse);
                }
                // Because the response may be asynchronous, we return true here.
                return true;
            }
        }
        issueOperationCall(invocation, sendResponse) {
            return __awaiter(this, void 0, void 0, function* () {
                let messageResponse;
                try {
                    // Route the request to the correct service.
                    let response = yield this.processIncomingMessage(invocation);
                    // If successful, cast the response.
                    messageResponse = {
                        result: response
                    };
                }
                catch (ex) {
                    // If failed, wrap in an error.
                    messageResponse = {
                        error: ex
                    };
                }
                // Send the response to the caller. It will know how to un-wrap the response object and return the relevant result.
                if (sendResponse) {
                    sendResponse(messageResponse);
                }
            });
        }
        addService(serviceName, service) {
            this._services[serviceName] = service;
        }
        // This sends a request to a given proxy. The answer will come back either as an exception on the Promise
        // Or a resutl.
        sendRequest(targetProxyId, serviceName, methodName, args) {
            let context = {
                target: targetProxyId,
                serviceName: serviceName,
                operationName: methodName,
                arguments: args,
            };
            let result = new Promise((success, reject) => {
                chrome.runtime.sendMessage(context, (r) => {
                    if (r.error) {
                        reject(r.error);
                    }
                    else {
                        success(r.result);
                    }
                });
            });
            return result;
        }
        // This processes incoming mesages (they have already been proven to be addressed at this proxy at this stage)
        processIncomingMessage(invokeContext) {
            return new Promise((resolve, reject) => {
                // First, make sure the service this is addressed at is present.
                let service = this._services[invokeContext.serviceName];
                if (!service) {
                    reject(invokeContext.serviceName + " not found");
                    return;
                }
                // Next, makes sure the operation (the method on the service) is present.
                let operation = service[invokeContext.operationName];
                if (!operation) {
                    reject(invokeContext.operationName + " not found on " + invokeContext.serviceName);
                    return;
                }
                // Finally, call the service method.
                try {
                    let args = Array.isArray(invokeContext.arguments) ? invokeContext.arguments : [invokeContext.arguments];
                    let result = operation.apply(service, args);
                    if (!result) {
                        resolve();
                    }
                    else if (!result.then) {
                        resolve(result);
                    }
                    else {
                        // If the result is a promise, wait for it to complete.
                        result.then(resolve, reject);
                    }
                }
                catch (exception) {
                    reject(exception.toString());
                }
            });
        }
    }
    ProxyServiceBase.ThisService = "_thisService";
    proxyService.ProxyServiceBase = ProxyServiceBase;
})(proxyService = exports.proxyService || (exports.proxyService = {}));
//# sourceMappingURL=ProxyServiceBase.js.map