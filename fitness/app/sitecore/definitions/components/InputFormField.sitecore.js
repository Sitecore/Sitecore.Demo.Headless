// eslint-disable-next-line no-unused-vars
import {
  CommonFieldTypes,
  SitecoreIcon,
  Manifest
} from "@sitecore-jss/sitecore-jss-manifest";

/**
 * Adds the InputFormField component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function(manifest) {
  manifest.addComponent({
    name: "InputFormField",
    displayName: 'Input Form Field',
    icon: SitecoreIcon.NumbersField,
    fields: [
      { name: "type", type: CommonFieldTypes.SingleLineText },
      { name: "id", type: CommonFieldTypes.SingleLineText },
      { name: "name", type: CommonFieldTypes.SingleLineText },
      { name: "placeholder", type: CommonFieldTypes.SingleLineText },
      { name: "required", type: CommonFieldTypes.Checkbox }
    ]
  });
}
