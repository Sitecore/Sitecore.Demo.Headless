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
  manifest.addTemplate({
    name: "Profile Key",
    fields: [
      { name: "Name", type: CommonFieldTypes.SingleLineText },
    ]
  });
}