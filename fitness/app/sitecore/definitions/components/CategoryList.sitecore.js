// eslint-disable-next-line no-unused-vars
import {
  CommonFieldTypes,
  SitecoreIcon
} from "@sitecore-jss/sitecore-jss-manifest";

/**
 * Adds the CategoryList component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function(manifest) {
  manifest.addComponent({
    name: "CategoryList",
    displayName: "Category List",
    icon: SitecoreIcon.ListStyle_bullets,
    fields: [
      {
        name: "title",
        displayName: "Title",
        type: CommonFieldTypes.SingleLineText
      }
    ]
  });
}
