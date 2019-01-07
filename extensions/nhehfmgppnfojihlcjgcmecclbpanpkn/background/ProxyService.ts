import { proxyService } from '../common/proxyServiceBase';
import { common } from '../common/common';
import { browserHelpers } from '../common/browserHelpers';

// Unused right now.
export class ProxyService extends proxyService.ProxyServiceBase {

    protected invokeInternal(invocationId: string, serviceName: string, operationName: string, args: any) {
        let context = {
            invocationId,
            serviceName,
            operationName,
            arguments: args ? JSON.stringify(args) : null
        };

        let message = {
            isFromHost: true,
            args: [context]
        }

        browserHelpers.getActiveTab().then(tab => {
            chrome.tabs.sendMessage(tab.id, message);
        });
    }

}


