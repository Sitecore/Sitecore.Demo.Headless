import {
  CommonFieldTypes,
  Manifest,
  SitecoreIcon
} from "@sitecore-jss/sitecore-jss-manifest";
import { RichText } from "@sitecore-jss/sitecore-jss-react";

/**
 * Adds the EventList component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function(manifest) {
  manifest.addRouteType({
    name: "event-page",
    displayName: "Event",
    icon: SitecoreIcon.SignalFlag_checkered,
    fields: [
      {
        name: "name",
        type: CommonFieldTypes.SingleLineText,
        displayName: "Event Name",
        required: true,
        standardValue: "$name"
      },
      {
        name: "description",
        type: CommonFieldTypes.RichText,
        displayName: "Event Description",
        required: true
      },
      {
        name: "image",
        type: CommonFieldTypes.Image,
        displayName: "Event Image",
        required: true
      },
      {
        name: "date",
        type: CommonFieldTypes.DateTime,
        displayName: "Event Date",
        required: true,
        standardValue: "$now"
      },
      {
        name: "latitude",
        type: CommonFieldTypes.Number,
        displayName: "Event Latitude"
      },
      {
        name: "longitude",
        type: CommonFieldTypes.Number,
        displayName: "Event Longitude"
      },
      {
        name: "labels",
        type: "multilist",
        source: "query:./*[@@templatename='event-label']",
        displayName: "Event Labels"
      }
    ]
  });
}
