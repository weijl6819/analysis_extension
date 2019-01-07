import { utils } from '../common/utils';


export module testStuff {
    export class TestAsyncBatcher extends utils.AsyncBatcher<string, string> {
        constructor() {
            super(100, 7);
        }

        protected async issueBatch(items: utils.BatchItem<string, string>[]): Promise<boolean> {
            await utils.promiseDelay(500);
            for (let item of items) {
                item.setResult(item.requested + " COMPLETE");
            }

            return true;
        }


    }
}
