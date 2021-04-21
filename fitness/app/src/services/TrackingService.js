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