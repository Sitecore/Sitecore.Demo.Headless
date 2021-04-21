import { trackRegistration } from "./BoxeverService";

export function trackEventSubscribe(eventId) {
  return trackGoal("Subscribe to Event");
}

// push api
export function trackEventUnsubscription() {
  return trackGoal("Unsubscribe to Event");
}

export function trackCompleteRegistration(eventId, eventName, eventDate, eventUrlPath, sportType) {
  return trackRegistration(eventId, eventName, eventDate, eventUrlPath, sportType);
}

export function trackCompleteFavoriteSports() {
  return trackGoal("Complete Favorite Sports");
}

export function trackCompleteDemographics() {
  return trackGoal("Complete Demographics");
}

export function trackGoal(goalId) {
  // return trackingApi
  //   .trackEvent([{ goalId }], trackingApiOptions)
  //   .then(() => console.log("Goal pushed to JSS tracker API"))
  //   .catch(error => console.error(error));
  return new Promise((resolve, reject) => {
    // TODO: Implement with Boxever in the client by removing the comment above and completing this promise code.
    // Or in the backend by removing this promise, uncommenting, the above code, and modifying the associated controller.
    resolve("data");
  }).then(() => console.log("Goal pushed to Boxever"))
  .catch(error => console.error(error));
}