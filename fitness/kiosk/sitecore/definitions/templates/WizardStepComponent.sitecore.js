import {
  CommonFieldTypes,
  Manifest,
  SitecoreIcon
} from "@sitecore-jss/sitecore-jss-manifest";

/**
 * Adds the EventList component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function(manifest) {
  manifest.addTemplate({
    name: "wizard-step-component",
    displayName: "Wizard Step Component",
    icon: SitecoreIcon.Tag,
    fields: [
      { name: "title", displayName: "Step Title", type: CommonFieldTypes.SingleLineText },
      { name: "text", displayName: "Step Text", type: CommonFieldTypes.RichText },
      { name: "stepName", displayName: "Step Name", type: CommonFieldTypes.SingleLineText },
      { name: "skipLink", displayName: "Skip Link", type: CommonFieldTypes.GeneralLink }
    ],
  });
}