import { post } from "./GenericService";
import { firebase } from "@firebase/app";
import "@firebase/messaging";
import { trackingApi } from "@sitecore-jss/sitecore-jss-tracking";
import config from "../temp/config";
import { dataFetcher } from './../utils/dataFetcher';

const trackingApiOptions = {
  host: config.sitecoreApiHost,
  querystringParams: {
    sc_apikey: config.sitecoreApiKey
  },
  fetcher: dataFetcher
};

export function trackEventSubscribe(eventId) {
  return trackingApi
    .trackEvent([{ goalId: "Subscribe to Event" }], trackingApiOptions)
    .then(() => console.log("Page event pushed"))
    .catch(error => console.error(error));
}

export function trackEventUnsubscription(eventId) {
  return trackingApi
    .trackEvent([{ goalId: "Unsubscribe to Event" }], trackingApiOptions)
    .then(() => console.log("Page event pushed"))
    .catch(error => console.error(error));
}

export function trackEventFavorite(eventId) {
  return trackingApi
    .trackEvent([{ goalId: "Favorite Event" }], trackingApiOptions)
    .then(() => console.log("Page event pushed"))
    .catch(error => console.error(error));
}

export function trackEventUnfavorite(eventId) {
  return trackingApi
    .trackEvent([{ goalId: "Unfavorite Event" }], trackingApiOptions)
    .then(() => console.log("Page event pushed"))
    .catch(error => console.error(error));
}
