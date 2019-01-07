"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxyServiceBase_1 = require("../common/proxyServiceBase");
const browserHelpers_1 = require("../common/browserHelpers");
// Unused right now.
class ProxyService extends proxyServiceBase_1.proxyService.ProxyServiceBase {
    invokeInternal(invocationId, serviceName, operationName, args) {
        let context = {
            invocationId,
            serviceName,
            operationName,
            arguments: args ? JSON.stringify(args) : null
        };
        let message = {
            isFromHost: true,
            args: [context]
        };
        browserHelpers_1.browserHelpers.getActiveTab().then(tab => {
            chrome.tabs.sendMessage(tab.id, message);
        });
    }
}
exports.ProxyService = ProxyService;
//# sourceMappingURL=ProxyService.js.map