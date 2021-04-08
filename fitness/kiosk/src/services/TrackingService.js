import { trackingApi } from "@sitecore-jss/sitecore-jss-tracking";
import config from "../temp/config";
import { dataFetcher } from "./../utils/dataFetcher";

const trackingApiOptions = {
  host: config.sitecoreApiHost,
  querystringParams: {
    sc_apikey: config.sitecoreApiKey
  },
  fetcher: dataFetcher
};

export function trackCompleteRegistration(email) {
  // TODO: Move this code to a BoxeverService.js file to centralize ID, channel, language, currency, page, and pos.
  // Boxever custom complete registration event
  var customEvent = {
    browser_id: window.Boxever.getID(),
    channel: "WEB",
    language: "EN",
    currency: "CAD",
    pos: "fitness-kiosk.com",
    page: window.location.pathname + window.location.search,
    type: "COMPLETE_REGISTRATION",
    // Custom event properties
    sendTo: email,
    // TODO: Add sport type, event name
  };
  // TODO: Try to return a promise from this call to have it work the same as before
  window.Boxever.eventCreate(customEvent, function (data) { }, 'json');
}

export function trackCompleteFavoriteSports() {
  // TODO: Convert this to a Boxever custom event
  return trackGoal("Complete Favorite Sports");
}

export function trackGoal(goalId) {
  return trackingApi
    .trackEvent([{ goalId }], trackingApiOptions)
    .then(() => console.log("Goal pushed to JSS tracker API"))
    .catch(error => console.error(error));
}
