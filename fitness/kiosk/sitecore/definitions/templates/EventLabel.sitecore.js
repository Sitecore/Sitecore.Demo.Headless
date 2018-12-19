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
    name: "event-label",
    displayName: "Event Label",
    icon: SitecoreIcon.Tag,
    fields: [
      { name: "name", type: CommonFieldTypes.SingleLineText, displayName: "Label Name", required: true, standardValue: "$name" },
      { name: "value", type: CommonFieldTypes.SingleLineText, displayName: "Label Value", required: true },
      { name: "image", type: CommonFieldTypes.Image, displayName: "Label Image", required: true, source: "/sitecore/media library/habitatfitness-kiosk/assets/icons" },
    ]
  });
}