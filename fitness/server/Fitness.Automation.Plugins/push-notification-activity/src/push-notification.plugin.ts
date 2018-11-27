import { Plugin } from '@sitecore/ma-core';
import { PushNotificationActivity } from './push-notification/push-notification-actvity';
import { PushNotificationModuleNgFactory } from '../codegen/push-notification/push-notification-module.ngfactory';
import { ReadonlyEditorComponent } from '../codegen/push-notification/editor/readonly-editor.component';

// Use the @Plugin decorator to define all the activities the module contains.
@Plugin({
    activityDefinitions: [
        {
            // The ID must match the ID of the activity type description definition item in the CMS.
            id: '7233ed87-bb7f-4498-8eb2-2e56896d71a7', 
            activity: PushNotificationActivity,
            editorComponenet: ReadonlyEditorComponent,
            editorModuleFactory: PushNotificationModuleNgFactory
        }
    ]
})
export default class PushNotificationPlugin {}
