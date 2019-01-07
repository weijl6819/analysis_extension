export module utils {
    /**
   * Creates a client-side Guid string.
   * @returns A string representation of a Guid.
   */
    export function generateGuid(): string {
        let guid = "",
            idx = 0;

        for (idx = 0; idx < 32; idx += 1) {
            let guidDigitsItem = Math.random() * 16 | 0;
            switch (idx) {
                case 8:
                case 12:
                case 16:
                case 20:
                    guid += "-";
                    break;
            }
            guid += guidDigitsItem.toString(16);
        }

        return guid;
    }

    export class UrlEncodedFormData {
        private items: string[] = [];

         addPair(key: string, value: any) {
            this.items.push(`${key}=${encodeURIComponent(value)}`);
        }

         toString(): string {
            return this.items.join("&");
        }
    }

    // Allows a caller to treat calls as separate asynchronous calls, but batches them up according to custom
    // logic.
    export abstract class AsyncBatcher<R, T> {
        private collected: BatchItem<R,T>[] = [];

         constructor(private delayToBatch: number = 100, private maxCountToBatch?: number) {
        }

        // Issues a request that will go into the batch.
         get(request: R): Promise<T> {
            let bi = new BatchItem<R, T>(request);

            // If no items have been added yet, start the timer that will issue the batch.
            if (this.collected.length === 0) {
                this.log("First item added. Issuing batch timer.");
                this.issueBatchTimer();
            }

            this.collected.push(bi);

            this.checkOnBatchLimits();

            return bi.promise;
        }

        private log(m : any, ...optionalParams:any[]): void {
            logger.log(`AsyncBatcher: ${m}`, optionalParams);
        }

        private async issueBatchTimer(): Promise<boolean> {

            // Store the items locally so we know if they were already sent.
            let items = this.collected;
            this.log("Waiting for timeout to complete...");

            await promiseDelay(this.delayToBatch);
            if (items === this.collected) {
                // We have not sent the items yet. Send them now.
                this.log("Timeout signaled: Collected elements are going to be processed now.")
                this.issueBatchWrapper();
            }
            else {
                this.log("Timeout signaled: Elements have already been sent. Ignoring..")
            }

            return true;
        }

        private checkOnBatchLimits(): void {
            let issue = false;
            issue = this.maxCountToBatch && this.collected.length >= this.maxCountToBatch;

            if (issue) {
                this.log("Limit on item count has been reached. Issuing batch call.")
                this.issueBatchWrapper();
            }
        }

        private async issueBatchWrapper(): Promise<boolean> {
            let current = this.collected;
            this.collected = [];

            try {
                await this.issueBatch(current);
            }
            catch(e) {
            }

            // If any of the promises have not been signalled, do so now.
            current.
                filter(x => !x.isSignalled).
                forEach(x => {
                    this.log(`Item with request ${x.requested} did not have a complete status. Setting as rejected.`)
                    x.setFailure();
                });

            return true;
        }

        protected abstract issueBatch(items:BatchItem<R,T>[]): Promise<boolean>;
    }

    type processAsyncBatcherFunction<R,T> = (items: BatchItem<R, T>[]) => Promise<boolean>;

    // Wraps a batcher with a callback for processing items. Can be used for simple batchers, to avoid the need
    // to inherit.
    export class CallbackAsyncBatcher<R, T> extends AsyncBatcher<R, T> {

        constructor(private process?: processAsyncBatcherFunction<R, T>, delayToBatch?: number, maxCountToBatch?: number) {
            super(delayToBatch, maxCountToBatch);
        }

        protected issueBatch(items: BatchItem<R, T>[]): Promise<boolean> {
            return this.process(items);
        }


    }

    // Used to easily signal a promise - provides a promise that can be triggered via a simple call.
    export class PromiseCompletionSource<T> {
        private innerPromise: Promise<T>;
        private resolver: (value : T) => void;
        private rejecter: () => void;

         constructor() {
            this.innerPromise = new Promise<T>((resolver, rejecter) => {
                this.resolver = resolver;
                this.rejecter = rejecter;
            });
        }

         resolve(value: T) {
            this.resolver(value);
        }

         reject() {
            this.rejecter();
        }

         get promise(): Promise<T> { return this.innerPromise; }
    }

    // Used by the Batcher. Contains the request/result and the other elements needed to 
    // wrap a single call.
    export class BatchItem<R, T> {
        private pcs: PromiseCompletionSource<T>;
        private request: R;
        private result: T;
        private signalled: boolean;

         constructor(request : R) {
            this.pcs = new PromiseCompletionSource<T>();
            this.request = request;
        }

         get promise(): Promise<T> {
            return this.pcs.promise;
        }

         // Signals the batch item as complete.
         setResult(result:T) {
            this.result = result;
            this.signalled = true;
            this.pcs.resolve(result);
        }

        // Signals that the batch failed to run.
         setFailure() {
            this.signalled = true;
            this.pcs.reject();
        }

         get isSignalled(): boolean { return this.signalled; }

         get requested(): R { return this.request;}
    }

    // A promise that wraps a delay.
    export function promiseDelay(ms: number): Promise<boolean> {
        return new Promise<boolean>(resolve => setTimeout(resolve, ms));
    }

    export class logger {
         static shouldLog: boolean = false;

         static log(m:any, ...optionalParams:any[]) : void {
            if (this.shouldLog) {
            }
        }
    }

    // Wrap callback-methods of chrome with promises.
    export class chromeHelper {
        static getAuthToken(details: chrome.identity.TokenDetails): Promise<string> {
            return new Promise(success => {
                chrome.identity.getAuthToken(details,
                    token => success(token));
            });
        }
    }

    // Encodes content as HTML.
    export function htmlEncode(html:string) {
        let el = <HTMLElement>document.createElement('a').appendChild(document.createTextNode(html)).parentNode;
        return el.innerHTML;
    };
}