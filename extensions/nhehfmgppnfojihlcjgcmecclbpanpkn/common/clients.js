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
var clients;
(function (clients) {
    // This will contain wrappers for REST calls to the service. TODO: Will be separated for a client per area. For now, this is fine.
    class ServiceClient {
        constructor(token, gatheringId) {
            this.gatheringId = gatheringId;
            this.token = token;
            // Calls for getting the metadata of a give user (warning levels etc) can be batched. This will
            // take care of that sort of call.
            // The batcher will trigger either after 20ms or every 30 items requested.
            this.userMetadataBatcher =
                new utils_1.utils.CallbackAsyncBatcher((items) => __awaiter(this, void 0, void 0, function* () {
                    // Issue the call with all the relevant IDs requested
                    // items is the list of requests (in this case, strings)
                    // Extract those strings into a collection and send to getBatchUserMetadata/
                    let batch = yield this.getBatchUserMetadata(items.map(x => x.requested));
                    // Then, for each one, trigger the relevant result (find the item, and trigger it.)
                    items.forEach(x => {
                        let result = batch.batch.filter(i => i.userId === x.requested);
                        if (result[0]) {
                            x.setResult(result[0]);
                        }
                        else {
                            x.setFailure();
                        }
                    });
                    return true;
                }), 20, 30);
        }
        // For the relevant gatheringId, this will return if the service is available (so for group X this will return true, and for group Y this will
        // return false, depending on whether it's registered or not)
        getIsAvailable() {
            return __awaiter(this, void 0, void 0, function* () {
                var request = ServiceClient.prepareRequestInfo(`${ServiceClient.userManagementBaseUri}/${this.gatheringId}`, this.token, "GET");
                let response = yield fetch(request);
                let json = yield response.json();
                return json.isAvailable;
            });
        }
        // Uses the batcher to get a single user metadata
        getUserMetadata(userId) {
            return this.userMetadataBatcher.get(userId);
        }
        // Gets a list of activities (notes, etc) for the given user.
        getActivities(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                let request = ServiceClient.prepareRequestInfo(`${ServiceClient.userManagementBaseUri}/${this.gatheringId}/${userId}/activities`, this.token, "GET");
                let response = yield fetch(request);
                let json = yield response.json();
                return json;
            });
        }
        // Adds a user note on a specific user.
        addUserNote(userId, note) {
            return __awaiter(this, void 0, void 0, function* () {
                let body = new utils_1.utils.UrlEncodedFormData();
                body.addPair("userId", userId);
                body.addPair("note", note);
                // Remove these two when we deploy the actual code to the server.
                body.addPair("authorName", "a");
                body.addPair("authorId", "a");
                let request = ServiceClient.prepareRequestInfo(`${ServiceClient.userManagementBaseUri}/${this.gatheringId}/${userId}/activities`, this.token, "POST", body.toString());
                let response = yield fetch(request);
            });
        }
        // Changes the warning level (0/1/2 of the user.)
        updateWarningLevel(userId, warningLevel) {
            return __awaiter(this, void 0, void 0, function* () {
                let body = new utils_1.utils.UrlEncodedFormData();
                body.addPair("userId", userId);
                body.addPair("warningLevel", warningLevel);
                let request = ServiceClient.prepareRequestInfo(`${ServiceClient.userManagementBaseUri}/${this.gatheringId}/${userId}/metadata`, this.token, "POST", body.toString());
                let response = yield fetch(request);
            });
        }
        // Issues a batch request for multiple users' metadata.
        getBatchUserMetadata(userIds) {
            return __awaiter(this, void 0, void 0, function* () {
                let body = new utils_1.utils.UrlEncodedFormData();
                for (let userId of userIds) {
                    body.addPair("userId", userId);
                }
                let request = ServiceClient.prepareRequestInfo(`${ServiceClient.userManagementBaseUri}/${this.gatheringId}/users/metadata`, this.token, "POST", body.toString());
                let response = yield fetch(request);
                let json = yield response.json();
                return json;
            });
        }
        // Static method for creating a request.
        static prepareRequestInfo(uri, token, verb, body) {
            const ri = {
                method: verb,
                headers: new Headers,
                body: body,
            };
            ri.headers.append("X-FBGT-TOKEN", token);
            ri.headers.append("Content-Type", "application/x-www-form-urlencoded");
            return new Request(uri, ri);
        }
    }
    // private static readonly baseUri : string = "https://fbgroupsearch.azurewebsites.net/";
    ServiceClient.baseUri = "https://fbsearch-dev.azurewebsites.net/";
    ServiceClient.userManagementBaseUri = ServiceClient.baseUri + "api/usermanagement";
    clients.ServiceClient = ServiceClient;
})(clients = exports.clients || (exports.clients = {}));
//# sourceMappingURL=clients.js.map