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

export function trackEventSubscribe(eventId) {
  return trackGoal("Subscribe to Event");
}

export function trackEventUnsubscription(eventId) {
  return trackGoal("Unsubscribe to Event");
}

export function trackEventFavorite(eventId) {
  return trackGoal("Favorite Event");
}

export function trackEventUnfavorite(eventId) {
  return trackGoal("Unfavorite Event");
}

export function trackCompleteRegistration() {
  return trackGoal("Complete Registration");
}

export function trackCompleteFavoriteSports() {
  return trackGoal("Complete Favorite Sports");
}


export function trackGoal(goalId) {
  return trackingApi
    .trackEvent([{ goalId }], trackingApiOptions)
    .then(() => console.log("Goal pushed to JSS tracker API"))
    .catch(error => console.error(error));
}
