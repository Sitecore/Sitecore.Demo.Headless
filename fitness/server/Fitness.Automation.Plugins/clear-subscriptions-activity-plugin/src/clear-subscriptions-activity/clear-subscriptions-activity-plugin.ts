import { Plugin } from "@sitecore/ma-core";
import { ClearSubscriptionActivity } from "./clear-subscriptions-activity-activity";
import { ClearSubscriptionActivityEditorComponent } from '../../codegen/clear-subscriptions-activity/clear-subscriptions-activity-editor.component';
import { ClearSubscriptionActivityModuleNgFactory } from "../../codegen/clear-subscriptions-activity/clear-subscriptions-activity-module.ngfactory";

// Use the @Plugin decorator to define all the activities the module contains.
@Plugin({
  activityDefinitions: [
    {
      id: "df10a84b-f3da-4a05-ac70-aa9d378fe0ed",
      activity: ClearSubscriptionActivity,
      editorComponenet: ClearSubscriptionActivityEditorComponent,
      editorModuleFactory: ClearSubscriptionActivityModuleNgFactory
    }
  ]
})
export default class ClearSubscriptionActivityPlugin {}
