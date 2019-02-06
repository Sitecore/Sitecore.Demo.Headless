import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClearSubscriptionActivityEditorComponent } from './clear-subscriptions-activity-editor.component';
var ClearSubscriptionActivityModule = (function () {
    function ClearSubscriptionActivityModule() {
    }
    ClearSubscriptionActivityModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule, FormsModule
                    ],
                    declarations: [ClearSubscriptionActivityEditorComponent],
                    entryComponents: [ClearSubscriptionActivityEditorComponent]
                },] },
    ];
    return ClearSubscriptionActivityModule;
}());
export { ClearSubscriptionActivityModule };
//# sourceMappingURL=clear-subscriptions-activity-module.js.map