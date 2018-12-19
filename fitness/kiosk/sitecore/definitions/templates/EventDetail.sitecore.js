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
    name: "EventDetail",
    displayName: "Event Detail",
    fields: [
      {
        name: "ctaText",
        displayName: "Call To Action Text",
        type: CommonFieldTypes.SingleLineText
      },
      {
        name: "ctaLink",
        displayName: "Call To Action Link",
        type: CommonFieldTypes.GeneralLink
      }
    ]
  });
}
