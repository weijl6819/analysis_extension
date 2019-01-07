webpackJsonp(["main"],{

/***/ "../../../../../src/$$_gendir lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_gendir lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__enter_api_key_enter_api_key_component__ = __webpack_require__("../../../../../src/app/enter-api-key/enter-api-key.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__settings_settings_component__ = __webpack_require__("../../../../../src/app/settings/settings.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__loading_loading_component__ = __webpack_require__("../../../../../src/app/loading/loading.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__trial_end_trial_end_component__ = __webpack_require__("../../../../../src/app/trial-end/trial-end.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__link_created_link_created_component__ = __webpack_require__("../../../../../src/app/link-created/link-created.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__link_generator_link_generator_component__ = __webpack_require__("../../../../../src/app/link-generator/link-generator.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__link_creator_link_creator_component__ = __webpack_require__("../../../../../src/app/link-creator/link-creator.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__error_error_component__ = __webpack_require__("../../../../../src/app/error/error.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var routes = [
    { path: 'app', component: __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */] },
    { path: 'enterApiKey', component: __WEBPACK_IMPORTED_MODULE_3__enter_api_key_enter_api_key_component__["a" /* EnterApiKeyComponent */] },
    { path: 'settings', component: __WEBPACK_IMPORTED_MODULE_4__settings_settings_component__["a" /* SettingsComponent */] },
    { path: 'loading', component: __WEBPACK_IMPORTED_MODULE_5__loading_loading_component__["a" /* LoadingComponent */] },
    { path: 'trialEnd', component: __WEBPACK_IMPORTED_MODULE_6__trial_end_trial_end_component__["a" /* TrialEndComponent */] },
    { path: 'linkCreated', component: __WEBPACK_IMPORTED_MODULE_7__link_created_link_created_component__["a" /* LinkCreatedComponent */] },
    { path: 'linkGenerator', component: __WEBPACK_IMPORTED_MODULE_8__link_generator_link_generator_component__["a" /* LinkGeneratorComponent */] },
    { path: 'linkCreator', component: __WEBPACK_IMPORTED_MODULE_9__link_creator_link_creator_component__["a" /* LinkCreatorComponent */] },
    { path: 'error', component: __WEBPACK_IMPORTED_MODULE_10__error_error_component__["a" /* ErrorComponent */] },
    { path: '', redirectTo: 'loading', pathMatch: 'full' }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* RouterModule */].forRoot(routes)],
        exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* RouterModule */]]
    })
], AppRoutingModule);

//# sourceMappingURL=app-routing.module.js.map

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#pixelme-root{\r\n  width: 450px;\r\n  height: 450px;\r\n  background-color: #fff;\r\n\r\n  position: relative;\r\n}\r\n\r\n.app{\r\n  height: 100%;\r\n}\r\n\r\n.app .section{\r\n    height: 75%;\r\n    padding: 0 5%;\r\n\r\n    display: -webkit-box;\r\n\r\n    display: -ms-flexbox;\r\n\r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    -ms-flex-pack: distribute;\r\n        justify-content: space-around;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n  }\r\n\r\n.app .footer{\r\n    text-align: center;\r\n    height: 5%;\r\n  }\r\n\r\n.app .footer a{\r\n      color:#2e89e2;\r\n    }\r\n\r\n.app .header{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n\r\n  height: 25%;\r\n  position: relative;\r\n}\r\n\r\n.app .header img{\r\n   width: 33%;\r\n   -o-object-fit: contain;\r\n      object-fit: contain;\r\n  }\r\n\r\n.settingsWrap {\r\n  position: absolute;\r\n  \r\n  top: 15px;\r\n  right: 10px;\r\n}\r\n\r\n.dropdown-item {\r\n  padding-left: 10px;\r\n  margin: 5px 0;\r\n}\r\n\r\n.link-blue {\r\n  color: #0d71bb !important;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"pixelme-root\">\n    <div class=\"app\">\n\n        <div class=\"header\">\n            <img src=\"../../images/logo.png\" alt=\"\" />\n\n            <!-- <div class=\"settingsWrap\">\n                <a [routerLink]=\"['settings']\">\n                    <i class=\"setting icon big blue\"></i>\n                </a>\n            </div> -->\n\n        </div>\n\n        <router-outlet></router-outlet>\n\n        <div class=\"footer\">\n            Powered by\n            <a href=\"https://pixelme.me/\" target=\"_blank\">PixelMe</a>\n        </div>\n\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__ = __webpack_require__("../../../../../src/app/pixel-me.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = (function () {
    function AppComponent(router, service, ngZone) {
        this.router = router;
        this.service = service;
        this.ngZone = ngZone;
        this.currentTabUrl = '';
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var apiKey = this.service.getApiKey();
        var pixelsSelcted = this.service.getSelectedPixels();
        // checking if api key entered
        if (apiKey) {
            if (pixelsSelcted == null) {
                this.ngZone.runGuarded(function () {
                    _this.router.navigate(['linkGenerator']);
                });
            }
            else {
                this.service.getCurrentTabUrl(function (data) {
                    _this.currentTabUrl = data[0].url;
                    if (_this.currentTabUrl.startsWith("chrome://extensions/?options")) {
                        _this.ngZone.runGuarded(function () {
                            _this.router.navigate(['settings']);
                        });
                    }
                    else if (_this.currentTabUrl.startsWith("chrome://")) {
                        _this.ngZone.runGuarded(function () {
                            _this.router.navigate(['linkCreator']); // create new short     
                        });
                    }
                    else {
                        _this.ngZone.runGuarded(function () {
                            _this.router.navigate(['linkCreated']);
                        });
                    }
                });
            }
        }
        else {
            this.router.navigate(['enterApiKey']);
        }
    };
    return AppComponent;
}());
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__["a" /* PixelMeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__["a" /* PixelMeService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* NgZone */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* NgZone */]) === "function" && _c || Object])
], AppComponent);

var _a, _b, _c;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_semantic_ui__ = __webpack_require__("../../../../ng2-semantic-ui/dist/public.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__enter_api_key_enter_api_key_component__ = __webpack_require__("../../../../../src/app/enter-api-key/enter-api-key.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_routing_module__ = __webpack_require__("../../../../../src/app/app-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__settings_settings_component__ = __webpack_require__("../../../../../src/app/settings/settings.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__trial_end_trial_end_component__ = __webpack_require__("../../../../../src/app/trial-end/trial-end.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__loading_loading_component__ = __webpack_require__("../../../../../src/app/loading/loading.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__link_created_link_created_component__ = __webpack_require__("../../../../../src/app/link-created/link-created.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__link_generator_link_generator_component__ = __webpack_require__("../../../../../src/app/link-generator/link-generator.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pixel_me_service__ = __webpack_require__("../../../../../src/app/pixel-me.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__link_creator_link_creator_component__ = __webpack_require__("../../../../../src/app/link-creator/link-creator.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__error_error_component__ = __webpack_require__("../../../../../src/app/error/error.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
















var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["M" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_6__enter_api_key_enter_api_key_component__["a" /* EnterApiKeyComponent */],
            __WEBPACK_IMPORTED_MODULE_8__settings_settings_component__["a" /* SettingsComponent */],
            __WEBPACK_IMPORTED_MODULE_9__trial_end_trial_end_component__["a" /* TrialEndComponent */],
            __WEBPACK_IMPORTED_MODULE_10__loading_loading_component__["a" /* LoadingComponent */],
            __WEBPACK_IMPORTED_MODULE_11__link_created_link_created_component__["a" /* LinkCreatedComponent */],
            __WEBPACK_IMPORTED_MODULE_12__link_generator_link_generator_component__["a" /* LinkGeneratorComponent */],
            __WEBPACK_IMPORTED_MODULE_14__link_creator_link_creator_component__["a" /* LinkCreatorComponent */],
            __WEBPACK_IMPORTED_MODULE_15__error_error_component__["a" /* ErrorComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_7__app_routing_module__["a" /* AppRoutingModule */],
            __WEBPACK_IMPORTED_MODULE_4_ng2_semantic_ui__["a" /* SuiModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClientModule */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_13__pixel_me_service__["a" /* PixelMeService */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/enter-api-key/enter-api-key.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".apiKey {\r\n  height: 75%;\r\n  padding: 0 5%;\r\n  \r\n  display: -webkit-box;\r\n  \r\n  display: -ms-flexbox;\r\n  \r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  -ms-flex-pack: distribute;\r\n      justify-content: space-around;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n}\r\n\r\n.apiKey p {\r\n    font-size: 22px;\r\n}\r\n\r\n.apiKey .form-group {\r\n  width: 90%;\r\n}\r\n\r\n.apiKey .form-group .input{\r\n  margin-top: 10px;\r\n}\r\n\r\n.apiKey .form-group span.label{\r\n  font-size: 18px;\r\n}\r\n\r\n.apiKey .wide{\r\n  width: 100%;\r\n  /* padding: 5px; */\r\n}\r\n\r\n.apiKey .token-error{\r\n  color: red;\r\n}\r\n\r\n.token-error {\r\n  font-size: 16px;\r\n  color: red;\r\n }\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/enter-api-key/enter-api-key.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"apiKey\">\n  <p>Welcome to PixelMe chrome extension!</p>\n\n  <div class=\"form-group\">\n\n    <span class=\"label\">To get started enter your API Key</span>\n\n    <div class=\"ui input wide\">\n      <input (keyup)=\"onApiKeyEnter($event)\" type=\"text\" placeholder=\"Your API Key\">\n    </div>\n\n    <span>\n      Where can I find my API Key\n      <a href=\"https://app.pixelme.me/settings/token\" target=\"_blank\">Click here.</a>\n    </span>\n\n  </div>\n\n  <div [hidden]=\"apiTokenValid\" class=\"token-error\">\n    API Key is incorrect\n  </div>\n\n  <button (click)=\"onGetStarted()\" [disabled]=\"!apiTokenFilled\" class=\"ui primary button\">\n    Get Started!\n  </button>\n\n</div>"

/***/ }),

/***/ "../../../../../src/app/enter-api-key/enter-api-key.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EnterApiKeyComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__ = __webpack_require__("../../../../../src/app/pixel-me.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var EnterApiKeyComponent = (function () {
    function EnterApiKeyComponent(router, service) {
        this.router = router;
        this.service = service;
        this.apiToken = '';
        this.apiTokenFilled = false;
        this.apiTokenValid = true;
    }
    EnterApiKeyComponent.prototype.ngOnInit = function () {
    };
    EnterApiKeyComponent.prototype.onGetStarted = function () {
        var _this = this;
        this.service.setApiKey(this.apiToken);
        this.service.getAccountResponseStatus((function (data) {
            if (data == null) {
                _this.apiTokenValid = false;
                _this.service.setApiKey('');
            }
            else if (data == 401) {
                _this.apiTokenValid = false;
                _this.service.setApiKey('');
            }
            else if (data == 404) {
                _this.router.navigate(['trialEnd']); // 404 is trial ended
            }
            else {
                _this.service.setApiKey(_this.apiToken);
                _this.router.navigate(['app']); // route to settings
            }
        }));
    };
    EnterApiKeyComponent.prototype.onApiKeyEnter = function (event) {
        this.apiToken = event.target.value;
        if (typeof this.apiToken != 'undefined' && this.apiToken)
            this.apiTokenFilled = true;
        else
            this.apiTokenFilled = false;
    };
    return EnterApiKeyComponent;
}());
EnterApiKeyComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'app-enter-api-key',
        template: __webpack_require__("../../../../../src/app/enter-api-key/enter-api-key.component.html"),
        styles: [__webpack_require__("../../../../../src/app/enter-api-key/enter-api-key.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__["a" /* PixelMeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__["a" /* PixelMeService */]) === "function" && _b || Object])
], EnterApiKeyComponent);

var _a, _b;
//# sourceMappingURL=enter-api-key.component.js.map

/***/ }),

/***/ "../../../../../src/app/error/error.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".error-wrap {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n\r\n    /* justify-content: space-around; */\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    /* align-items: center; */\r\n    \r\n    -webkit-box-align: center;\r\n    \r\n        -ms-flex-align: center;\r\n    \r\n            align-items: center;\r\n    padding: 0 25%;\r\n  \r\n    height: 75%;\r\n  }\r\n    .error-wrap  .error {\r\n        font-size: 32px;\r\n        color: #2e89e2;\r\n        \r\n        margin: 10px 0px;\r\n    }\r\n    .error-wrap  .error-text {\r\n      font-size: 18px;\r\n    }", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/error/error.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"error-wrap\">\n  <div class=\"error\">Error</div>\n  <span class=\"error-text\">{{errorMessage}}</span>\n</div>"

/***/ }),

/***/ "../../../../../src/app/error/error.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ErrorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ErrorComponent = (function () {
    function ErrorComponent(route) {
        this.route = route;
    }
    ErrorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.queryParams.subscribe(function (params) {
            _this.errorMessage = params["errorMessage"];
        });
    };
    return ErrorComponent;
}());
ErrorComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'app-error',
        template: __webpack_require__("../../../../../src/app/error/error.component.html"),
        styles: [__webpack_require__("../../../../../src/app/error/error.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === "function" && _a || Object])
], ErrorComponent);

var _a;
//# sourceMappingURL=error.component.js.map

/***/ }),

/***/ "../../../../../src/app/link-created/link-created.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".createdLink{\r\n    padding-top: 10%;\r\n    padding-bottom: 10%;\r\n  \r\n    height: 75%;\r\n    padding: 0 5%;\r\n    \r\n    display: -webkit-box;\r\n    \r\n    display: -ms-flexbox;\r\n    \r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    -ms-flex-pack: distribute;\r\n        justify-content: space-around;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n}\r\n   .createdLink p{\r\n      font-size: 20px;\r\n      margin: 0;\r\n    }\r\n   .link{\r\n      position: relative;\r\n    }\r\n   .link span{\r\n        display: inline-block;\r\n        text-align: center;\r\n        width: 100%;\r\n      }\r\n   .link span.url{\r\n        font-size: 24px;\r\n        color: #0d71bb;\r\n        cursor: pointer;\r\n      }\r\n   .link span.copy{\r\n        font-size: 16px;\r\n        color: lightgray;\r\n        margin-top: 10px;\r\n  \r\n        position: absolute;\r\n        bottom: -25px;\r\n        left: 50%;\r\n        -webkit-transform: translateX(-50%);\r\n                transform: translateX(-50%);\r\n      }\r\n   .link-edit{\r\n  position: relative;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n\r\n  width: 100%;\r\n}\r\n   .link-edit > * {\r\n    margin: 0px 5px;\r\n  }\r\n   .link-edit .text {\r\n    font-size: 18px;\r\n    font-weight: 500;\r\n  }\r\n   .link-edit .input {\r\n    width: 120px;\r\n    font-size: 14px;\r\n  }\r\n   .createdLink .socials {\r\n    width: 50%;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-pack: distribute;\r\n        justify-content: space-around;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n  }\r\n   i.inverted.circular.blue.icon.fb {\r\n    background-color: #3b5998 !important;\r\n  }\r\n   i.inverted.circular.blue.icon.t {\r\n    background-color: #55acee !important;\r\n  }\r\n   i.circular.inverted.fb {\r\n    background-color: #3b5998 !important;\r\n  }\r\n   i.circular.inverted.tw {\r\n    background-color: #55acee !important;\r\n  }\r\n   .ending-error {\r\n  font-size: 18px;\r\n  color: red;\r\n}      \r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/link-created/link-created.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"loader-wrap\" *ngIf=\"!loaded\">\n    <div class=\"loader\"></div>\n    <span class=\"loader-text\">Loading...</span>\n</div>\n\n<div class=\"createdLink\" *ngIf=\"loaded\">\n\n    <div class=\"settingsWrap\">\n        <a [routerLink]=\"['../settings']\">\n            <i class=\"setting icon big blue\"></i>\n        </a>\n    </div>\n\n\n    <p>Here is your link!</p>\n\n    <div class=\"link\" *ngIf=\"!edit\">\n\n        <span class=\"url\">\n            <a href=\"{{shortedLink}}\" target=\"_blank\"> {{shortedLink}}</a>\n\n            <div style=\"display:inline\" data-tooltip=\"Edit\">\n                <i (click)=\"edit = true\" class=\"edit icon blue small\" color=\"blue\"></i>\n            </div>\n        </span>\n\n        <p></p>\n        <span class=\"copy\">Copied in your clipboard</span>\n\n    </div>\n\n    <div class=\"link-edit\" *ngIf=\"edit\">\n\n        <div class=\"text\">{{linkDomain}}/</div>\n\n        <div class=\"ui input\">\n            <input type=\"text\" placeholder=\"\" [(ngModel)]=\"linkEnding\">\n        </div>\n\n        <button (click)=\"onEditSave()\" [disabled]=\"!linkEnding\" class=\"ui primary button\">\n            Save\n        </button>\n\n    </div>\n\n    <div class=\"ending-error\" *ngIf=\"error\">\n            Key already taken for this domain\n    </div>\n\n    <div class=\"socials\">\n\n        <div data-tooltip=\"Copy to clipboard\">\n            <i (click)=\"copyToClipboard(shortedLink)\" class=\"copy icon blue large\" color=\"blue\"></i>\n        </div>\n\n        <div data-tooltip=\"Share on Facebook\">\n            <i class=\"facebook f icon large circular inverted fb\" (click)=\"onShare('https://www.facebook.com/dialog/share?app_id=174261256475030&display=popup&href='+shortedLink)\"></i>\n        </div>\n\n        <div data-tooltip=\"Share on Twitter\">\n            <i class=\"twitter icon large circular inverted tw\" (click)=\"onShare('https://twitter.com/intent/tweet?text=' + shortedTitle + ' - '+ shortedLink)\"></i>\n        </div>\n\n        <div data-tooltip=\"Share with buffer\">\n            <img src=\"../../images/buffer.png\" alt=\"Smiley face\" height=\"32\" width=\"32\" (click)=\"onShare('https://buffer.com/add?text='+ shortedTitle + '&url=' + shortedLink)\">\n        </div>\n\n    </div>\n\n</div>"

/***/ }),

/***/ "../../../../../src/app/link-created/link-created.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LinkCreatedComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__ = __webpack_require__("../../../../../src/app/pixel-me.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LinkCreatedComponent = (function () {
    function LinkCreatedComponent(router, service, ngZone) {
        this.router = router;
        this.service = service;
        this.ngZone = ngZone;
        this.currentTabUrl = '';
        this.shortedLink = '';
        this.shortedTitle = ''; // for "share" buttons
        this.linkId = ''; // for editing link ending (PATCH request)
        this.linkDomain = '';
        this.linkEnding = '';
        this.loaded = false;
        this.edit = false; // editing link ending mode
        this.error = false; // to show error message
    }
    LinkCreatedComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.linkDomain = this.service.getSelectedDomain();
        // getting tab url
        this.service.getCurrentTabUrl(function (data) {
            _this.currentTabUrl = data[0].url;
            // getting shorten via API
            _this.service.getShortLinkData(_this.currentTabUrl, (function (data) {
                // checking errors
                if (data.error != null) {
                    // checking trial
                    if (data.error.error_message.startsWith('Trial ended')) {
                        _this.router.navigate(['trialEnd']);
                    }
                    else {
                        _this.router.navigate(['error'], { queryParams: { errorMessage: data.error.error_message } });
                    }
                }
                _this.ngZone.runGuarded(function () {
                    _this.linkId = data.id; // for editing link ending
                    _this.shortedLink = data.shorten;
                    _this.shortedTitle = data.title;
                    _this.loaded = true;
                    _this.copyToClipboard(_this.shortedLink);
                });
            }));
        });
    };
    LinkCreatedComponent.prototype.copyToClipboard = function (text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        }
        catch (err) {
            console.log('Oops, unable to copy');
        }
        document.body.removeChild(textArea);
    };
    LinkCreatedComponent.prototype.onShare = function (url) {
        window.open(url, 'popup', 'width=800, height=600');
    };
    LinkCreatedComponent.prototype.onEditSave = function () {
        var _this = this;
        // if error was when last attempt
        this.error = false;
        this.service.editShortLink(this.linkId, this.linkEnding, function (data) {
            _this.loaded = false;
            // checking trial
            if (data.error != null && data.error.error_message.startsWith('Trial ended')) {
                _this.router.navigate(['trialEnd']);
            }
            // checking input errors
            if (data.error != null && data.error.error_message.startsWith('Key already taken for this domain')) {
                _this.error = true;
                _this.loaded = true;
            }
            else {
                _this.shortedLink = data.shorten;
                _this.copyToClipboard(_this.shortedLink);
                _this.edit = false;
                _this.loaded = true;
            }
        });
    };
    return LinkCreatedComponent;
}());
LinkCreatedComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'app-link-created',
        template: __webpack_require__("../../../../../src/app/link-created/link-created.component.html"),
        styles: [__webpack_require__("../../../../../src/app/link-created/link-created.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__["a" /* PixelMeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__["a" /* PixelMeService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* NgZone */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* NgZone */]) === "function" && _c || Object])
], LinkCreatedComponent);

var _a, _b, _c;
//# sourceMappingURL=link-created.component.js.map

/***/ }),

/***/ "../../../../../src/app/link-creator/link-creator.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".linkGenerator {\r\n    height: 75%;\r\n    padding: 0 5%;\r\n    \r\n    display: -webkit-box;\r\n    \r\n    display: -ms-flexbox;\r\n    \r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    -ms-flex-pack: distribute;\r\n        justify-content: space-around;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n  }\r\n  \r\n  \r\n  .linkGenerator p {\r\n    font-size: 22px;\r\n  }\r\n  \r\n  \r\n  .linkGenerator .wrapper {\r\n    width: 100%;\r\n  }\r\n  \r\n  \r\n  .linkGenerator .dropdowns {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: justify;\r\n        -ms-flex-pack: justify;\r\n            justify-content: space-between;\r\n  }\r\n  \r\n  \r\n  .linkGenerator .url-input {\r\n    margin-top: 20px;\r\n    width: 100%;\r\n  }\r\n  \r\n  \r\n  .linkGenerator .inputWrap{\r\n    margin-top: 20px;\r\n  }\r\n  \r\n  \r\n  .linkGenerator .inputWrap  span{\r\n    display: inline-block;\r\n    width: 100%;\r\n    font-size: 18px;\r\n  }\r\n  \r\n  \r\n  .linkGenerator .inputWrap .f img{\r\n    -o-object-fit: contain;\r\n       object-fit: contain;\r\n    vertical-align: middle !important;\r\n  }\r\n  \r\n  \r\n  .linkGenerator .inputWrap .f  span{\r\n    background-color: #4267b2;\r\n    border-radius: 4px;\r\n    color: white;\r\n    padding: 3px 5px;\r\n  }\r\n  \r\n  \r\n  .linkGenerator .inputWrap .t img{\r\n    -o-object-fit: contain;\r\n       object-fit: contain;\r\n    vertical-align: middle !important;\r\n  }\r\n  \r\n  \r\n  .linkGenerator .inputWrap .t  span{\r\n    background-color: #1da1f2;\r\n    border-radius: 4px;\r\n    color: white;\r\n    padding: 3px 5px;\r\n  }\r\n  \r\n  \r\n  .linkGenerator .inputWrap .a img{\r\n    -o-object-fit: contain;\r\n       object-fit: contain;\r\n    vertical-align: middle !important;\r\n  }\r\n  \r\n  \r\n  .linkGenerator .inputWrap .a  span{\r\n    background-color: #34a853;\r\n    border-radius: 4px;\r\n    color: white;\r\n    padding: 3px 5px;\r\n  }\r\n  \r\n  \r\n  p {\r\n    font-size: 22px;\r\n  }\r\n  \r\n  \r\n  .form-group {\r\n    width: 90%;\r\n  }\r\n  \r\n  \r\n  .form-group .input {\r\n    margin-top: 10px;\r\n  }\r\n  \r\n  \r\n  .form-group span.label {\r\n    font-size: 18px;\r\n  }\r\n  \r\n  \r\n  .ui .selection .dropdown .menu {\r\n    overflow: visible !important;\r\n  }\r\n  \r\n  \r\n  .dropdown {\r\n  padding-left: 10px;\r\n  margin: 5px 0;\r\n  }\r\n  \r\n  \r\n  .wide {\r\n  width: 100%;\r\n}\r\n  \r\n  \r\n  .wrapper h5 {\r\n  font-size: 16px;\r\n  font-weight: initial;\r\n}\r\n  \r\n  \r\n  .createdLink{\r\n  padding-top: 10%;\r\n  padding-bottom: 10%;\r\n            \r\n  height: 75%;\r\n  padding: 0 5%;\r\n              \r\n display: -webkit-box;\r\n              \r\n display: -ms-flexbox;\r\n              \r\n display: flex;\r\n -webkit-box-orient: vertical;\r\n -webkit-box-direction: normal;\r\n     -ms-flex-direction: column;\r\n         flex-direction: column;\r\n -ms-flex-pack: distribute;\r\n     justify-content: space-around;\r\n -webkit-box-align: center;\r\n     -ms-flex-align: center;\r\n         align-items: center;\r\n}\r\n  \r\n  \r\n  .createdLink p {\r\n    font-size: 20px;\r\n    margin: 0;\r\n  }\r\n  \r\n  \r\n  .link {\r\n    position: relative;\r\n    }\r\n  \r\n  \r\n  .link span {\r\n      display: inline-block;\r\n      text-align: center;\r\n      width: 100%;\r\n    }\r\n  \r\n  \r\n  .link span.url {\r\n      font-size: 24px;\r\n      color: #0d71bb;\r\n      cursor: pointer;\r\n    }\r\n  \r\n  \r\n  .link span.copy {\r\n      font-size: 16px;\r\n      color: lightgray;\r\n      margin-top: 10px;\r\n            \r\n      position: absolute;\r\n      bottom: -25px;\r\n      left: 50%;\r\n      -webkit-transform: translateX(-50%);\r\n              transform: translateX(-50%);\r\n    }\r\n  \r\n  \r\n  .url-input {\r\n      width: 100px;\r\n      font-size: 12px;\r\n      margin: 0 5px;\r\n    }\r\n  \r\n  \r\n  .createdLink .socials {\r\n      width: 50%;\r\n      display: -webkit-box;\r\n      display: -ms-flexbox;\r\n      display: flex;\r\n      -ms-flex-pack: distribute;\r\n          justify-content: space-around;\r\n      -webkit-box-align: center;\r\n          -ms-flex-align: center;\r\n              align-items: center;\r\n    }\r\n  \r\n  \r\n  i.inverted.circular.blue.icon.fb {\r\n      background-color: #3b5998 !important;\r\n    }\r\n  \r\n  \r\n  i.inverted.circular.blue.icon.t {\r\n      background-color: #55acee !important;\r\n    }\r\n  \r\n  \r\n  i.circular.inverted.fb {\r\n     background-color: #3b5998 !important;\r\n    }\r\n  \r\n  \r\n  i.circular.inverted.tw {\r\n    background-color: #55acee !important;\r\n  }\r\n  \r\n  \r\n  .link-edit {\r\n  position: relative;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: row;\r\n          flex-direction: row;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  \r\n  width: 100%;\r\n}\r\n  \r\n  \r\n  .link-edit > * {\r\n   margin: 0px 5px;\r\n  }\r\n  \r\n  \r\n  .link-edit .text {\r\n    font-size: 18px;\r\n    font-weight: 500;\r\n  }\r\n  \r\n  \r\n  .link-edit .input {\r\n    width: 120px;\r\n    font-size: 14px;\r\n  }\r\n  \r\n  \r\n  .ending-error {\r\n    font-size: 18px;\r\n    color: red;\r\n  }", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/link-creator/link-creator.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"loader-wrap\" *ngIf=\"!loaded\">\n  <div class=\"loader\"></div>\n  <span class=\"loader-text\">Loading...</span>\n</div>\n\n<div class=\"linkGenerator\" *ngIf=\"!created\">\n\n  <div class=\"settingsWrap\">\n    <a [routerLink]=\"['../settings']\">\n      <i class=\"setting icon big blue\"></i>\n    </a>\n  </div>\n\n  <p>Select your Preferences</p>\n\n  <div class=\"wrapper\">\n\n    <div class=\"dropdowns\">\n\n      <div class=\"ui selection dropdown\" id=\"n\">\n        <div class=\"default text\">{{pixelsSelected.length}} pixels selected</div>\n        <i class=\"dropdown icon\"></i>\n        <div class=\"menu\">\n          <div class=\"ui item\" *ngFor=\"let pixel of pixels\" [attr.data-value]=\"pixel\">\n            <input type=\"checkbox\" [checked]=\"pixelsArrayContains(pixelsSelected,pixel)\" (click)=\"onPixelSelected(pixel)\" name=\"{{pixel.name}}\">\n            <label>{{pixel.name}}</label>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"ui selection dropdown\">\n        <div>{{domainSelected}}</div>\n        <i class=\"dropdown icon\"></i>\n        <div class=\"menu\">\n          <option class=\"item\" (click)=\"onDomainSelected(domain)\" *ngFor='let domain of domains' [value]=\"domain\">{{domain}}</option>\n          <!-- <a class=\"blue item\" style=\"color: #377acf;\" href=\"https://app.pixelme.me/settings/domain\" target=\"_blank\">\n            <option>Add a cutom domain</option>\n          </a> -->\n        </div>\n      </div>\n\n    </div>\n\n    <h5>Paste the link you`d like to shorten</h5>\n\n    <div class=\"ui input wide\">\n      <input type=\"text\" placeholder=\"Copy & Paste a link\" [(ngModel)]=\"linkToShorten\" (click)=\"OnInputLinkToShorten()\" (keyup)=\"OnInputLinkToShorten()\">\n    </div>\n\n  </div>\n\n  <button class=\"ui primary button\" [disabled]=\"!isValidLinkToShorten || !domainSelected || pixelsSelected.length === 0\" (click)=\"onPixelizeMe()\">\n    Pixelize Me!\n  </button>\n\n</div>\n\n<div class=\"createdLink\" *ngIf=\"created\">\n\n  <div class=\"settingsWrap\">\n    <a [routerLink]=\"['../settings']\">\n      <i class=\"setting icon big blue\"></i>\n    </a>\n  </div>\n\n  <p>Here is your link!</p>\n\n  <div class=\"link\">\n\n    <span class=\"url\">\n      <a href=\"{{shortedLink}}\" target=\"_blank\"> {{shortedLink}}</a>\n      \n      <div style=\"display:inline\" data-tooltip=\"Edit\">\n          <i (click)=\"edit = true\" class=\"edit icon blue small\" color=\"blue\"></i>\n      </div>\n    </span>\n\n    <p></p>\n    <span class=\"copy\">Copied in your clipboard</span>\n\n  </div>\n\n\n  <div class=\"link-edit\" *ngIf=\"edit\">\n\n    <div class=\"text\">{{linkDomain}}/</div>\n\n    <div class=\"ui input\">\n      <input type=\"text\" placeholder=\"\" [(ngModel)]=\"linkEnding\">\n    </div>\n\n    <button (click)=\"onEditSave()\" [disabled]=\"!linkEnding\" class=\"ui primary button\">\n      Save\n    </button>\n\n  </div>\n\n  <div class=\"ending-error\" *ngIf=\"error\">\n    Key already taken for this domain\n  </div>\n\n\n  <div class=\"socials\">\n\n    <div data-tooltip=\"Copy to clipboard\">\n      <i (click)=\"copyToClipboard(shortedLink)\" class=\"copy icon blue large\" color=\"blue\"></i>\n    </div>\n\n    <div data-tooltip=\"Share on Facebook\">\n      <i class=\"facebook f icon large circular inverted fb\" (click)=\"onShare('https://www.facebook.com/dialog/share?app_id=174261256475030&display=popup&href='+shortedLink)\"></i>\n    </div>\n\n    <div data-tooltip=\"Share on Twitter\">\n      <i class=\"twitter icon large circular inverted tw\" (click)=\"onShare('https://twitter.com/intent/tweet?text=' + shortedTitle + ' - '+ shortedLink)\"></i>\n    </div>\n\n    <div data-tooltip=\"Share with buffer\">\n      <img src=\"../../images/buffer.png\" alt=\"Smiley face\" height=\"32\" width=\"32\" (click)=\"onShare('https://buffer.com/add?text='+ shortedTitle + '&url=' + shortedLink)\">\n    </div>\n\n  </div>\n\n</div>"

/***/ }),

/***/ "../../../../../src/app/link-creator/link-creator.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LinkCreatorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__ = __webpack_require__("../../../../../src/app/pixel-me.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LinkCreatorComponent = (function () {
    function LinkCreatorComponent(router, service) {
        this.router = router;
        this.service = service;
        this.linkToShorten = "";
        this.shortedLink = "";
        this.shortedTitle = "";
        this.linkId = '';
        this.linkDomain = '';
        this.linkEnding = '';
        this.pixels = [];
        this.domains = [];
        this.pixelsSelected = [];
        this.domainSelected = "";
        this.loaded = false;
        this.uiInitialized = false;
        this.created = false; // if link created - for ui refresh
        this.isValidLinkToShorten = false;
        this.edit = false;
        this.error = false;
    }
    LinkCreatorComponent.prototype.ngOnInit = function () {
        this.initializeDropdown();
        this.pixels = this.service.getPixels();
        this.domains = this.service.getDomains();
        this.pixelsSelected = this.service.getSelectedPixels();
        this.domainSelected = this.service.getSelectedDomain();
        this.linkDomain = this.domainSelected;
        this.loaded = true;
    };
    // Called after the ngAfterViewInit and every subsequent ngAfterContentChecked().
    LinkCreatorComponent.prototype.ngAfterViewChecked = function () {
        if (this.loaded == true && this.uiInitialized == false) {
            this.initializeDropdown();
            this.uiInitialized = true;
        }
    };
    LinkCreatorComponent.prototype.OnInputLinkToShorten = function () {
        var urtlPattern = new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
        this.isValidLinkToShorten = urtlPattern.test(this.linkToShorten);
    };
    LinkCreatorComponent.prototype.onPixelizeMe = function () {
        var _this = this;
        this.service.getShortLinkData(this.linkToShorten, (function (data) {
            // checking errors
            if (data.error != null) {
                // checking trial
                if (data.error.error_message.startsWith('Trial ended')) {
                    _this.router.navigate(['trialEnd']);
                }
                else {
                    _this.router.navigate(['error'], { queryParams: { errorMessage: data.error.error_message } });
                }
            }
            _this.linkId = data.id; // for editing link ending
            _this.shortedLink = data.shorten;
            _this.shortedTitle = data.title;
            _this.loaded = true;
            _this.created = true;
            _this.copyToClipboard(_this.shortedLink);
        }));
    };
    // Handling domain selecting in dropdown
    LinkCreatorComponent.prototype.onDomainSelected = function (event) {
        this.domainSelected = event;
    };
    // Handling pixel selecting in dropdown
    LinkCreatorComponent.prototype.onPixelSelected = function (pixel) {
        var idx = this.pixelsArrayIndex(this.pixelsSelected, pixel);
        // Is currently selected
        if (idx > -1) {
            this.pixelsSelected.splice(idx, 1);
        }
        else {
            this.pixelsSelected.push(pixel);
        }
    };
    ;
    // when called, will initialize all dropdown and all checkboxes.
    LinkCreatorComponent.prototype.initializeDropdown = function () {
        $('.ui.selection.dropdown').dropdown();
        $('.ui.checkbox').checkbox();
        $('#n').dropdown({ action: 'nothing' });
    };
    LinkCreatorComponent.prototype.pixelsArrayContains = function (arr, px) {
        return this.service.pixelsArrayContains(arr, px);
    };
    LinkCreatorComponent.prototype.pixelsArrayIndex = function (arr, px) {
        return this.service.pixelsArrayIndex(arr, px);
    };
    LinkCreatorComponent.prototype.copyToClipboard = function (text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        }
        catch (err) {
            console.log('Oops, unable to copy');
        }
        document.body.removeChild(textArea);
    };
    LinkCreatorComponent.prototype.onEditSave = function () {
        var _this = this;
        // if error was when last attempt
        this.error = false;
        this.service.editShortLink(this.linkId, this.linkEnding, function (data) {
            _this.loaded = false;
            // checking errors
            if (data.error != null) {
                // checking trial
                if (data.error.error_message.startsWith('Trial ended')) {
                    _this.router.navigate(['trialEnd']);
                }
                else {
                    _this.router.navigate(['error'], { queryParams: { errorMessage: data.error.error_message } });
                }
            }
            // checking input errors
            if (data.error != null && data.error.error_message.startsWith('Key already taken for this domain')) {
                _this.error = true;
                _this.loaded = true;
            }
            else {
                _this.shortedLink = data.shorten;
                _this.copyToClipboard(_this.shortedLink);
                _this.edit = false;
                _this.loaded = true;
            }
        });
    };
    return LinkCreatorComponent;
}());
LinkCreatorComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'app-link-creator',
        template: __webpack_require__("../../../../../src/app/link-creator/link-creator.component.html"),
        styles: [__webpack_require__("../../../../../src/app/link-creator/link-creator.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__["a" /* PixelMeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__["a" /* PixelMeService */]) === "function" && _b || Object])
], LinkCreatorComponent);

var _a, _b;
//# sourceMappingURL=link-creator.component.js.map

/***/ }),

/***/ "../../../../../src/app/link-generator/link-generator.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".linkGenerator {\r\n    height: 75%;\r\n    padding: 0 5%;\r\n    \r\n    display: -webkit-box;\r\n    \r\n    display: -ms-flexbox;\r\n    \r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    -ms-flex-pack: distribute;\r\n        justify-content: space-around;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n  }\r\n\r\n.linkGenerator p {\r\n    font-size: 22px;\r\n}\r\n\r\n.linkGenerator .wrapper{\r\n      width: 100%;\r\n}\r\n\r\n.linkGenerator .dropdowns {\r\n        display: -webkit-box;\r\n        display: -ms-flexbox;\r\n        display: flex;\r\n        -webkit-box-pack: justify;\r\n            -ms-flex-pack: justify;\r\n                justify-content: space-between;\r\n      }\r\n\r\n.linkGenerator  .url-input {\r\n        margin-top: 20px;\r\n        width: 100%;\r\n      }\r\n\r\n.linkGenerator .inputWrap{\r\n        margin-top: 20px;\r\n      }\r\n\r\n.linkGenerator .inputWrap  span{\r\n          display: inline-block;\r\n          width: 100%;\r\n          font-size: 18px;\r\n        }\r\n\r\n.linkGenerator .inputWrap .f img{\r\n            -o-object-fit: contain;\r\n               object-fit: contain;\r\n            vertical-align: middle !important;\r\n          }\r\n\r\n.linkGenerator .inputWrap .f  span{\r\n            background-color: #4267b2;\r\n            border-radius: 4px;\r\n            color: white;\r\n            padding: 3px 5px;\r\n          }\r\n\r\n.linkGenerator .inputWrap .t img{\r\n            -o-object-fit: contain;\r\n               object-fit: contain;\r\n            vertical-align: middle !important;\r\n          }\r\n\r\n.linkGenerator .inputWrap .t  span{\r\n            background-color: #1da1f2;\r\n            border-radius: 4px;\r\n            color: white;\r\n            padding: 3px 5px;\r\n          }\r\n\r\n.linkGenerator .inputWrap .a img{\r\n            -o-object-fit: contain;\r\n               object-fit: contain;\r\n            vertical-align: middle !important;\r\n          }\r\n\r\n.linkGenerator .inputWrap .a  span{\r\n            background-color: #34a853;\r\n            border-radius: 4px;\r\n            color: white;\r\n            padding: 3px 5px;\r\n          }\r\n\r\np {\r\n            font-size: 22px;\r\n          }\r\n\r\n.form-group {\r\n            width: 90%;\r\n          }\r\n\r\n.form-group .t-input{\r\n              margin-top: 10px;\r\n            }\r\n\r\n.form-group span.label{\r\n                font-size: 18px;\r\n            }\r\n\r\n.ui .selection .dropdown .menu {\r\n                overflow: visible !important;\r\n            }\r\n\r\n.dropdown {\r\n              padding-left: 10px;\r\n              margin: 5px 0;\r\n            }", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/link-generator/link-generator.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"linkGenerator\">\n  <p>Select your Preferences</p>\n\n  <div class=\"wrapper\">\n\n    <div class=\"dropdowns\">\n\n      <div class=\"ui selection dropdown\" id=\"n\" >\n        <div class=\"default text\">{{pixelsSelected.length}} pixels selected</div>\n        <i class=\"dropdown icon\"></i>\n        <div class=\"menu\">\n          <div class=\"ui item\" *ngFor=\"let pixel of pixels\" [attr.data-value]=\"pixel\">\n            <input type=\"checkbox\" (click)=\"onPixelSelected(pixel)\" name=\"{{pixel.name}}\">\n            <label>{{pixel.name}}</label>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"ui selection dropdown\">\n        <div>{{domainSelected}}</div>\n        <i class=\"dropdown icon\"></i>\n        <div class=\"menu\">\n          <option class=\"item\" (click)=\"onDomainSelected(domain)\" *ngFor='let domain of domains' [value]=\"domain\">{{domain}}</option>\n          <a class=\"blue item\" style=\"color: #377acf;\" href=\"https://app.pixelme.me/settings/domain\" target=\"_blank\"> <option >Add a cutom domain</option> </a>\n        </div>\n      </div>\n\n    </div>\n\n  </div>\n\n  <button class=\"ui primary button\" [disabled]=\"pixelsSelected.length === 0\" (click)=\"onStartUsing()\">\n    Save and Start using PixelMe\n  </button>\n\n</div>"

/***/ }),

/***/ "../../../../../src/app/link-generator/link-generator.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LinkGeneratorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__ = __webpack_require__("../../../../../src/app/pixel-me.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LinkGeneratorComponent = (function () {
    function LinkGeneratorComponent(router, service) {
        this.router = router;
        this.service = service;
        this.pixels = [];
        this.domains = [];
        this.pixelsSelected = [];
        this.domainSelected = "";
    }
    LinkGeneratorComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Initializating dropdowns
        this.initializeDropdown();
        // Getting all account data
        this.service.getAccountData((function (data) {
            if (data != null) {
                // checking trial
                if (data.error != null && data.error.error_message.startsWith('Trial ended')) {
                    _this.router.navigate(['trialEnd']);
                }
                // Checking domains
                if (data.domains.length == 0)
                    _this.domains = ["pxlme.me"];
                else
                    _this.domains = data.domains;
                _this.domainSelected = _this.domains[0];
                _this.pixels = data.pixels;
            }
        }));
    };
    LinkGeneratorComponent.prototype.onStartUsing = function () {
        this.service.setPixels(this.pixels);
        this.service.setSelectedPixels(this.pixelsSelected);
        this.service.setDomains(this.domains);
        this.service.setSelectedDomain(this.domainSelected);
        this.router.navigate(['app']);
    };
    // Handling domain selecting in dropdown
    LinkGeneratorComponent.prototype.onDomainSelected = function (event) {
        this.domainSelected = event;
    };
    // Handling pixel selecting in dropdown
    LinkGeneratorComponent.prototype.onPixelSelected = function (pixel) {
        // if (this.pixels.length < 1)
        //   return;
        var idx = this.pixelsSelected.indexOf(pixel);
        // Is currently selected
        if (idx > -1) {
            this.pixelsSelected.splice(idx, 1);
        }
        else {
            this.pixelsSelected.push(pixel);
        }
    };
    ;
    // when called, will initialize all dropdown and all checkboxes.
    LinkGeneratorComponent.prototype.initializeDropdown = function () {
        $('.ui.selection.dropdown').dropdown();
        $('.ui.checkbox').checkbox();
        $('#n').dropdown({ action: 'nothing' });
    };
    return LinkGeneratorComponent;
}());
LinkGeneratorComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'app-link-generator',
        template: __webpack_require__("../../../../../src/app/link-generator/link-generator.component.html"),
        styles: [__webpack_require__("../../../../../src/app/link-generator/link-generator.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__["a" /* PixelMeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__pixel_me_service__["a" /* PixelMeService */]) === "function" && _b || Object])
], LinkGeneratorComponent);

var _a, _b;
//# sourceMappingURL=link-generator.component.js.map

/***/ }),

/***/ "../../../../../src/app/loading/loading.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/loading/loading.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"loader-wrap\">\n  <div class=\"loader\"></div>\n  <span class=\"loader-text\">Loading...</span>\n</div>"

/***/ }),

/***/ "../../../../../src/app/loading/loading.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoadingComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LoadingComponent = (function () {
    function LoadingComponent() {
    }
    LoadingComponent.prototype.ngOnInit = function () {
    };
    return LoadingComponent;
}());
LoadingComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'app-loading',
        template: __webpack_require__("../../../../../src/app/loading/loading.component.html"),
        styles: [__webpack_require__("../../../../../src/app/loading/loading.component.css")]
    }),
    __metadata("design:paramtypes", [])
], LoadingComponent);

//# sourceMappingURL=loading.component.js.map

/***/ }),

/***/ "../../../../../src/app/pixel-me.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PixelMeService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__("../../../../rxjs/_esm5/Rx.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PixelMeService = (function () {
    function PixelMeService(http) {
        this.http = http;
        this.apikey = "";
    }
    PixelMeService.prototype.setApiKey = function (apiKey) {
        // chrome.storage.sync.set({'apikey': ApiKey}, function() {
        //   console.log('set api key: ' + ApiKey)
        // });
        this.apikey = apiKey;
        localStorage.setItem('apikey', apiKey);
    };
    PixelMeService.prototype.getApiKey = function () {
        var apiKey;
        //chrome.storage.sync.get("apikey", callback);
        apiKey = this.apikey;
        apiKey = localStorage.getItem('apikey');
        return apiKey;
    };
    PixelMeService.prototype.setPixels = function (pixels) {
        localStorage.setItem('pixels', JSON.stringify(pixels));
    };
    PixelMeService.prototype.getPixels = function () {
        return JSON.parse(localStorage.getItem('pixels'));
    };
    PixelMeService.prototype.setSelectedPixels = function (selectedPixels) {
        localStorage.setItem('selectedpixels', JSON.stringify(selectedPixels));
    };
    PixelMeService.prototype.getSelectedPixels = function () {
        return JSON.parse(localStorage.getItem('selectedpixels'));
    };
    PixelMeService.prototype.setDomains = function (domains) {
        localStorage.setItem('domains', JSON.stringify(domains));
    };
    PixelMeService.prototype.getDomains = function () {
        var domains = JSON.parse(localStorage.getItem('domains'));
        if (domains.length == 0)
            return ["pxlme.me"];
        else
            return domains;
    };
    PixelMeService.prototype.setSelectedDomain = function (domain) {
        localStorage.setItem('selecteddomain', JSON.stringify(domain));
    };
    PixelMeService.prototype.getSelectedDomain = function () {
        var selected = localStorage.getItem('selecteddomain');
        if (selected == 'undefined')
            return "pxlme.me";
        else
            return JSON.parse(localStorage.getItem('selecteddomain'));
    };
    PixelMeService.prototype.getAccountResponseStatus = function (callback) {
        return this.http.get('https://api.pixelme.me/accounts', {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + this.getApiKey()
            }),
            observe: "response"
        }).subscribe(function (res) { return callback(res.status); }, function (err) { return callback(err.status); });
    };
    PixelMeService.prototype.getAccountData = function (callback) {
        return this.http.get('https://api.pixelme.me/accounts', {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + this.getApiKey()
            })
        }).subscribe(function (res) { return callback(res); }, function (err) { return callback(err); });
    };
    // --------------------- working with shorteners -------------------------------------------
    PixelMeService.prototype.getSelectedPixelsIds = function () {
        var sPixels = this.getSelectedPixels();
        var result = [];
        if (sPixels) {
            for (var i = 0; i < sPixels.length; i++) {
                result.push(sPixels[i].id);
            }
        }
        return result;
    };
    PixelMeService.prototype.getCurrentTabUrl = function (callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
            callback(tab); //call the callback with argument
        });
    };
    ;
    PixelMeService.prototype.getShortLinkData = function (urlToShort, callback) {
        var body = {
            url: urlToShort,
            pixels_ids: this.getSelectedPixelsIds()
        };
        var headers1 = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]();
        headers1.set('Access-Control-Allow-Origin', '*');
        headers1.append('Authorization', 'Bearer ' + this.getApiKey());
        return this.http.post('https://api.pixelme.me/redirects', JSON.stringify(body), {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]().
                set('Authorization', 'Bearer ' + this.getApiKey()).
                append('Access-Control-Allow-Origin', '*'),
        }).subscribe(function (res) { return callback(res); }, function (err) { return callback(err); });
    };
    PixelMeService.prototype.editShortLink = function (linkId, ending, callback) {
        var body = {
            key: ending,
            pixels_ids: this.getSelectedPixelsIds()
        };
        var headers1 = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]();
        headers1.set('Access-Control-Allow-Origin', '*');
        headers1.append('Authorization', 'Bearer ' + this.getApiKey());
        return this.http.patch('https://api.pixelme.me/redirects/' + linkId, JSON.stringify(body), {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]().
                set('Authorization', 'Bearer ' + this.getApiKey()).
                append('Access-Control-Allow-Origin', '*'),
        }).subscribe(function (res) { return callback(res); }, function (err) { return callback(err); });
    };
    // ----------------------------------- Some additional methods ---------------------------------
    PixelMeService.prototype.pixelsArrayEqual = function (arr1, arr2) {
        try {
            if (arr1.length !== arr2.length)
                return false;
            for (var i = arr1.length; i--;) {
                if ((arr1[i].created_at !== arr2[i].created_at) ||
                    (arr1[i].id !== arr2[i].id) ||
                    (arr1[i].key !== arr2[i].key) ||
                    (arr1[i].name !== arr2[i].name) ||
                    (arr1[i].provider_key !== arr2[i].provider_key))
                    return false;
            }
            return true;
        }
        catch (Error) {
            return false;
        }
    };
    PixelMeService.prototype.pixelsArrayContains = function (arr, px) {
        try {
            if (!arr)
                return false;
            for (var i = arr.length; i--;) {
                if ((arr[i].created_at == px.created_at) &&
                    (arr[i].id == px.id) &&
                    (arr[i].key == px.key) &&
                    (arr[i].name == px.name) &&
                    (arr[i].provider_key == px.provider_key))
                    return true;
            }
            return false;
        }
        catch (Error) {
            return false;
        }
    };
    PixelMeService.prototype.pixelsArrayIndex = function (arr, px) {
        try {
            if (!arr)
                -1;
            for (var i = arr.length; i--;) {
                if ((arr[i].created_at == px.created_at) &&
                    (arr[i].id == px.id) &&
                    (arr[i].key == px.key) &&
                    (arr[i].name == px.name) &&
                    (arr[i].provider_key == px.provider_key))
                    return i;
            }
            return -1;
        }
        catch (Error) {
            return -1;
        }
    };
    return PixelMeService;
}());
PixelMeService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]) === "function" && _a || Object])
], PixelMeService);

var _a;
//# sourceMappingURL=pixel-me.service.js.map

/***/ }),

/***/ "../../../../../src/app/settings/settings.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".settings {\r\n    height: 75%;\r\n    padding: 0 5%;\r\n    \r\n    display: -webkit-box;\r\n    \r\n    display: -ms-flexbox;\r\n    \r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    -ms-flex-pack: distribute;\r\n        justify-content: space-around;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n  }\r\n\r\n.settings p {\r\n    font-size: 22px;\r\n}\r\n\r\n.settings .wrapper{\r\n      width: 100%;\r\n}\r\n\r\n.settings .dropdowns {\r\n        display: -webkit-box;\r\n        display: -ms-flexbox;\r\n        display: flex;\r\n        -webkit-box-pack: justify;\r\n            -ms-flex-pack: justify;\r\n                justify-content: space-between;\r\n      }\r\n\r\n.settings .url-input {\r\n    margin-top: 20px;\r\n    width: 100%;\r\n}\r\n\r\n.settings .inputWrap{\r\n    margin-top: 20px;\r\n}\r\n\r\n.settings .inputWrap  span{\r\n  display: inline-block;\r\n  width: 100%;\r\n  font-size: 18px;\r\n}\r\n\r\n.settings .inputWrap .f img{\r\n  -o-object-fit: contain;\r\n     object-fit: contain;\r\n  vertical-align: middle !important;\r\n}\r\n\r\n.settings .inputWrap .f  span{\r\n  background-color: #4267b2;\r\n  border-radius: 4px;\r\n  color: white;\r\n  padding: 3px 5px;\r\n}\r\n\r\n.settings .inputWrap .t img{\r\n  -o-object-fit: contain;\r\n     object-fit: contain;\r\n  vertical-align: middle !important;\r\n}\r\n\r\n.settings .inputWrap .t  span{\r\n  background-color: #1da1f2;\r\n  border-radius: 4px;\r\n  color: white;\r\n  padding: 3px 5px;\r\n}\r\n\r\n.settings .inputWrap .a img{\r\n  -o-object-fit: contain;\r\n     object-fit: contain;\r\n  vertical-align: middle !important;\r\n}\r\n\r\n.settings .inputWrap .a  span{\r\n  background-color: #34a853;\r\n  border-radius: 4px;\r\n  color: white;\r\n  padding: 3px 5px;\r\n}\r\n\r\np {\r\n  font-size: 22px;\r\n}\r\n\r\n.form-group {\r\n  width: 90%;\r\n}\r\n\r\n.form-group .input{\r\n  margin-top: 10px;\r\n}\r\n\r\n.form-group span.label{\r\n  font-size: 18px;\r\n}\r\n\r\n.ui .selection .dropdown .menu {\r\n  overflow: visible !important;\r\n}\r\n\r\n.dropdown {\r\n  padding-left: 10px;\r\n  margin: 5px 0;\r\n}\r\n\r\n.wide{\r\n  width: 100%;\r\n}\r\n\r\n.wrapper h5{\r\n    font-size: 16px;\r\n    font-weight: initial;\r\n}\r\n\r\n.token-error {\r\n  font-size: 16px;\r\n  color: red;\r\n}\r\n\r\n.updated {\r\n  font-size: 16px;\r\n  color: #4267b2;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/settings/settings.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"loader-wrap\" *ngIf=\"!loaded\">\r\n    <div class=\"loader\"></div>\r\n    <span class=\"loader-text\">Loading...</span>\r\n</div>\r\n\r\n<div class=\"settings\" *ngIf=\"loaded\">\r\n    <p>Select your Preferences</p>\r\n\r\n    <div class=\"wrapper\">\r\n\r\n        <div class=\"dropdowns\">\r\n\r\n            <div class=\"ui selection dropdown\" id=\"n\">\r\n                <div class=\"default text\">{{pixelsSelected.length}} pixels selected</div>\r\n                <i class=\"dropdown icon\"></i>\r\n                <div class=\"menu\">\r\n                    <div class=\"ui item\" *ngFor=\"let pixel of pixels\" [attr.data-value]=\"pixel\">\r\n                        <input type=\"checkbox\" [checked]=\"pixelsArrayContains(pixelsSelected,pixel)\" (click)=\"onPixelSelected(pixel)\" name=\"{{pixel.name}}\">\r\n                        <label>{{pixel.name}}</label>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"ui selection dropdown\">\r\n                <div>{{domainSelected}}</div>\r\n                <i class=\"dropdown icon\"></i>\r\n                <div class=\"menu\">\r\n                    <option class=\"item\" (click)=\"onDomainSelected(domain)\" *ngFor='let domain of domains' [value]=\"domain\">{{domain}}</option>\r\n                    <a class=\"blue item\" style=\"color: #377acf;\" href=\"https://app.pixelme.me/settings/domain\" target=\"_blank\">\r\n                        <option>Add a cutom domain</option>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <h5>API Key</h5>\r\n\r\n        <div class=\"ui input wide\">\r\n            <input type=\"text\" placeholder=\"Your API Key\" [(ngModel)]=\"apiKey\">\r\n        </div>\r\n\r\n    </div>\r\n\r\n    <div [hidden]=\"apiKeyValid\" class=\"token-error\">\r\n        API Key is incorrect\r\n    </div>\r\n\r\n    <div [hidden]=\"!updated\" class=\"updated\">\r\n        Preferences updated\r\n    </div>\r\n\r\n    <button class=\"ui primary button\" [disabled]=\"!domainSelected || pixelsSelected.length === 0\" (click)=\"onUpdate()\">\r\n        Update\r\n    </button>\r\n\r\n</div>"

/***/ }),

/***/ "../../../../../src/app/settings/settings.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common__ = __webpack_require__("../../../common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pixel_me_service__ = __webpack_require__("../../../../../src/app/pixel-me.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SettingsComponent = (function () {
    function SettingsComponent(router, service, location) {
        this.router = router;
        this.service = service;
        this.location = location;
        this.apiKey = "";
        this.apiKeyOld = ""; // To check if user changed his api key
        this.pixels = [];
        this.domains = [];
        this.pixelsSelected = [];
        this.domainSelected = "";
        this.pixelsLocal = [];
        this.domainsLocal = [];
        this.pixelsSelectedLocal = [];
        this.domainSelectedLocal = "";
        this.pixelsRemote = [];
        this.domainsRemote = [];
        this.loaded = false;
        this.uiInitialized = false;
        this.apiKeyValid = true; // for "invalid API-Key message"
        this.updated = false; // for "Preferences updated"
    }
    SettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        // getting local user data
        this.apiKey = this.service.getApiKey();
        this.apiKeyOld = this.apiKey;
        this.pixelsLocal = this.service.getPixels();
        this.domainsLocal = this.service.getDomains();
        this.pixelsSelectedLocal = this.service.getSelectedPixels();
        this.domainSelectedLocal = this.service.getSelectedDomain();
        // getting remote account user data
        this.service.getAccountData((function (data) {
            if (data != null) {
                // checking errors
                if (data.error != null) {
                    // checking trial
                    if (data.error.error_message.startsWith('Trial ended')) {
                        _this.router.navigate(['trialEnd']);
                    }
                    else {
                        _this.router.navigate(['error'], { queryParams: { errorMessage: data.error.error_message } });
                    }
                }
                _this.domainsRemote = data.domains;
                _this.pixelsRemote = data.pixels;
                // checking if domains or pixels data changed
                if (!_this.arraysEqual(_this.domainsLocal, _this.domainsRemote)) {
                    _this.domains = _this.domainsRemote;
                    _this.domainSelected = '';
                    _this.service.setDomains(_this.domains);
                }
                if (!_this.pixelsArrayEqual(_this.pixelsLocal, _this.pixelsRemote)) {
                    _this.pixels = _this.pixelsRemote;
                    _this.pixelsSelected = [];
                    _this.service.setPixels(_this.pixels);
                }
                // Checking domains
                if (_this.domainsLocal.length == 0)
                    _this.domainsLocal = ["pxlme.me"];
                _this.domains = _this.domainsLocal;
                _this.pixels = _this.pixelsLocal;
                _this.pixelsSelected = _this.pixelsSelectedLocal;
                _this.domainSelected = _this.domainSelectedLocal;
                _this.loaded = true;
            }
        }));
    };
    // Called after the ngAfterViewInit and every subsequent ngAfterContentChecked().
    SettingsComponent.prototype.ngAfterViewChecked = function () {
        // Initialization of ui elements after loading content
        if (this.loaded == true && this.uiInitialized == false) {
            this.initializeDropdown();
            this.uiInitialized = true;
        }
    };
    SettingsComponent.prototype.onUpdate = function () {
        var _this = this;
        // clean all validation messages
        this.apiKeyValid = true;
        this.updated = false;
        // set selected values
        this.service.setSelectedDomain(this.domainSelected);
        this.service.setSelectedPixels(this.pixelsSelected);
        // check api key
        if (this.apiKey != this.apiKeyOld) {
            this.service.setApiKey(this.apiKey);
            this.service.getAccountResponseStatus((function (data) {
                if (data == null) {
                    _this.apiKeyValid = false;
                    _this.service.setApiKey(_this.apiKeyOld);
                }
                else if (data == 401) {
                    _this.apiKeyValid = false;
                    _this.service.setApiKey(_this.apiKeyOld);
                }
                else {
                    _this.updated = true;
                }
            }));
        }
        else {
            this.updated = true;
        }
    };
    // Handling domain selecting in dropdown
    SettingsComponent.prototype.onDomainSelected = function (event) {
        this.domainSelected = event;
    };
    // Handling pixel selecting in dropdown
    SettingsComponent.prototype.onPixelSelected = function (pixel) {
        var idx = this.pixelsArrayIndex(this.pixelsSelected, pixel);
        // Is currently selected
        if (idx > -1) {
            this.pixelsSelected.splice(idx, 1);
        }
        else {
            this.pixelsSelected.push(pixel);
        }
    };
    ;
    // when called, will initialize all dropdown and all checkboxes.
    SettingsComponent.prototype.initializeDropdown = function () {
        $('.ui.selection.dropdown').dropdown();
        $('.ui.checkbox').checkbox();
        $('#n').dropdown({ action: 'nothing' });
    };
    SettingsComponent.prototype.arraysEqual = function (arr1, arr2) {
        if (arr1.length !== arr2.length)
            return false;
        for (var i = arr1.length; i--;) {
            if (arr1[i] !== arr2[i])
                return false;
        }
        return true;
    };
    SettingsComponent.prototype.pixelsArrayEqual = function (arr1, arr2) {
        return this.service.pixelsArrayEqual(arr1, arr2);
    };
    SettingsComponent.prototype.pixelsArrayContains = function (arr, px) {
        return this.service.pixelsArrayContains(arr, px);
    };
    SettingsComponent.prototype.pixelsArrayIndex = function (arr, px) {
        return this.service.pixelsArrayIndex(arr, px);
    };
    return SettingsComponent;
}());
SettingsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'app-settings',
        template: __webpack_require__("../../../../../src/app/settings/settings.component.html"),
        styles: [__webpack_require__("../../../../../src/app/settings/settings.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__pixel_me_service__["a" /* PixelMeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__pixel_me_service__["a" /* PixelMeService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_common__["f" /* Location */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_common__["f" /* Location */]) === "function" && _c || Object])
], SettingsComponent);

var _a, _b, _c;
//# sourceMappingURL=settings.component.js.map

/***/ }),

/***/ "../../../../../src/app/trial-end/trial-end.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".trial-end {\r\n    height: 75%;\r\n    padding: 0 5%;\r\n    \r\n    display: -webkit-box;\r\n    \r\n    display: -ms-flexbox;\r\n    \r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    -ms-flex-pack: distribute;\r\n        justify-content: space-around;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n  }\r\n\r\n.trial-end p{\r\n    text-align: center;\r\n    font-size: 16px;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/trial-end/trial-end.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"trial-end\">\n  <h3>Your trial period has ended</h3>\n\n  <p>If you`d like to continue using PixelMe, head over to the billing menu to upgrade to one of our paid plans.</p>\n\n  <a href=\"https://app.pixelme.me/billing\" target=\"_blank\" class=\"ui primary button\">\n    Choose your plan!\n  </a>\n\n</div>"

/***/ }),

/***/ "../../../../../src/app/trial-end/trial-end.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TrialEndComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TrialEndComponent = (function () {
    function TrialEndComponent() {
    }
    TrialEndComponent.prototype.ngOnInit = function () {
    };
    return TrialEndComponent;
}());
TrialEndComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'app-trial-end',
        template: __webpack_require__("../../../../../src/app/trial-end/trial-end.component.html"),
        styles: [__webpack_require__("../../../../../src/app/trial-end/trial-end.component.css")]
    }),
    __metadata("design:paramtypes", [])
], TrialEndComponent);

//# sourceMappingURL=trial-end.component.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_23" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map