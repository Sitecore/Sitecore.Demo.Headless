import config from '../temp/config';

export function isOrderCloudConfigured() {
  return config &&
         config.ocBuyerClientId &&
         // Checks that the token was replaced or a environment variable passed
         config.ocBuyerClientId[0] !== "%" &&
         config.ocBaseApiUrl &&
         // Checks that the token was replaced or a environment variable passed
         config.ocBaseApiUrl[0] !== "%";
}
