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
var utils;
(function (utils) {
    /**
   * Creates a client-side Guid string.
   * @returns A string representation of a Guid.
   */
    function generateGuid() {
        let guid = "", idx = 0;
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
    utils.generateGuid = generateGuid;
    class UrlEncodedFormData {
        constructor() {
            this.items = [];
        }
        addPair(key, value) {
            this.items.push(`${key}=${encodeURIComponent(value)}`);
        }
        toString() {
            return this.items.join("&");
        }
    }
    utils.UrlEncodedFormData = UrlEncodedFormData;
    // Allows a caller to treat calls as separate asynchronous calls, but batches them up according to custom
    // logic.
    class AsyncBatcher {
        constructor(delayToBatch = 100, maxCountToBatch) {
            this.delayToBatch = delayToBatch;
            this.maxCountToBatch = maxCountToBatch;
            this.collected = [];
        }
        // Issues a request that will go into the batch.
        get(request) {
            let bi = new BatchItem(request);
            // If no items have been added yet, start the timer that will issue the batch.
            if (this.collected.length === 0) {
                this.log("First item added. Issuing batch timer.");
                this.issueBatchTimer();
            }
            this.collected.push(bi);
            this.checkOnBatchLimits();
            return bi.promise;
        }
        log(m, ...optionalParams) {
            logger.log(`AsyncBatcher: ${m}`, optionalParams);
        }
        issueBatchTimer() {
            return __awaiter(this, void 0, void 0, function* () {
                // Store the items locally so we know if they were already sent.
                let items = this.collected;
                this.log("Waiting for timeout to complete...");
                yield promiseDelay(this.delayToBatch);
                if (items === this.collected) {
                    // We have not sent the items yet. Send them now.
                    this.log("Timeout signaled: Collected elements are going to be processed now.");
                    this.issueBatchWrapper();
                }
                else {
                    this.log("Timeout signaled: Elements have already been sent. Ignoring..");
                }
                return true;
            });
        }
        checkOnBatchLimits() {
            let issue = false;
            issue = this.maxCountToBatch && this.collected.length >= this.maxCountToBatch;
            if (issue) {
                this.log("Limit on item count has been reached. Issuing batch call.");
                this.issueBatchWrapper();
            }
        }
        issueBatchWrapper() {
            return __awaiter(this, void 0, void 0, function* () {
                let current = this.collected;
                this.collected = [];
                try {
                    yield this.issueBatch(current);
                }
                catch (e) {
                }
                // If any of the promises have not been signalled, do so now.
                current.
                    filter(x => !x.isSignalled).
                    forEach(x => {
                    this.log(`Item with request ${x.requested} did not have a complete status. Setting as rejected.`);
                    x.setFailure();
                });
                return true;
            });
        }
    }
    utils.AsyncBatcher = AsyncBatcher;
    // Wraps a batcher with a callback for processing items. Can be used for simple batchers, to avoid the need
    // to inherit.
    class CallbackAsyncBatcher extends AsyncBatcher {
        constructor(process, delayToBatch, maxCountToBatch) {
            super(delayToBatch, maxCountToBatch);
            this.process = process;
        }
        issueBatch(items) {
            return this.process(items);
        }
    }
    utils.CallbackAsyncBatcher = CallbackAsyncBatcher;
    // Used to easily signal a promise - provides a promise that can be triggered via a simple call.
    class PromiseCompletionSource {
        constructor() {
            this.innerPromise = new Promise((resolver, rejecter) => {
                this.resolver = resolver;
                this.rejecter = rejecter;
            });
        }
        resolve(value) {
            this.resolver(value);
        }
        reject() {
            this.rejecter();
        }
        get promise() { return this.innerPromise; }
    }
    utils.PromiseCompletionSource = PromiseCompletionSource;
    // Used by the Batcher. Contains the request/result and the other elements needed to 
    // wrap a single call.
    class BatchItem {
        constructor(request) {
            this.pcs = new PromiseCompletionSource();
            this.request = request;
        }
        get promise() {
            return this.pcs.promise;
        }
        // Signals the batch item as complete.
        setResult(result) {
            this.result = result;
            this.signalled = true;
            this.pcs.resolve(result);
        }
        // Signals that the batch failed to run.
        setFailure() {
            this.signalled = true;
            this.pcs.reject();
        }
        get isSignalled() { return this.signalled; }
        get requested() { return this.request; }
    }
    utils.BatchItem = BatchItem;
    // A promise that wraps a delay.
    function promiseDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    utils.promiseDelay = promiseDelay;
    class logger {
        static log(m, ...optionalParams) {
            if (this.shouldLog) {
            }
        }
    }
    logger.shouldLog = false;
    utils.logger = logger;
    // Wrap callback-methods of chrome with promises.
    class chromeHelper {
        static getAuthToken(details) {
            return new Promise(success => {
                chrome.identity.getAuthToken(details, token => success(token));
            });
        }
    }
    utils.chromeHelper = chromeHelper;
    // Encodes content as HTML.
    function htmlEncode(html) {
        let el = document.createElement('a').appendChild(document.createTextNode(html)).parentNode;
        return el.innerHTML;
    }
    utils.htmlEncode = htmlEncode;
    ;
})(utils = exports.utils || (exports.utils = {}));
//# sourceMappingURL=utils.js.map