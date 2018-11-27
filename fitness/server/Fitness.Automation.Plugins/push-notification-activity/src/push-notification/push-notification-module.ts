import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadonlyEditorComponent } from './editor/readonly-editor.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ReadonlyEditorComponent],
    entryComponents: [ReadonlyEditorComponent]
})
export class PushNotificationModule { }
