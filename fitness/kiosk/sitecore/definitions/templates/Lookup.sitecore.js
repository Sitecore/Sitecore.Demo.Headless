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
    name: "lookup",
    displayName: "Lookup",
    icon: "/~/icon/office/32x32/graph_connection_directed.png",
    fields: [{ name: "name", type: CommonFieldTypes.SingleLineText }]
  });
}
