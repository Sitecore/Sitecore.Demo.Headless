// eslint-disable-next-line no-unused-vars
import {
  CommonFieldTypes,
  SitecoreIcon,
  Manifest
} from "@sitecore-jss/sitecore-jss-manifest";

/**
 * Adds the EventList component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function(manifest) {
  manifest.addComponent({
    name: "EventList",
    displayName: "Event List",
    icon: SitecoreIcon.ListStyle_bullets,
    fields: [
      {
        name: "title",
        displayName: "Title",
        type: CommonFieldTypes.SingleLineText
      }
    ],
    params: [
      {
        name: "take",
        displayName: "Number of events to show",
        type: CommonFieldTypes.Number
      },
      {
        name: "showInGrid",
        displayName: "Show in a Grid",
        standardValue: "0",
        type: CommonFieldTypes.Checkbox
      },
      {
        name: "showTitle",
        displayName: "Show Title",
        standardValue: "1",
        type: CommonFieldTypes.Checkbox
      },
      {
        name: "showEventDescription",
        displayName: "Show Event Description",
        standardValue: "1",
        type: CommonFieldTypes.Checkbox
      },
      {
        name: "personalize",
        displayName: "Personalize Event List",
        type: CommonFieldTypes.Checkbox
      }
    ]
  });
}
