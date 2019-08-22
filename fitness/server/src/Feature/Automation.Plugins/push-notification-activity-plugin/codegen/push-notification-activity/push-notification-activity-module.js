import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PushNotificationActivityEditorComponent } from './push-notification-activity-editor.component';
var PushNotificationActivityModule = (function () {
    function PushNotificationActivityModule() {
    }
    PushNotificationActivityModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule, FormsModule
                    ],
                    declarations: [PushNotificationActivityEditorComponent],
                    entryComponents: [PushNotificationActivityEditorComponent]
                },] },
    ];
    return PushNotificationActivityModule;
}());
export { PushNotificationActivityModule };
//# sourceMappingURL=push-notification-activity-module.js.map