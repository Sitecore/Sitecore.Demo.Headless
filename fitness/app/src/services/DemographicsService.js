import { required } from "../utils";

export function setDemographicsFacet(age = required(), gender = required()) {
  // return post("/demographics/facet", {
  //   AgeGroup: age,
  //   Gender: gender
  // });
  return new Promise((resolve, reject) => {
    // TODO: Implement with Boxever in the client by removing the comment above and completing this promise code.
    // Or in the backend by removing this promise, uncommenting, the above code, and modifying the associated controller.
    resolve("data");
  });
}

export function setDemographicsProfile(age = required(), gender = required()) {
  // return post("/demographics/profile", {
  //   AgeGroup: age,
  //   Gender: gender
  // });
  return new Promise((resolve, reject) => {
    // TODO: Implement with Boxever in the client by removing the comment above and completing this promise code.
    // Or in the backend by removing this promise, uncommenting, the above code, and modifying the associated controller.
    resolve("data");
  });
}
