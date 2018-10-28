// eslint-disable-next-line no-unused-vars
import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-manifest';

/**
 * Adds the EventList component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function(manifest) {
  manifest.addComponent({
    name: 'RegistrationWizard',
    displayName: 'Registration Wizard',
    icon: SitecoreIcon.Magician,
    fields: [
      {name: 'title', type: CommonFieldTypes.SingleLineText}
    ],
    placeholders: ['hf-registration-wizard']
  });
}
