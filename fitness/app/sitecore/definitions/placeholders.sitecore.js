// eslint-disable-next-line no-unused-vars
import { Manifest } from '@sitecore-jss/sitecore-jss-manifest';

/**
 * Adding placeholders is optional but allows setting a user-friendly display name. Placeholder Settings
 * items will be created for any placeholders explicitly added, or discovered in your routes and component definitions.
 * Invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest
 */
export default function addPlaceholdersToManifest(manifest) {
  manifest.addPlaceholder(
    { name: 'hf-nav', displayName: 'Navigation' },
  );
  manifest.addPlaceholder(
    { name: 'hf-body', displayName: 'Body' },
  );
  manifest.addPlaceholder(
    { name: 'hf-personalization-wizard', displayName: 'Personalization Wizard' },
  );
  manifest.addPlaceholder(
    { name: 'hf-registration-wizard', displayName: 'Registration Wizard' },
  );
  manifest.addPlaceholder(
    { name: 'hf-createaccount-form', displayName: 'Create Account Form' },
  );
  manifest.addPlaceholder(
    { name: 'hf-createaccount-form-group', displayName: 'Create Account Form Group' },
  );
  manifest.addPlaceholder({ name: " hf-home", displayName: "Home" });
}
