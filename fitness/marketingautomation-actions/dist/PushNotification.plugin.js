(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@sitecore/ma-core"));
	else if(typeof define === 'function' && define.amd)
		define(["@sitecore/ma-core"], factory);
	else if(typeof exports === 'object')
		exports["publishActivities"] = factory(require("@sitecore/ma-core"));
	else
		root["publishActivities"] = factory(root["@sitecore/ma-core"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ma_core_1 = __webpack_require__(0);
var push_notification_actvity_1 = __webpack_require__(2);
var push_notification_module_ngfactory_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../codegen/push-notification/push-notification-module.ngfactory\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var readonly_editor_component_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../codegen/push-notification/editor/readonly-editor.component\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var PushNotificationPlugin = (function () {
    function PushNotificationPlugin() {
    }
    PushNotificationPlugin = __decorate([
        ma_core_1.Plugin({
            activityDefinitions: [
                {
                    id: '7233ed87-bb7f-4498-8eb2-2e56896d71a7',
                    activity: push_notification_actvity_1.PushNotificationActivity,
                    editorComponenet: readonly_editor_component_1.ReadonlyEditorComponent,
                    editorModuleFactory: push_notification_module_ngfactory_1.PushNotificationModuleNgFactory
                }
            ]
        })
    ], PushNotificationPlugin);
    return PushNotificationPlugin;
}());
exports.default = PushNotificationPlugin;


/***/ }),
/* 2 */
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
var ma_core_1 = __webpack_require__(0);
var PushNotificationActivity = (function (_super) {
    __extends(PushNotificationActivity, _super);
    function PushNotificationActivity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PushNotificationActivity.prototype.getVisual = function () {
        var subTitle = "Send Push Notification";
        var cssClass = this.isDefined ? "" : "undefined";
        return "\n            <div class=\"viewport-readonly-editor marketing-action " + cssClass + "\">\n                <span class=\"icon\">\n                    <img src=\"/~/icon/OfficeWhite/32x32/mobile_phone.png\" />\n                </span>\n                <p class=\"text with-subtitle\" title=\"Send Push Notification\">\n                Send Push Notification\n                    <small class=\"subtitle\" title=\"" + subTitle + "\">" + subTitle + "</small>\n                </p>\n            </div>\n        ";
    };
    Object.defineProperty(PushNotificationActivity.prototype, "isDefined", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return PushNotificationActivity;
}(ma_core_1.SingleItem));
exports.PushNotificationActivity = PushNotificationActivity;


/***/ })
/******/ ]);
});
//# sourceMappingURL=PushNotification.plugin.js.map