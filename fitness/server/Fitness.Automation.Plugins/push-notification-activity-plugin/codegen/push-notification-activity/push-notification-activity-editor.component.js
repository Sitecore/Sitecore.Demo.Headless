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
var PushNotificationActivityEditorComponent = (function (_super) {
    __extends(PushNotificationActivityEditorComponent, _super);
    function PushNotificationActivityEditorComponent(injector) {
        var _this = _super.call(this) || this;
        _this.injector = injector;
        return _this;
    }
    PushNotificationActivityEditorComponent.prototype.ngOnInit = function () {
        this.title = this.model.title || "Hey $first_name$!";
        this.body = this.model.body || "Thanks for registering for the event, it will be outstanding.";
    };
    PushNotificationActivityEditorComponent.prototype.serialize = function () {
        return {
            title: this.title,
            body: this.body
        };
    };
    PushNotificationActivityEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: "readonly-editor",
                    template: "\n    <section class=\"content\">\n      <div class=\"form-group\">\n        <div class=\"row readonly-editor\">\n          <label class=\"col-6 title\">Notification title</label>\n          <div class=\"col-6\"></div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-12\">\n            <input\n              type=\"text\"\n              class=\"form-control\"\n              [(ngModel)]=\"title\"\n            />\n          </div>\n        </div>\n        <div class=\"row\">\n          <p></p>\n        </div>\n        <div class=\"row readonly-editor\">\n          <label class=\"col-12 title\">Notification body</label>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-12\">\n            <input\n                type=\"text\"\n                class=\"form-control\"\n                [(ngModel)]=\"body\"\n              />\n          </div>\n        </div>\n      </div>\n    </section>\n  ",
                    styles: [""]
                },] },
    ];
    PushNotificationActivityEditorComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return PushNotificationActivityEditorComponent;
}(EditorBase));
export { PushNotificationActivityEditorComponent };
//# sourceMappingURL=push-notification-activity-editor.component.js.map