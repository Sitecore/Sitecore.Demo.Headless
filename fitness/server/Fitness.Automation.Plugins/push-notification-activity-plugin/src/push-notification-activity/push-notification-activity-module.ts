import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PushNotificationActivityEditorComponent } from './push-notification-activity-editor.component';

@NgModule({
    imports: [
        CommonModule, FormsModule
    ],
    declarations: [PushNotificationActivityEditorComponent],
    entryComponents: [PushNotificationActivityEditorComponent]
})
export class PushNotificationActivityModule { }
