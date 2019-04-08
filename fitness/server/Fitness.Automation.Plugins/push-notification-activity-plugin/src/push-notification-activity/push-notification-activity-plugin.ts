import { Plugin } from "@sitecore/ma-core";
import { PushNotificationActivity } from "./push-notification-activity-activity";
import { PushNotificationActivityEditorComponent } from '../../codegen/push-notification-activity/push-notification-activity-editor.component';
import { PushNotificationActivityModuleNgFactory } from "../../codegen/push-notification-activity/push-notification-activity-module.ngfactory";

// Use the @Plugin decorator to define all the activities the module contains.
@Plugin({
  activityDefinitions: [
    {
      id: "7233ed87-bb7f-4498-8eb2-2e56896d71a7",
      activity: PushNotificationActivity,
      editorComponenet: PushNotificationActivityEditorComponent,
      editorModuleFactory: PushNotificationActivityModuleNgFactory
    }
  ]
})
export default class PushNotificationActivityPlugin {}
