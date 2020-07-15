// eslint-disable-next-line no-unused-vars
import {
  CommonFieldTypes,
  SitecoreIcon,
  Manifest
} from "@sitecore-jss/sitecore-jss-manifest";

/**
 * Adds the WelcomeScreen component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function(manifest) {
  manifest.addComponent({
    name: "WelcomeScreen",
    icon: SitecoreIcon.DocumentTag,
    fields: [
      {
        name: "backgroundImage",
        type: CommonFieldTypes.Image,
        displayName: "Background Image"
      },
      {
        name: "cta",
        type: CommonFieldTypes.GeneralLink,
        displayName: "Call to Action"
      },
      {
        name: "alignment",
        type: CommonFieldTypes.ItemLink,
        source: "/sitecore/content/lighthousefitness-kiosk/Content/alignments",
        displayName: "Call to Action Alignment"
      }
    ]
    /*
    If the component implementation uses <Placeholder> or withPlaceholder to expose a placeholder,
    register it here, or components added to that placeholder will not be returned by Sitecore:
    placeholders: ['exposed-placeholder-name']
    */
  });
}
