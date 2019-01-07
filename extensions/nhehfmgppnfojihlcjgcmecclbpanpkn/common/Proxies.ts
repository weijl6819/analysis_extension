import { proxyService } from './ProxyServiceBase'
import { common } from './common'

export class AuthenticationServiceProxy implements common.IAuthenticationService {
    constructor(private proxyService: proxyService.ProxyServiceBase) {
    }

    public signin(interactive:boolean): Promise<any> {
        return this.invokeInternal("signin", [interactive]);
    }

    public signout(token: any): Promise<any> {
        return this.invokeInternal("signout", [token]);
    }

    public getToken(): Promise<any> {
        return this.invokeInternal("getToken", []);
    }

    public setToken(token: any): Promise<any> {
        return this.invokeInternal("setToken", [token]);
    }

    public getUserInfo(token: any): Promise<any> {
        return this.invokeInternal("getUserInfo", [token]);
    }

    public shareDonation(newsLink: string): Promise<any> {
        return this.invokeInternal("shareDonation", [newsLink]);
    }

    public refreshToken(): Promise<any> {
        return this.invokeInternal("refreshToken", []);
    }

    private invokeInternal(methodName: string, args: any[]): Promise<any> {
        return this.proxyService.sendRequest(common.BackgroundProxy, "AuthenticationService", methodName, args);
    }   
}