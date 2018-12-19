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
    name: "product",
    displayName: "Product",
    icon: SitecoreIcon.BoxOpen,
    fields: [
      { name: "title", type: CommonFieldTypes.SingleLineText, displayName: "Product Title", required: true, standardValue: "$name"},
      { name: "description", type: CommonFieldTypes.RichText, displayName: "Product Description", required: true },
      { name: "image", type: CommonFieldTypes.Image, displayName: "Product Image", required: true },
      { name: "link", type: CommonFieldTypes.GeneralLink, displayName: "Product Page Link", required: true }
    ]
  });
}
