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
import { Component, Injector } from "@angular/core";
import { EditorBase } from "@sitecore/ma-core";
var ClearSubscriptionActivityEditorComponent = (function (_super) {
    __extends(ClearSubscriptionActivityEditorComponent, _super);
    function ClearSubscriptionActivityEditorComponent(injector) {
        var _this = _super.call(this) || this;
        _this.injector = injector;
        return _this;
    }
    ClearSubscriptionActivityEditorComponent.prototype.ngOnInit = function () {
    };
    ClearSubscriptionActivityEditorComponent.prototype.serialize = function () {
        return {};
    };
    ClearSubscriptionActivityEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: "readonly-editor",
                    template: "",
                    styles: [""]
                },] },
    ];
    ClearSubscriptionActivityEditorComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return ClearSubscriptionActivityEditorComponent;
}(EditorBase));
export { ClearSubscriptionActivityEditorComponent };
//# sourceMappingURL=clear-subscriptions-activity-editor.component.js.map