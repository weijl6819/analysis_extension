import { utils } from './utils';

export module proxyService {

    //TODO (srulyt, 2016-0706) consider IOC and make this a member variable or just expose the proxy service as static methods
    let invocationMap: { [id: string]: { resolve: (s: string) => void, reject: (s: string) => void } } = {};

    export interface ProxyServiceSuccessResponse {
        result: string;
    }

    export interface ProxyServiceFailureResponse {
        error: string;
    }

    export interface InvokeContext {
        target: string;
        serviceName: string;
        operationName: string;
        arguments?: any;
    }

    export interface HostServiceResponse {
        methodName: string;
        arguments: string[];
    }

    // Used to invoke methods accross portions of the extension (Popup/Background/Content)
    export abstract class ProxyServiceBase {

        protected static readonly ThisService: string = "_thisService";

        private _services: any;
        
        // Proxies are identified by strings, so they can be addressable.
        constructor(private proxyId?: string) {
            this._services = {
                "_thisService": this
            }

            // We listen to events coming from pub/sub here.
            let self = this;
            if (proxyId) {
                chrome.runtime.onMessage.addListener((m, s, sr) => self.processIncomingRawMessage(m, s, sr));
            }
        }

        // When messages are coming in, they come here.
        private processIncomingRawMessage(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) : boolean {
            // Make sure we are the address of the call.
            if (message.target === this.proxyId) {
                let invocation = <InvokeContext>message;
                let messageResponse:any = null;

                if (invocation) {
                    this.issueOperationCall(invocation, sendResponse)
                }
                
                // Because the response may be asynchronous, we return true here.
                return true;
            }
        }

        private async issueOperationCall(invocation: InvokeContext, sendResponse: (response: any) => void) {
            let messageResponse:any;
            try {
                // Route the request to the correct service.
                let response = await this.processIncomingMessage(invocation);

                // If successful, cast the response.
                messageResponse = <ProxyServiceSuccessResponse>{
                    result: response
                };
            }
            catch (ex) {
                // If failed, wrap in an error.
                messageResponse = <ProxyServiceFailureResponse>{
                    error: ex
                };
            }


            // Send the response to the caller. It will know how to un-wrap the response object and return the relevant result.
            if (sendResponse) {
                sendResponse(messageResponse);
            }

        }

        public addService(serviceName: string, service: any) {
            this._services[serviceName] = service;
        }

        // This sends a request to a given proxy. The answer will come back either as an exception on the Promise
        // Or a resutl.
        public sendRequest(targetProxyId: string, serviceName: string, methodName: string, args?: any): Promise<any> {
            let context: InvokeContext = {
                target: targetProxyId,
                serviceName: serviceName,
                operationName: methodName,
                arguments: args,
            };

            let result = new Promise<any>((success,reject) => {
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
        private processIncomingMessage(invokeContext: InvokeContext): Promise<any> {
            return new Promise<any>((resolve, reject) => {
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
                    if (!result) { // THis means that the result was null.
                        resolve();
                    }
                    else if (!result.then) { // This means that the result was not a promise (so synchronous - we can just return)
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
}

