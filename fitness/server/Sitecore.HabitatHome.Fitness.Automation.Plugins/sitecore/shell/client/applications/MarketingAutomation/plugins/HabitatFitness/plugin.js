(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@angular/core"), require("@sitecore/ma-core"), require("@angular/common"));
	else if(typeof define === 'function' && define.amd)
		define(["@angular/core", "@sitecore/ma-core", "@angular/common"], factory);
	else if(typeof exports === 'object')
		exports["emailActivities"] = factory(require("@angular/core"), require("@sitecore/ma-core"), require("@angular/common"));
	else
		root["emailActivities"] = factory(root["@angular/core"], root["@sitecore/ma-core"], root["@angular/common"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmailCampaignsService", function() { return EmailCampaignsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__angular_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sitecore_ma_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sitecore_ma_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__sitecore_ma_core__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var EmailCampaignsService = (function () {
    function EmailCampaignsService(injector) {
        this.injector = injector;
        this.emailCampaignsUrl = '/sitecore/api/exm/campaigns/automated';
        this.campaignsList = null;
        this.serverConnection = this.injector.get(__WEBPACK_IMPORTED_MODULE_1__sitecore_ma_core__["SERVER_CONNECTION_SERVICE"]);
    }
    EmailCampaignsService.prototype.getAll = function () {
        var _this = this;
        this.campaignsList = null;
        var emailCampaignsPromise = this.serverConnection.get(this.emailCampaignsUrl, true, true);
        emailCampaignsPromise.then(function (campaignsList) {
            _this.campaignsList = campaignsList;
        });
        return emailCampaignsPromise;
    };
    EmailCampaignsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injector"]])
    ], EmailCampaignsService);
    return EmailCampaignsService;
}());

//# sourceMappingURL=email-campaigns.service.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SendEmailEditorComponent", function() { return SendEmailEditorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__angular_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sitecore_ma_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sitecore_ma_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__sitecore_ma_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__email_campaigns_service__ = __webpack_require__(2);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SendEmailEditorComponent = (function (_super) {
    __extends(SendEmailEditorComponent, _super);
    function SendEmailEditorComponent(injector, emailCampaignsService) {
        var _this = _super.call(this) || this;
        _this.injector = injector;
        _this.emailCampaignsService = emailCampaignsService;
        _this.selectedItems = [];
        _this.availableItems = [];
        _this.isDisabled = false;
        _this.maxSelectableOptions = 1;
        return _this;
    }
    SendEmailEditorComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.model.items) {
            this.emailCampaignsService.getAll()
                .then(this.onCampaignListLoaded.bind(this))
                .catch(function () { _this.onCampaignListLoaded([]); });
        }
    };
    SendEmailEditorComponent.prototype.onCampaignListLoaded = function (campaigns) {
        this.model.items = campaigns;
        this.ngOnChanges();
    };
    SendEmailEditorComponent.prototype.ngOnChanges = function () {
        var _this = this;
        if (this.model.messageId && this.model.items) {
            this.selectedItems = this.model.items.filter(function (item) {
                return item.Id === _this.model.messageId;
            });
        }
        else {
            this.selectedItems = new Array();
        }
        this.availableItems = this.calculateAvailable();
        this.maxSelectableOptions = this.maxSelectableOptions === 0 ? (this.availableItems.length + this.selectedItems.length) :
            parseInt(this.maxSelectableOptions, 10);
        this.updateSelectable();
    };
    SendEmailEditorComponent.prototype.serialize = function () {
        var selectedMapped = this.selectedItems.map(function (item) {
            return item.Id;
        });
        var messageId = selectedMapped.length ? selectedMapped[0] : null;
        return {
            messageId: messageId
        };
    };
    SendEmailEditorComponent.prototype.onItemSelected = function (id) {
        var item = this.model.items.find(function (i) { return i.Id === id; });
        if (item) {
            var selectedItem = this.selectedItems.find(function (i) { return i.Id === id; });
            if (!selectedItem) {
                this.selectedItems.splice(0, 0, item);
            }
            this.availableItems = this.calculateAvailable();
            this.updateSelectable();
        }
    };
    SendEmailEditorComponent.prototype.remove = function (elementAt) {
        this.selectedItems.splice(elementAt, 1);
        this.availableItems = this.calculateAvailable();
        this.updateSelectable();
    };
    SendEmailEditorComponent.prototype.calculateAvailable = function () {
        var _this = this;
        return this.model.items ? this.model.items.filter(function (item) {
            return _this.selectedItems.indexOf(item) < 0;
        }) : [];
    };
    SendEmailEditorComponent.prototype.updateSelectable = function () {
        if (this.selectedItems.length < this.maxSelectableOptions) {
            this.isDisabled = false;
        }
        else {
            this.isDisabled = true;
        }
    };
    SendEmailEditorComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'ma-send-email-editor',
            templateUrl: './send-email-editor.component.html',
            styleUrls: ['./send-email-editor.component.css']
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injector"], __WEBPACK_IMPORTED_MODULE_2__email_campaigns_service__["EmailCampaignsService"]])
    ], SendEmailEditorComponent);
    return SendEmailEditorComponent;
}(__WEBPACK_IMPORTED_MODULE_1__sitecore_ma_core__["EditorBase"]));

//# sourceMappingURL=send-email-editor.component.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ma_core_1 = __webpack_require__(1);
var send_email_activity_1 = __webpack_require__(6);
var send_email_module_ngfactory_1 = __webpack_require__(7);
var send_email_editor_component_1 = __webpack_require__(4);
var EmailActivitiesPlugin = (function () {
    function EmailActivitiesPlugin() {
    }
    EmailActivitiesPlugin = __decorate([
        ma_core_1.Plugin({
            activityDefinitions: [
                {
                    id: '7233ed87-bb7f-4498-8eb2-2e56896d71a7',
                    activity: send_email_activity_1.SendEmailActivity,
                    editorComponenet: send_email_editor_component_1.SendEmailEditorComponent,
                    editorModuleFactory: send_email_module_ngfactory_1.SendEmailModuleNgFactory
                }
            ]
        })
    ], EmailActivitiesPlugin);
    return EmailActivitiesPlugin;
}());
exports.default = EmailActivitiesPlugin;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ma_core_1 = __webpack_require__(1);
var SendEmailActivity = (function (_super) {
    __extends(SendEmailActivity, _super);
    function SendEmailActivity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SendEmailActivity.prototype.getVisual = function () {
        return "\n            <div class=\"viewport-send-email marketing-action " + (this.isDefined ? '' : 'undefined') + "\">\n                <span class=\"icon\">\n                    <img src=\"/~/icon/OfficeWhite/32x32/mobile_phone.png\" />\n                </span>\n                <p class=\"text with-subtitle\" title=\"Send push notification\">\n                    Send push notification\n                    <small class=\"subtitle\" title=\"" + this.subTitle + "\">" + this.subTitle + "</small>\n                </p>\n            </div>\n        ";
    };
    Object.defineProperty(SendEmailActivity.prototype, "isDefined", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendEmailActivity.prototype, "subTitle", {
        get: function () {
            if (this.params.parameters.messageId) {
                return "Email campaign selected";
            }
            else {
                return '';
            }
        },
        enumerable: true,
        configurable: true
    });
    return SendEmailActivity;
}(ma_core_1.SingleItem));
exports.SendEmailActivity = SendEmailActivity;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var i0 = __webpack_require__(0);
var i1 = __webpack_require__(8);
var i2 = __webpack_require__(9);
var i3 = __webpack_require__(3);
var i4 = __webpack_require__(2);
exports.SendEmailModuleNgFactory = i0.ɵcmf(i1.SendEmailModule, [], function (_l) {
    return i0.ɵmod([i0.ɵmpd(512, i0.ComponentFactoryResolver, i0.ɵCodegenComponentFactoryResolver, [[8, [i2.SendEmailEditorComponentNgFactory]], [3, i0.ComponentFactoryResolver],
            i0.NgModuleRef]), i0.ɵmpd(4608, i3.NgLocalization, i3.NgLocaleLocalization, [i0.LOCALE_ID]), i0.ɵmpd(4608, i4.EmailCampaignsService, i4.EmailCampaignsService, [i0.Injector]), i0.ɵmpd(512, i3.CommonModule, i3.CommonModule, []),
        i0.ɵmpd(512, i1.SendEmailModule, i1.SendEmailModule, [])]);
});


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SendEmailModule", function() { return SendEmailModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__angular_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__angular_common__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__editor_send_email_editor_component__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__email_campaigns_service__ = __webpack_require__(2);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var SendEmailModule = (function () {
    function SendEmailModule() {
    }
    SendEmailModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"]
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_2__editor_send_email_editor_component__["SendEmailEditorComponent"]],
            entryComponents: [__WEBPACK_IMPORTED_MODULE_2__editor_send_email_editor_component__["SendEmailEditorComponent"]],
            providers: [__WEBPACK_IMPORTED_MODULE_3__email_campaigns_service__["EmailCampaignsService"]]
        })
    ], SendEmailModule);
    return SendEmailModule;
}());

//# sourceMappingURL=send-email.module.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var i0 = __webpack_require__(10);
var i1 = __webpack_require__(0);
var i2 = __webpack_require__(4);
var i3 = __webpack_require__(3);
var i4 = __webpack_require__(2);
var styles_SendEmailEditorComponent = [i0.styles];
exports.RenderType_SendEmailEditorComponent = i1.ɵcrt({ encapsulation: 0,
    styles: styles_SendEmailEditorComponent, data: {} });
function View_SendEmailEditorComponent_1(_l) {
    return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, 'option', [], [[8, 'value', 0]], null, null, null, null)), (_l()(),
            i1.ɵted(1, null, ['', '']))], null, function (_ck, _v) {
        var currVal_0 = _v.context.$implicit.Id;
        _ck(_v, 0, 0, currVal_0);
        var currVal_1 = _v.context.$implicit.Name;
        _ck(_v, 1, 0, currVal_1);
    });
}
function View_SendEmailEditorComponent_2(_l) {
    return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, 'p', [['class',
                'info']], null, null, null, null, null)),
        (_l()(), i1.ɵted(-1, null, ['No email campaigns selected']))], null, null);
}
function View_SendEmailEditorComponent_3(_l) {
    return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, 'p', [], null, null, null, null, null)), (_l()(),
            i1.ɵted(-1, null, ['Contact receives']))], null, null);
}
function View_SendEmailEditorComponent_4(_l) {
    return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 15, 'li', [], null, null, null, null, null)), (_l()(),
            i1.ɵted(-1, null, ['\n                '])), (_l()(), i1.ɵeld(2, 0, null, null, 9, 'div', [['class', 'item union']], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ['\n                    '])),
        (_l()(), i1.ɵeld(4, 0, null, null, 1, 'p', [['class', 'text']], null, null, null, null, null)), (_l()(), i1.ɵted(5, null, ['', ''])), (_l()(), i1.ɵted(-1, null, ['\n                    '])),
        (_l()(), i1.ɵeld(7, 0, null, null, 3, 'button', [['class', 'pointer btn btn-icon-only btn-chromeless']], null, [[null, 'click']], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (('click' === en)) {
                var pd_0 = (_co.remove(_v.context.index) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), i1.ɵted(-1, null, ['\n                        '])),
        (_l()(), i1.ɵeld(9, 0, null, null, 0, 'i', [['aria-hidden', 'true'],
            ['class', 'si si-delete si-s basic-dark']], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ['\n                    '])),
        (_l()(), i1.ɵted(-1, null, ['\n                '])), (_l()(), i1.ɵted(-1, null, ['\n                '])), (_l()(), i1.ɵeld(13, 0, null, null, 1, 'a', [['target', '_blank']], [[8, 'href', 4]], null, null, null, null)), (_l()(), i1.ɵted(-1, null, ['View email campaign details in EXM'])),
        (_l()(), i1.ɵted(-1, null, ['\n            ']))], null, function (_ck, _v) {
        var currVal_0 = _v.context.$implicit.Name;
        _ck(_v, 5, 0, currVal_0);
        var currVal_1 = i1.ɵinlineInterpolate(1, '/sitecore/client/Applications/ECM/Pages/Messages/Automated?id=', _v.context.$implicit.Id, '&sc_speakcontentlang=en');
        _ck(_v, 13, 0, currVal_1);
    });
}
function View_SendEmailEditorComponent_0(_l) {
    return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 33, 'section', [['class',
                'content']], null, null, null, null, null)),
        (_l()(), i1.ɵted(-1, null, ['\n    '])), (_l()(), i1.ɵeld(2, 0, null, null, 13, 'div', [['class', 'form-group']], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ['\n        '])), (_l()(), i1.ɵeld(4, 0, null, null, 1, 'label', [['for', 'select-a-list']], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ['Select an email campaign'])),
        (_l()(), i1.ɵted(-1, null, ['\n        '])), (_l()(), i1.ɵeld(7, 0, null, null, 7, 'select', [['class', 'form-control'], ['id', 'select-a-list']], [[8, 'disabled', 0]], [[null, 'change']], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (('change' === en)) {
                var pd_0 = (_co.onItemSelected($event.target.value) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), i1.ɵted(-1, null, ['\n            '])),
        (_l()(), i1.ɵeld(9, 0, null, null, 1, 'option', [['class', 'default'],
            ['selected', ''], ['value', 'null']], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ['Select an email campaign'])),
        (_l()(), i1.ɵted(-1, null, ['\n            '])), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_SendEmailEditorComponent_1)),
        i1.ɵdid(13, 802816, null, 0, i3.NgForOf, [i1.ViewContainerRef, i1.TemplateRef,
            i1.IterableDiffers], { ngForOf: [0, 'ngForOf'] }, null), (_l()(), i1.ɵted(-1, null, ['\n        '])), (_l()(), i1.ɵted(-1, null, ['\n    '])),
        (_l()(), i1.ɵted(-1, null, ['\n    '])), (_l()(), i1.ɵeld(17, 0, null, null, 0, 'div', [['class', 'divider']], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ['\n    '])), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_SendEmailEditorComponent_2)), i1.ɵdid(20, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, 'ngIf'] }, null), (_l()(),
            i1.ɵted(-1, null, ['\n    '])), (_l()(), i1.ɵeld(22, 0, null, null, 10, 'div', [['class', 'scrollable']], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ['\n        '])), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_SendEmailEditorComponent_3)), i1.ɵdid(25, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, 'ngIf'] }, null),
        (_l()(), i1.ɵted(-1, null, ['\n        '])), (_l()(), i1.ɵeld(27, 0, null, null, 4, 'ul', [['class', 'selected-items']], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ['\n            '])), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_SendEmailEditorComponent_4)), i1.ɵdid(30, 802816, null, 0, i3.NgForOf, [i1.ViewContainerRef, i1.TemplateRef, i1.IterableDiffers], { ngForOf: [0,
                'ngForOf'] }, null), (_l()(), i1.ɵted(-1, null, ['\n        '])),
        (_l()(), i1.ɵted(-1, null, ['\n    '])), (_l()(), i1.ɵted(-1, null, ['\n'])), (_l()(), i1.ɵted(-1, null, ['\n']))], function (_ck, _v) {
        var _co = _v.component;
        var currVal_1 = _co.availableItems;
        _ck(_v, 13, 0, currVal_1);
        var currVal_2 = !_co.selectedItems.length;
        _ck(_v, 20, 0, currVal_2);
        var currVal_3 = _co.selectedItems.length;
        _ck(_v, 25, 0, currVal_3);
        var currVal_4 = _co.selectedItems;
        _ck(_v, 30, 0, currVal_4);
    }, function (_ck, _v) {
        var _co = _v.component;
        var currVal_0 = _co.isDisabled;
        _ck(_v, 7, 0, currVal_0);
    });
}
exports.View_SendEmailEditorComponent_0 = View_SendEmailEditorComponent_0;
function View_SendEmailEditorComponent_Host_0(_l) {
    return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, 'ma-send-email-editor', [], null, null, null, View_SendEmailEditorComponent_0, exports.RenderType_SendEmailEditorComponent)), i1.ɵdid(1, 638976, null, 0, i2.SendEmailEditorComponent, [i1.Injector, i4.EmailCampaignsService], null, null)], function (_ck, _v) {
        _ck(_v, 1, 0);
    }, null);
}
exports.View_SendEmailEditorComponent_Host_0 = View_SendEmailEditorComponent_Host_0;
exports.SendEmailEditorComponentNgFactory = i1.ɵccf('ma-send-email-editor', i2.SendEmailEditorComponent, View_SendEmailEditorComponent_Host_0, { model: 'model' }, {}, []);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.styles = ['h1[_ngcontent-%COMP%] {\n    text-decoration: underline;\n}'];


/***/ })
/******/ ]);
});