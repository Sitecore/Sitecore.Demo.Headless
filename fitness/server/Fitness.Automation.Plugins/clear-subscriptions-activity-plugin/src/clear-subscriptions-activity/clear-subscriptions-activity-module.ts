import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClearSubscriptionActivityEditorComponent } from './clear-subscriptions-activity-editor.component';

@NgModule({
    imports: [
        CommonModule, FormsModule
    ],
    declarations: [ClearSubscriptionActivityEditorComponent],
    entryComponents: [ClearSubscriptionActivityEditorComponent]
})
export class ClearSubscriptionActivityModule { }
