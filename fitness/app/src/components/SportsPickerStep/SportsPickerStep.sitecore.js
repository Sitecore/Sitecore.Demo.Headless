// eslint-disable-next-line no-unused-vars
import {
  CommonFieldTypes,
  SitecoreIcon,
  Manifest
} from "@sitecore-jss/sitecore-jss-manifest";

/**
 * Adds the SportsPickerStep component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function(manifest) {
  manifest.addComponent({
    name: "SportsPickerStep",
    displayName: "Sports Picker Step",
    icon: SitecoreIcon.Step,
    inherits: ["wizard-step-component"],
    fields: [
      {
        name: "selectSkillTitle",
        displayName: "Selected Skill Title",
        type: CommonFieldTypes.SingleLineText
      },
      {
        name: "sports",
        displayName: "Sports",
        type: CommonFieldTypes.ContentList
      }
    ]
    /*
    If the component implementation uses <Placeholder> or withPlaceholder to expose a placeholder,
    register it here, or components added to that placeholder will not be returned by Sitecore:
    placeholders: ['exposed-placeholder-name']
    */
  });
}
