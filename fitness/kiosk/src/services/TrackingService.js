export function trackCompleteRegistration() {
  return trackGoal("Complete Registration");
}

export function trackCompleteFavoriteSports() {
  return trackGoal("Complete Favorite Sports");
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
