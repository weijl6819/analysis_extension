export module common {
        
    export interface IAuthenticationService {
        signin(interactive:boolean): Promise<any>
        signout(token:any): Promise<any>
        getUserInfo(token:any): Promise<any>
        getToken(): Promise<any>
        setToken(token: any): Promise<any>
        shareDonation(newsLink: string): Promise<any>
        refreshToken(): Promise<any>
    }

    export module consts {
        export const PopupService: string = "PopupService";
        export const Success = "Success";
        export const Failure = "Failure";
    }   

    export class Globals {
        //When debugging the background task cannot get access to the correct tab since the current tab is the debugger windows
        //To solve this we store the last known tabId and use that in cases where the active tab cannot be found
        public static TabId: number;
    }

    export const BackgroundProxy = "background";
    export const PopupProxy = "popup";
    export const ContentProxy = "content";
}

