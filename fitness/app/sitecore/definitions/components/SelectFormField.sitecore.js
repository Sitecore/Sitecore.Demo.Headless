// eslint-disable-next-line no-unused-vars
import {
  CommonFieldTypes,
  SitecoreIcon,
  Manifest
} from "@sitecore-jss/sitecore-jss-manifest";

/**
 * Adds the SelectFormField component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function(manifest) {
  manifest.addComponent({
    name: "SelectFormField",
    displayName: "Select Form Field",
    icon: SitecoreIcon.DropDown_list,
    fields: [
      { name: "selectName", type: CommonFieldTypes.SingleLineText },
      { name: "selectTitle", type: CommonFieldTypes.SingleLineText },
      { name: "options", type: CommonFieldTypes.ContentList, source: "/sitecore/system/Marketing Control Panel/Profiles" }
    ]
  });
}
