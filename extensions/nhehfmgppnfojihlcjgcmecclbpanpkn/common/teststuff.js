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
const utils_1 = require("../common/utils");
var testStuff;
(function (testStuff) {
    class TestAsyncBatcher extends utils_1.utils.AsyncBatcher {
        constructor() {
            super(100, 7);
        }
        issueBatch(items) {
            return __awaiter(this, void 0, void 0, function* () {
                yield utils_1.utils.promiseDelay(500);
                for (let item of items) {
                    item.setResult(item.requested + " COMPLETE");
                }
                return true;
            });
        }
    }
    testStuff.TestAsyncBatcher = TestAsyncBatcher;
})(testStuff = exports.testStuff || (exports.testStuff = {}));
//# sourceMappingURL=teststuff.js.map