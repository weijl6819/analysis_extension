"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
class AuthenticationServiceProxy {
    constructor(proxyService) {
        this.proxyService = proxyService;
    }
    signin(interactive) {
        return this.invokeInternal("signin", [interactive]);
    }
    signout(token) {
        return this.invokeInternal("signout", [token]);
    }
    getToken() {
        return this.invokeInternal("getToken", []);
    }
    setToken(token) {
        return this.invokeInternal("setToken", [token]);
    }
    getUserInfo(token) {
        return this.invokeInternal("getUserInfo", [token]);
    }
    shareDonation(newsLink) {
        return this.invokeInternal("shareDonation", [newsLink]);
    }
    refreshToken() {
        return this.invokeInternal("refreshToken", []);
    }
    invokeInternal(methodName, args) {
        return this.proxyService.sendRequest(common_1.common.BackgroundProxy, "AuthenticationService", methodName, args);
    }
}
exports.AuthenticationServiceProxy = AuthenticationServiceProxy;
//# sourceMappingURL=Proxies.js.map