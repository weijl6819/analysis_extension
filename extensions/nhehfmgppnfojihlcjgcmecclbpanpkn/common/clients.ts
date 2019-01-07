import { utils } from '../common/utils';


export module clients {

    export interface UserNote {
        id?: string;
        note?: string;
        noteType?: number;
        created?: Date;
        isPinned?: boolean;
        authorId?: string;
        authorName?: string;
    }

    export interface UserMetadata {
        userId?: string;
        warningLevel?: number;
    }

    export interface BatchUserMetadata {
        batch?: UserMetadata[];
    }

    export interface UserActivitiesResponse {
        metadata?: UserMetadata;
        notes?: UserNote[];
    }

    export interface IsAvailableResponse {
        isAvailable?: boolean;
    }

    // This will contain wrappers for REST calls to the service. TODO: Will be separated for a client per area. For now, this is fine.
    export class ServiceClient {
        // private static readonly baseUri : string = "https://fbgroupsearch.azurewebsites.net/";
        private static readonly baseUri: string = "https://fbsearch-dev.azurewebsites.net/";
        private static readonly userManagementBaseUri: string = ServiceClient.baseUri + "api/usermanagement";

        private token: string;
        private gatheringId: string;
        private userMetadataBatcher: utils.CallbackAsyncBatcher<string, UserMetadata>;


        public constructor(token: string, gatheringId: string) {
            this.gatheringId = gatheringId;
            this.token = token;

            // Calls for getting the metadata of a give user (warning levels etc) can be batched. This will
            // take care of that sort of call.
            // The batcher will trigger either after 20ms or every 30 items requested.
            this.userMetadataBatcher =
                new utils.CallbackAsyncBatcher<string, UserMetadata>(async items => {
                    // Issue the call with all the relevant IDs requested
                    // items is the list of requests (in this case, strings)
                    // Extract those strings into a collection and send to getBatchUserMetadata/
                    let batch = await this.getBatchUserMetadata(items.map(x => x.requested));

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
                 }, 20, 30);
        }

        // For the relevant gatheringId, this will return if the service is available (so for group X this will return true, and for group Y this will
        // return false, depending on whether it's registered or not)
        public async getIsAvailable(): Promise<boolean> {
            var request = ServiceClient.prepareRequestInfo(`${ServiceClient.userManagementBaseUri}/${this.gatheringId}`, this.token, "GET");
            let response = await fetch(request);
            let json: IsAvailableResponse = await response.json();
            return json.isAvailable;
        }

        // Uses the batcher to get a single user metadata
        public getUserMetadata(userId: string): Promise<UserMetadata> {
            return this.userMetadataBatcher.get(userId);
        }

        // Gets a list of activities (notes, etc) for the given user.
        public async getActivities(userId: string) : Promise<UserActivitiesResponse>{
            let request = ServiceClient.prepareRequestInfo(`${ServiceClient.userManagementBaseUri}/${this.gatheringId}/${userId}/activities`, this.token, "GET");
            let response = await fetch(request);
            let json: UserActivitiesResponse = await response.json();
            return json;
        }
        
        // Adds a user note on a specific user.
        public async addUserNote(userId: string, note: string) {
            let body = new utils.UrlEncodedFormData();
            body.addPair("userId", userId);
            body.addPair("note", note);

            // Remove these two when we deploy the actual code to the server.
            body.addPair("authorName", "a");
            body.addPair("authorId", "a");
            let request = ServiceClient.prepareRequestInfo(`${ServiceClient.userManagementBaseUri}/${this.gatheringId}/${userId}/activities`, this.token, "POST", body.toString());
            let response = await fetch(request);
        }

        // Changes the warning level (0/1/2 of the user.)
        public async updateWarningLevel(userId: string, warningLevel: number) {
            let body = new utils.UrlEncodedFormData();
            body.addPair("userId", userId);
            body.addPair("warningLevel", warningLevel);

            let request = ServiceClient.prepareRequestInfo(`${ServiceClient.userManagementBaseUri}/${this.gatheringId}/${userId}/metadata`, this.token, "POST", body.toString());
            let response = await fetch(request);
        }

        // Issues a batch request for multiple users' metadata.
        public async getBatchUserMetadata(userIds: string[]): Promise<BatchUserMetadata> {
            let body = new utils.UrlEncodedFormData();
            for (let userId of userIds) {
                body.addPair("userId", userId);
            }

            let request = ServiceClient.prepareRequestInfo(`${ServiceClient.userManagementBaseUri}/${this.gatheringId}/users/metadata`, this.token, "POST", body.toString());
            let response = await fetch(request);
            let json: BatchUserMetadata = await response.json();
            return json;
        }

        // Static method for creating a request.
        private static prepareRequestInfo(uri: string, token: string, verb: string, body?:any): Request {
            const ri: RequestInit =
                {
                    method: verb,
                    headers: new Headers,
                    body: body,
                };

            ri.headers.append("X-FBGT-TOKEN", token);
            ri.headers.append("Content-Type", "application/x-www-form-urlencoded");
            return new Request(uri, ri);
        }
    }
}
